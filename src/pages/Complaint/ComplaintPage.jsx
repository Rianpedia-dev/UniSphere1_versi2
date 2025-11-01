// src/pages/Complaint/ComplaintPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useComplaints } from '../../hooks/useComplaints.js';
import { Plus, MessageCircle, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ComplaintForm from '../../components/Complaint/ComplaintForm.jsx';
import ComplaintList from '../../components/Complaint/ComplaintList.jsx';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';
import './ComplaintPage.css';

function ComplaintPage() {
  const { user } = useAuth();
  const { 
    complaints, 
    loading, 
    error, 
    loadComplaints,
    addComplaint,
    deleteComplaint
  } = useComplaints(user?.id);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  
  // Ref to track component mounting state
  const mountedRef = React.useRef(true);
  
  // State to force UserComplaintsList re-render
  const [userComplaintsListKey, setUserComplaintsListKey] = useState(0);

  // Update mountedRef when component mounts/unmounts
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Load complaints when user changes
  React.useEffect(() => {
    if (user) {
      loadComplaints();
    }
  }, [user, loadComplaints]);

  if (!user) {
    return (
      <div className="cp-access-denied">
        <div className="cp-denied-content">
          <h2>Akses Ditolak</h2>
          <p>Silakan login untuk mengakses sistem pengaduan.</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Harap unggah file gambar (JPEG, PNG, dll)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Ukuran file harus kurang dari 5MB');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setLocalError('');
  };

  const handleAddComplaint = async (complaintData) => {
    try {
      await addComplaint(complaintData);
      setShowSuccess(true);
      setShowCreateForm(false);
      // Force re-render of complaint list
      setUserComplaintsListKey(prev => prev + 1);
    } catch (error) {
      setLocalError(error.message || 'Gagal mengirim pengaduan');
      throw error;
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      await deleteComplaint(complaintId);
      // Force re-render of complaint list
      setUserComplaintsListKey(prev => prev + 1);
    } catch (error) {
      setLocalError(error.message || 'Gagal menghapus pengaduan');
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className="cp-container">


      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-content">
          <div className="cp-title-group">
            <MessageCircle size={32} />
            <div>
              <h1>Sistem Pengaduan</h1>
              <p>Ajukan pengaduan baru</p>
            </div>
          </div>
          
          <button 
            className={`cp-create-btn ${showCreateForm ? 'cp-btn-active' : ''}`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <div className="cp-btn-icon">
              <Plus size={18} className={!showCreateForm ? '' : 'cp-hidden'} />
              <span className={showCreateForm ? '' : 'cp-hidden'} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                &times;
              </span>
            </div>
            <span className="cp-btn-text">{!showCreateForm ? 'Pengaduan Baru' : 'Batal'}</span>
          </button>
        </div>
      </div>

      {/* Complaint Form */}
      {showCreateForm && !showSuccess && (
        <ComplaintForm 
          onSubmit={handleAddComplaint}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      {/* Success Message */}
      {showSuccess && (
        <div className="cp-form-container cp-success-container">
          <div className="cp-success-content">
            <CheckCircle size={60} className="cp-success-icon" />
            <h3>Pengaduan Terkirim! 🎉</h3>
            <p>Kami akan segera meninjau pengaduan Anda</p>
            <button 
              className="cp-success-btn"
              onClick={() => {
                if (mountedRef.current) {
                  setShowSuccess(false);
                  setShowCreateForm(false);
                }
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      
      {/* Complaints List */}
      <div className="cp-list-section">
        <div className="cp-section-header">
          <div className="cp-section-title">
            <User size={20} />
            <h2>Pengaduan Saya</h2>
          </div>
          <div className="cp-section-badge">
            <Clock size={14} />
            <span>Aktivitas Terbaru</span>
          </div>
        </div>
        
        <ComplaintList 
          complaints={complaints} 
          loading={loading} 
          error={error || localError} 
          onDelete={handleDeleteComplaint}
          key={`user-complaints-${userComplaintsListKey}`} 
        />
      </div>
    </div>
  );
}

export default ComplaintPage;