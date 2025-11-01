// src/pages/Admin/AdminComplaintsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useComplaints } from '../../hooks/useComplaints';
import { AlertCircle, CheckCircle, Clock, XCircle, Search, Filter, Eye, Edit, User, Calendar, AlertTriangle, ArrowUpDown, Zap, TrendingUp, Activity } from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';
import ComplaintList from '../../components/Complaint/ComplaintList.jsx';
import './AdminComplaintsPage.css';

function AdminComplaintsPage() {
  const { user } = useAuth();
  const { 
    complaints, 
    loading: complaintsLoading, 
    error: complaintsError, 
    loadAllComplaints, 
    updateComplaint 
  } = useComplaints();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localError, setLocalError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    priority: '',
    admin_notes: ''
  });
  const [activeView, setActiveView] = useState('grid'); // grid or list

  // Load all complaints for admin
  useEffect(() => {
    if (user) {
      loadAllComplaints();
    }
  }, [user]);

  const handleEditClick = (complaint) => {
    setEditingComplaint(complaint);
    setEditForm({
      status: complaint.status,
      priority: complaint.priority,
      admin_notes: complaint.admin_notes || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingComplaint) return;

    setLoading(true);
    setLocalError('');
    
    try {
      await updateComplaint(editingComplaint.id, editForm);
      setEditingComplaint(null);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} className="acp-status-icon-resolved" />;
      case 'rejected':
        return <XCircle size={16} className="acp-status-icon-rejected" />;
      case 'reviewed':
        return <AlertCircle size={16} className="acp-status-icon-reviewed" />;
      default:
        return <Clock size={16} className="acp-status-icon-pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'rejected':
        return 'Rejected';
      case 'reviewed':
        return 'Reviewed';
      default:
        return 'Pending';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'resolved':
        return '✨';
      case 'rejected':
        return '❌';
      case 'reviewed':
        return '👀';
      default:
        return '⏰';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'acp-priority-high';
      case 'low':
        return 'acp-priority-low';
      default:
        return 'acp-priority-medium';
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'low':
        return '🌱';
      default:
        return '⚡';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (statusFilter !== 'all' && complaint.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        complaint.title.toLowerCase().includes(searchLower) ||
        complaint.description.toLowerCase().includes(searchLower) ||
        (complaint.user?.username && complaint.user.username.toLowerCase().includes(searchLower)) ||
        (complaint.user?.full_name && complaint.user.full_name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (complaintsError) {
    return (
      <div className="acp-container">
        <div className="acp-error-state">
          <div className="acp-error-icon">💥</div>
          <h3>Oops! Something went wrong</h3>
          <p>{complaintsError}</p>
          <button className="acp-retry-btn" onClick={() => loadAllComplaints()}>
            <Zap size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="acp-container">
      {/* Animated Background with Particles */}
      <div className="acp-background">
        <div className="acp-gradient-orb acp-orb-1"></div>
        <div className="acp-gradient-orb acp-orb-2"></div>
        <div className="acp-gradient-orb acp-orb-3"></div>
        <div className="acp-grid-pattern"></div>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="acp-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Futuristic Header */}
      <div className="acp-header">
        <div className="acp-header-content">
          <div className="acp-title-section">
            <div className="acp-icon-wrapper">
              <AlertTriangle className="acp-main-icon" size={40} />
              <div className="acp-icon-glow"></div>
            </div>
            <div className="acp-title-text">
              <h1 className="acp-title">
                <span className="acp-title-gradient">Complaints</span>
                <span className="acp-title-light">Command Center</span>
              </h1>
              <p className="acp-subtitle">🚀 Manage complaints at lightspeed</p>
            </div>
          </div>
          
          {/* Stats Dashboard */}
          <div className="acp-stats-grid">
            <div className="acp-stat-card acp-stat-pending">
              <div className="acp-stat-header">
                <Clock size={24} />
                <span className="acp-stat-emoji">⏰</span>
              </div>
              <div className="acp-stat-content">
                <div className="acp-stat-number">
                  {complaints.filter(c => c.status === 'pending').length}
                </div>
                <div className="acp-stat-label">Pending</div>
              </div>
              <div className="acp-stat-bg"></div>
            </div>
            
            <div className="acp-stat-card acp-stat-reviewed">
              <div className="acp-stat-header">
                <Activity size={24} />
                <span className="acp-stat-emoji">👀</span>
              </div>
              <div className="acp-stat-content">
                <div className="acp-stat-number">
                  {complaints.filter(c => c.status === 'reviewed').length}
                </div>
                <div className="acp-stat-label">Reviewed</div>
              </div>
              <div className="acp-stat-bg"></div>
            </div>
            
            <div className="acp-stat-card acp-stat-resolved">
              <div className="acp-stat-header">
                <TrendingUp size={24} />
                <span className="acp-stat-emoji">✨</span>
              </div>
              <div className="acp-stat-content">
                <div className="acp-stat-number">
                  {complaints.filter(c => c.status === 'resolved').length}
                </div>
                <div className="acp-stat-label">Resolved</div>
              </div>
              <div className="acp-stat-bg"></div>
            </div>

            <div className="acp-stat-card acp-stat-total">
              <div className="acp-stat-header">
                <Zap size={24} />
                <span className="acp-stat-emoji">🎯</span>
              </div>
              <div className="acp-stat-content">
                <div className="acp-stat-number">
                  {complaints.length}
                </div>
                <div className="acp-stat-label">Total</div>
              </div>
              <div className="acp-stat-bg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="acp-controls">
        <div className="acp-search-wrapper">
          <div className="acp-search-container">
            <Search size={20} className="acp-search-icon" />
            <input
              type="text"
              placeholder="🔍 Search complaints by title, description, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="acp-search-input"
            />
            {searchTerm && (
              <button 
                className="acp-search-clear"
                onClick={() => setSearchTerm('')}
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="acp-filter-bar">
          <div className="acp-filter-group">
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="acp-select"
            >
              <option value="all">🌐 All Status</option>
              <option value="pending">⏰ Pending</option>
              <option value="reviewed">👀 Reviewed</option>
              <option value="resolved">✨ Resolved</option>
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>
          
          <div className="acp-filter-group">
            <ArrowUpDown size={18} />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="acp-select"
            >
              <option value="created_at-desc">🆕 Newest First</option>
              <option value="created_at-asc">📅 Oldest First</option>
              <option value="priority-desc">🔥 High Priority</option>
              <option value="priority-asc">🌱 Low Priority</option>
            </select>
          </div>

          <div className="acp-view-toggle">
            <button 
              className={`acp-view-btn ${activeView === 'grid' ? 'active' : ''}`}
              onClick={() => setActiveView('grid')}
            >
              <div className="acp-grid-icon">⊞</div>
            </button>
            <button 
              className={`acp-view-btn ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              <div className="acp-list-icon">☰</div>
            </button>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      {searchTerm && (
        <div className="acp-results-banner">
          <Zap size={16} />
          <span>Found {filteredComplaints.length} result{filteredComplaints.length !== 1 ? 's' : ''} for "{searchTerm}"</span>
        </div>
      )}

      {/* Complaints Display */}
      <div className="acp-content">
        {complaintsLoading ? (
          <LoadingScreen />
        ) : filteredComplaints.length === 0 ? (
          <div className="acp-empty-state">
            <div className="acp-empty-icon">
              {searchTerm ? '🔍' : '🎉'}
            </div>
            <h3>{searchTerm ? 'No results found' : 'All clear!'}</h3>
            <p>{searchTerm ? 'Try adjusting your search or filters' : 'No complaints at the moment. Great job! 🌟'}</p>
          </div>
        ) : (
          <div className={`acp-complaints-${activeView}`}>
            {filteredComplaints.map((complaint, index) => (
              <div 
                key={complaint.id} 
                className="acp-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Card Glow Effect */}
                <div className="acp-card-glow"></div>
                
                {/* Priority Badge */}
                <div className={`acp-priority-badge ${getPriorityClass(complaint.priority)}`}>
                  <span className="acp-priority-emoji">{getPriorityEmoji(complaint.priority)}</span>
                  <span className="acp-priority-text">{complaint.priority}</span>
                </div>

                {/* Card Header */}
                <div className="acp-card-header">
                  <div className="acp-user-section">
                    <div className="acp-avatar">
                      <User size={20} />
                      <div className="acp-avatar-ring"></div>
                    </div>
                    <div className="acp-user-details">
                      <h4 className="acp-user-name">
                        {complaint.user?.full_name || complaint.user?.username || 'Anonymous User'}
                      </h4>
                      <p className="acp-user-email">
                        {complaint.user?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="acp-date-badge">
                    <Calendar size={14} />
                    <span>{new Date(complaint.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="acp-card-body">
                  <h3 className="acp-card-title">{complaint.title}</h3>
                  <p className="acp-card-description">{complaint.description}</p>
                  
                  {complaint.image_url && (
                    <div className="acp-image-container">
                      <img src={complaint.image_url} alt="Evidence" />
                      <div className="acp-image-overlay">
                        <Eye size={24} />
                      </div>
                    </div>
                  )}
                  
                  <div className="acp-category-tag">
                    <span className="acp-category-icon">📁</span>
                    <span>{complaint.category}</span>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="acp-card-footer">
                  <div className="acp-status-display">
                    {getStatusIcon(complaint.status)}
                    <span className="acp-status-emoji">{getStatusEmoji(complaint.status)}</span>
                    <span className={`acp-status-text acp-status-${complaint.status}`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>
                  
                  <div className="acp-actions">
                    <button 
                      className="acp-btn acp-btn-view"
                      onClick={() => setViewingComplaint(complaint)}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    
                    <button 
                      className="acp-btn acp-btn-edit"
                      onClick={() => handleEditClick(complaint)}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingComplaint && (
        <div className="acp-modal-overlay" onClick={() => setViewingComplaint(null)}>
          <div className="acp-modal acp-modal-view" onClick={(e) => e.stopPropagation()}>
            <button 
              className="acp-modal-close"
              onClick={() => setViewingComplaint(null)}
            >
              <XCircle size={24} />
            </button>
            
            <div className="acp-modal-header">
              <div className="acp-modal-title">
                <Eye size={24} />
                <h3>Complaint Details</h3>
              </div>
              <div className={`acp-modal-status acp-status-${viewingComplaint.status}`}>
                {getStatusEmoji(viewingComplaint.status)} {getStatusText(viewingComplaint.status)}
              </div>
            </div>
            
            <div className="acp-modal-content">
              <div className="acp-detail-section">
                <label>👤 User Information</label>
                <div className="acp-detail-box">
                  <p><strong>Name:</strong> {viewingComplaint.user?.full_name || 'N/A'}</p>
                  <p><strong>Email:</strong> {viewingComplaint.user?.email || 'N/A'}</p>
                  <p><strong>Username:</strong> {viewingComplaint.user?.username || 'N/A'}</p>
                </div>
              </div>

              <div className="acp-detail-section">
                <label>📋 Complaint Details</label>
                <div className="acp-detail-box">
                  <p><strong>Title:</strong> {viewingComplaint.title}</p>
                  <p><strong>Category:</strong> {viewingComplaint.category}</p>
                  <p><strong>Priority:</strong> {getPriorityEmoji(viewingComplaint.priority)} {viewingComplaint.priority}</p>
                  <p><strong>Description:</strong></p>
                  <p className="acp-description-text">{viewingComplaint.description}</p>
                </div>
              </div>

              {viewingComplaint.image_url && (
                <div className="acp-detail-section">
                  <label>🖼️ Evidence</label>
                  <div className="acp-modal-image">
                    <img src={viewingComplaint.image_url} alt="Evidence" />
                  </div>
                </div>
              )}

              {viewingComplaint.admin_notes && (
                <div className="acp-detail-section">
                  <label>📝 Admin Notes</label>
                  <div className="acp-detail-box acp-notes-box">
                    {viewingComplaint.admin_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingComplaint && (
        <div className="acp-modal-overlay" onClick={() => setEditingComplaint(null)}>
          <div className="acp-modal acp-modal-edit" onClick={(e) => e.stopPropagation()}>
            <button 
              className="acp-modal-close"
              onClick={() => setEditingComplaint(null)}
            >
              <XCircle size={24} />
            </button>
            
            <div className="acp-modal-header">
              <div className="acp-modal-title">
                <Edit size={24} />
                <h3>Edit Complaint</h3>
              </div>
              <div className="acp-complaint-id">
                ID: {editingComplaint.id ? editingComplaint.id.slice(0, 8) : '...'}
              </div>
            </div>
            
            {localError && (
              <div className="acp-alert acp-alert-error">
                <AlertCircle size={20} />
                <span>{localError}</span>
              </div>
            )}
            
            <div className="acp-modal-content">
              <div className="acp-preview-section">
                <h4 className="acp-preview-title">📌 {editingComplaint.title}</h4>
                <p className="acp-preview-desc">{editingComplaint.description}</p>
                {editingComplaint.image_url && (
                  <div className="acp-preview-image">
                    <img src={editingComplaint.image_url} alt="Evidence" />
                  </div>
                )}
              </div>
              
              <div className="acp-form">
                <div className="acp-form-group">
                  <label>
                    <span className="acp-label-icon">🎯</span>
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="acp-form-select"
                  >
                    <option value="pending">⏰ Pending</option>
                    <option value="reviewed">👀 Reviewed</option>
                    <option value="resolved">✨ Resolved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
                
                <div className="acp-form-group">
                  <label>
                    <span className="acp-label-icon">⚡</span>
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                    className="acp-form-select"
                  >
                    <option value="low">🌱 Low</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High</option>
                  </select>
                </div>
                
                <div className="acp-form-group">
                  <label>
                    <span className="acp-label-icon">📝</span>
                    Admin Notes
                  </label>
                  <textarea
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                    placeholder="Add your notes here... (Optional)"
                    className="acp-form-textarea"
                    rows="4"
                  />
                </div>
              </div>
            </div>
            
            <div className="acp-modal-footer">
              <button 
                className="acp-btn acp-btn-cancel"
                onClick={() => setEditingComplaint(null)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="acp-btn acp-btn-save"
                onClick={handleSaveEdit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="acp-spinner"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminComplaintsPage;