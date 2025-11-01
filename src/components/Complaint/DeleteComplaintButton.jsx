// src/components/Complaint/DeleteComplaintButton.jsx
import React, { useState } from 'react';
import { Trash2, XCircle, AlertTriangle } from 'lucide-react';
import { useComplaints } from '../../hooks/useComplaints';
import './DeleteComplaintButton.css';

function DeleteComplaintButton({ complaintId, complaintTitle, onDeleted, disabled = false }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { deleteComplaint } = useComplaints();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteComplaint(complaintId);
      setShowConfirm(false);
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengaduan');
      console.error('Error deleting complaint:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dcb-container">
      <button 
        className={`dcb-delete-btn ${disabled ? 'dcb-btn-disabled' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setShowConfirm(true);
          }
        }}
        disabled={disabled || isDeleting}
        title="Hapus pengaduan ini"
      >
        <Trash2 size={16} />
        <span>Hapus</span>
      </button>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="dcb-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="dcb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dcb-modal-header">
              <AlertTriangle size={24} className="dcb-warning-icon" />
              <h3>Konfirmasi Penghapusan</h3>
              <button 
                className="dcb-modal-close"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="dcb-modal-body">
              <p>Apakah Anda yakin ingin menghapus pengaduan ini?</p>
              <div className="dcb-complaint-title">
                "<strong>{complaintTitle}</strong>"
              </div>
              <p className="dcb-warning-text">
                Tindakan ini tidak dapat dibatalkan. Pengaduan akan dihapus secara permanen.
              </p>
              
              {error && (
                <div className="dcb-error-message">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
            
            <div className="dcb-modal-footer">
              <button 
                className="dcb-btn-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button 
                className="dcb-btn-confirm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="dcb-spinner"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Hapus Pengaduan
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

export default DeleteComplaintButton;