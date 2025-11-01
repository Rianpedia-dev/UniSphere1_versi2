// src/components/Complaint/UserComplaintsList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Clock, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import LoadingScreen from '../common/LoadingScreen.jsx';
import ComplaintList from './ComplaintList.jsx';
import './UserComplaintsList.css';

function UserComplaintsList({ userId }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref to track component mounting state
  const mountedRef = React.useRef(true);

  useEffect(() => {
    // Update mountedRef when component mounts/unmounts
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadUserComplaints = async () => {
    try {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (mountedRef.current) {
        setComplaints(data || []);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error loading complaints:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserComplaints();
    }
  }, [userId]);

  const handleDeleteComplaint = async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId)
        .eq('user_id', userId);

      if (error) throw error;
      
      if (mountedRef.current) {
        setComplaints(prev => prev.filter(c => c.id !== complaintId));
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error deleting complaint:', err);
      }
    }
  };

  return (
    <ComplaintList 
      complaints={complaints}
      loading={loading}
      error={error}
      onView={() => {}} // No-op since selectedComplaint isn't used in this component
      onDelete={handleDeleteComplaint}
    />
  );
}

export default UserComplaintsList;