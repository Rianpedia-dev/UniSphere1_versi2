import React from 'react';
import { Plus, X, Sparkles, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useForum } from '../../hooks/useForum';

const FloatingCreateButton = ({ showCreateForm, setShowCreateForm, isCreating, onCreateClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <button 
      className={`forum-create-btn-bottom ${showCreateForm ? 'active' : ''}`}
      onClick={onCreateClick}
    >
      {showCreateForm ? (
        <>
          <X size={20} />
          <span>Cancel</span>
        </>
      ) : (
        <>
          <Plus size={20} />
          <span>Buat Postingan</span>
        </>
      )}
    </button>
  );
};

export default FloatingCreateButton;