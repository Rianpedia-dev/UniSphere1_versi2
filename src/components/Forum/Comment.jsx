import React, { useState } from 'react';
import { Send, User, Clock, Heart, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { generateAvatarColor } from '../../utils/helpers';
import './Comment.css';

function Comment({ comment, onReply, onLike, onDelete }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  
  // Log untuk debugging
  console.log('Comment data received:', comment, 'Is anonymous:', comment.is_anonymous);

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;

    try {
      await onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };

  const canDelete = user && (user.id === comment.user_id || user.role === 'admin');

  return (
    <div className="comment-item">
      {/* Main Comment */}
      <div className="comment-main">
        <div className="comment-avatar-wrapper">
          {comment.author?.avatar_url ? (
            <>
              {/* Log untuk debugging */}
              {console.log('Using avatar image:', comment.author.avatar_url)}
              <img 
                src={comment.author.avatar_url} 
                alt="Comment Author Avatar" 
                className="comment-avatar-img"
              />
            </>
          ) : (
            <>
              {/* Log untuk debugging */}
              {console.log('Using text avatar for:', comment.author?.username, 'Avatar URL:', comment.author?.avatar_url)}
              <div 
                className="comment-avatar"
                style={{ backgroundColor: generateAvatarColor(comment.author?.username || 'Anonymous') }}
              >
                <span>{(comment.author?.username || 'A').charAt(0).toUpperCase()}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="comment-content-wrapper">
          <div className="comment-header">
            <div className="comment-author-info">
              <span className="comment-author-name">
                {comment.is_anonymous ? 'Anonymous' : (comment.author?.username || 'User')}
              </span>
              <span className="comment-time">
                <Clock size={12} />
                {formatDate(comment.created_at)}
              </span>
            </div>
            
  
          </div>
          
          <div className="comment-content">
            {comment.content}
          </div>
        </div>
      </div>
      
      {/* Reply Form */}
      {showReplyForm && user && (
        <div className="comment-reply-form">
          <div className="comment-avatar-wrapper">
            {user.user_metadata?.avatar_url ? (
              <>
                {/* Log untuk debugging */}
                {console.log('Using user avatar image for reply:', user.user_metadata.avatar_url)}
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="User Avatar" 
                  className="comment-avatar-img"
                />
              </>
            ) : (
              <>
                {/* Log untuk debugging */}
                {console.log('Using text avatar for reply:', user.email, 'Avatar URL:', user.user_metadata?.avatar_url)}
                <div 
                  className="comment-avatar reply-avatar"
                  style={{ backgroundColor: generateAvatarColor(user.email) }}
                >
                  <User size={16} />
                </div>
              </>
            )}
          </div>
          
          <form className="comment-reply-input-wrapper" onSubmit={handleReply}>
            <textarea
              className="comment-reply-textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author?.username || 'User'}...`}
              rows="2"
            />
            <button 
              type="submit"
              className="comment-reply-submit-btn"
              disabled={!replyText.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      
      {/* Replies (nested comments) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;