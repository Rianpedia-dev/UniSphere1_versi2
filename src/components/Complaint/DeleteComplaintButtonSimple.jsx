// Tombol Delete Pengaduan yang Lebih Sederhana
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const DeleteComplaintButtonSimple = ({ complaintId, onDeleted, disabled = false, className = "" }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Panggil fungsi penghapusan
      if (onDeleted) {
        await onDeleted(complaintId);
      }
      setShowConfirm(false);
    } catch (error) {
      console.error('Gagal menghapus pengaduan:', error);
      alert('Gagal menghapus pengaduan: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className={`delete-confirm-container ${className}`}>
        <div className="delete-confirm-dialog">
          <p>Yakin ingin menghapus?</p>
          <div className="delete-confirm-buttons">
            <button 
              onClick={() => setShowConfirm(false)}
              className="delete-cancel-btn"
              disabled={isDeleting}
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              className="delete-yes-btn"
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          setShowConfirm(true);
        }
      }}
      disabled={disabled || isDeleting}
      className={`delete-button ${disabled || isDeleting ? 'delete-button-disabled' : ''} ${className}`}
      title="Hapus pengaduan ini"
    >
      <Trash2 size={16} />
      <span>Hapus</span>
    </button>
  );
};

export default DeleteComplaintButtonSimple;