// Komponen Delete Button yang Sangat Sederhana
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteButton = ({ onDelete, disabled = false, className = "" }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onDelete) {
          const confirmed = window.confirm('Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.');
          if (confirmed) {
            onDelete();
          }
        }
      }}
      disabled={disabled}
      className={`delete-btn ${disabled ? 'delete-btn-disabled' : ''} ${className}`}
      title="Hapus item ini"
    >
      <Trash2 size={16} />
      <span>Hapus</span>
    </button>
  );
};

export default DeleteButton;