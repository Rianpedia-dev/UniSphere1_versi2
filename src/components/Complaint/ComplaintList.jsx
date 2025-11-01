// src/components/Complaint/ComplaintList.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import ComplaintItem from './ComplaintItem.jsx';
import LoadingScreen from '../common/LoadingScreen.jsx';
import { useAuth } from '../../hooks/useAuth';
import './ComplaintList.css';

function ComplaintList({ 
  complaints = [], 
  loading = false, 
  error = null, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin = false,
  userId = null 
}) {
  const { user } = useAuth();
  const [localError, setLocalError] = useState(error);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  
  // Update local error when prop error changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  const handleRetry = () => {
    // This would typically call a function to reload data
    window.location.reload();
  };

  const handleView = (complaint) => {
    setExpandedComplaint(expandedComplaint === complaint.id ? null : complaint.id);
    if (onView) onView(complaint);
  };

  const handleEdit = (complaint) => {
    if (onEdit) onEdit(complaint);
  };

  const handleDelete = (complaintId) => {
    if (onDelete) onDelete(complaintId);
  };

  if (loading && complaints.length === 0) {
    return <LoadingScreen />;
  }

  if (localError) {
    return (
      <div className="cl-error-container">
        <AlertTriangle size={48} />
        <h3>Error Loading Complaints</h3>
        <p>{localError}</p>
        <button onClick={handleRetry} className="cl-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="cl-empty-container">
        <div className="cl-empty-icon">📭</div>
        <h3>No Complaints Yet</h3>
        <p>You haven't submitted any complaints yet.</p>
      </div>
    );
  }

  return (
    <div className="cl-container">
      {/* Header Stats */}
      <div className="cl-header">
        <div className="cl-stats">
          <div className="cl-stat">Total: {complaints.length}</div>
          <div className="cl-stat">Pending: {complaints.filter(c => c.status === 'pending').length}</div>
          <div className="cl-stat">Resolved: {complaints.filter(c => c.status === 'resolved').length}</div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="cl-grid">
        {complaints.map((complaint) => (
          <ComplaintItem
            key={complaint.id}
            complaint={complaint}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUser={user}
            isAdmin={isAdmin}
            isExpanded={expandedComplaint === complaint.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ComplaintList;