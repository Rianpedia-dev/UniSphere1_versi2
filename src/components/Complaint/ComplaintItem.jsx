// src/components/Complaint/ComplaintItem.jsx
import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, AlertTriangle, Edit, Eye } from 'lucide-react';
import DeleteButton from '../common/DeleteButton.jsx';
import './ComplaintItem.css';

function ComplaintItem({ complaint, onView, onEdit, onDelete, currentUser, isAdmin = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const getStatusConfig = (status) => {
    const configs = {
      resolved: { icon: CheckCircle, color: '#00ff88', label: 'Resolved' },
      rejected: { icon: AlertCircle, color: '#ff4466', label: 'Rejected' },
      reviewed: { icon: AlertTriangle, color: '#ffaa00', label: 'Reviewed' },
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

  const statusConfig = getStatusConfig(complaint.status);
  const priorityConfig = getPriorityConfig(complaint.priority);
  const StatusIcon = statusConfig.icon;

  const handleDelete = () => {
    onDelete(complaint.id);
    setShowDeleteConfirm(false);
  };

  const canBeModified = complaint.status !== 'resolved' && complaint.status !== 'rejected';
  const isOwner = currentUser && complaint.user_id === currentUser.id;

  return (
    <div className="ci-card">
      {/* Main clickable area */}
      <div 
        className="ci-card-main"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="ci-card-header">
          <h3 className="ci-title">{complaint.title}</h3>
          <div 
            className="ci-status-badge" 
            style={{ 
              '--status-bg-color': `${statusConfig.color}20`,
              '--status-color': statusConfig.color 
            }}
          >
            {StatusIcon && <StatusIcon size={14} />}
            <span>{statusConfig.label}</span>
          </div>
        </div>
        <div className="ci-card-footer">
          <div className="ci-date">
            <Clock size={12} />
            <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
          </div>
          <div 
            className="ci-priority-badge"
            style={{ '--priority-color': priorityConfig.color }}
          >
            {priorityConfig.emoji} {complaint.priority}
          </div>
        </div>
      </div>

      {/* Collapsible details section */}
      <div className={`ci-details ${isExpanded ? 'expanded' : ''}`}>
        <div className="ci-category">{complaint.category}</div>
        <p className="ci-desc">{complaint.description || 'No description provided.'}</p>
        
        {complaint.image_url && (
          <div className="ci-image-container">
            <img 
              src={complaint.image_url} 
              alt="Evidence" 
              className="ci-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="ci-actions">
          <button 
            className="ci-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onView(complaint);
            }}
          >
            <Eye size={16} />
            <span>Lihat Detail</span>
          </button>
          
          {(isAdmin || isOwner) && (
            <>
              {isAdmin && (
                <button 
                  className="ci-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(complaint);
                  }}
                  disabled={!canBeModified}
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              )}
              <DeleteButton
                onDelete={() => onDelete && onDelete(complaint.id)}
                disabled={!canBeModified}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintItem;