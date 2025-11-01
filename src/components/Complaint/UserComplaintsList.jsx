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
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Ref to track component mounting state
  const mountedRef = React.useRef(true);

  // Update mountedRef when component mounts/unmounts
  React.useEffect(() => {
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
    
    // Cleanup function to handle unmounting
    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  const getStatusConfig = (status) => {
    const configs = {
      resolved: { icon: CheckCircle, color: '#00ff88', label: 'Resolved' },
      rejected: { icon: null, color: '#ff4466', label: 'Rejected' },
      reviewed: { icon: AlertCircle, color: '#ffaa00', label: 'Reviewed' },
      pending: { icon: Clock, color: '#00d4ff', label: 'Pending' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { emoji: '🔥', color: '#ff4466' },
      low: { emoji: '🌿', color: '#00ff88' },
      medium: { emoji: '⚡', color: '#ffaa00' }
    };
    return configs[priority] || configs.medium;
  };

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
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error deleting complaint:', err);
      }
    }
  };

  const confirmDelete = (complaintId) => {
    setShowDeleteConfirm(complaintId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <ComplaintList 
      complaints={complaints}
      loading={loading}
      error={error}
      onView={(complaint) => setSelectedComplaint(complaint)}
      onDelete={(complaintId) => confirmDelete(complaintId)}
    />
  );
}

export default UserComplaintsList;