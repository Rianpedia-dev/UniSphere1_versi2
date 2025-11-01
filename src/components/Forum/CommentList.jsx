import React, { useState } from 'react';
import { MessageCircle, Loader, AlertCircle } from 'lucide-react';
import LoadingScreen from '../common/LoadingScreen.jsx';
import Comment from './Comment.jsx';
import CommentForm from './CommentForm.jsx';
import './CommentList.css';

function CommentList({ 
  comments = [], 
  loading = false, 
  error = null, 
  postId, 
  onAddComment, 
  onReplyComment, 
  onLikeComment, 
  onDeleteComment 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (commentData) => {
    if (!postId || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(commentData);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyComment = async (parentId, replyText) => {
    if (!parentId || !replyText || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onReplyComment(parentId, replyText);
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!commentId || isSubmitting) return;
    
    try {
      await onLikeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || isSubmitting) return;
    
    try {
      await onDeleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  // Tampilkan error jika ada
  if (error) {
    console.error('CommentList error:', error);
    return (
      <div className="cml-error">
        <AlertCircle size={24} />
        <div className="cml-error-content">
          <h4>Error Loading Comments</h4>
          <p>{error.message || 'Failed to load comments'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cml-container">
      <div className="cml-header">
        <div className="cml-title">
          <MessageCircle size={20} />
          <h3>Comments ({comments.length})</h3>
        </div>
      </div>

      {/* Loading state - hanya tampilkan jika loading dan belum ada komentar */}
      {loading && comments.length === 0 ? (
        <LoadingScreen />
      ) : (
        <>
          {comments && comments.length > 0 ? (
            <div className="cml-items">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReplyComment}
                  onLike={handleLikeComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="cml-empty">
              <MessageCircle size={48} />
              <h4>No comments yet</h4>
              <p>Be the first to share your thoughts!</p>
            </div>
          )}
        </>
      )}
      
      {/* Loading overlay - tampilkan jika loading dan sudah ada komentar */}
      {loading && comments.length > 0 && (
        <div className="cml-overlay">
          <Loader className="cml-spinner spin-animation" size={24} />
          <span>Updating comments...</span>
        </div>
      )}
      
      {/* Comment Form - always visible at the bottom */}
      <div className="cml-form-section">
        <h4>Add a Comment</h4>
        <CommentForm
          postId={postId}
          onSubmit={handleAddComment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CommentList;