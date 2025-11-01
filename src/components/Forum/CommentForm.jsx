import React, { useState } from 'react';
import { Send, User, Smile, Image, Paperclip } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { generateAvatarColor } from '../../utils/helpers';
import './CommentForm.css';

function CommentForm({ postId, onSubmit, isSubmitting = false }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user || isSubmitting) return;

    try {
      await onSubmit({
        post_id: postId,
        user_id: user.id,
        content: commentText,
        is_anonymous: isAnonymous
      });
      setCommentText('');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="comment-form-container">
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-header">
          <div 
            className="comment-form-avatar"
            style={{ backgroundColor: generateAvatarColor(user?.email || 'U') }}
          >
            <span>{(user?.email || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <div className="comment-form-user-info">
            <span className="comment-form-username">
              {isAnonymous ? 'Anonymous' : (user?.user_metadata?.username || user?.email?.split('@')[0] || 'User')}
            </span>
            <label className="comment-anonymous-toggle">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Anonymous</span>
            </label>
          </div>
        </div>

        <div className="comment-form-body">
          <textarea
            className="comment-form-textarea"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your comment... (Press Ctrl/Cmd + Enter to submit)"
            rows="4"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="comment-form-footer">
          <div className="comment-form-options">
          </div>

          <div className="comment-form-actions">
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="comment-submit-spinner"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;