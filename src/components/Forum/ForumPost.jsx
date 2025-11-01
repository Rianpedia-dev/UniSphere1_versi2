import React, { useState } from 'react';
import { Heart, MessageCircle, ThumbsUp, Laugh, MoreVertical, Share2, Eye, Flame, Star, Bookmark, Flag, Sparkles, Zap, Send, Loader } from 'lucide-react';
import { useForum } from '../../hooks/useForum';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import { generateAvatarColor } from '../../utils/helpers';
import CommentList from './CommentList.jsx';
import './ForumPost.css';

function ForumPost({ post }) {
  const { addReaction } = useForum();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [localReactions, setLocalReactions] = useState(post.reactions || {});
  // Pastikan post.id tersedia sebelum memanggil hook
  const postId = post?.id;
  
  // Hanya muat komentar saat showComments bernilai true
  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError, 
    loadComments,
    addComment, 
  } = useComments(showComments ? postId : null); // Hanya muat jika showComments true
  
  // Muat komentar saat showComments berubah menjadi true
  React.useEffect(() => {
    if (showComments && postId) {
      loadComments();
    }
  }, [showComments, postId, loadComments]);

  // Log error jika ada
  React.useEffect(() => {
    if (commentsError) {
      console.error('Error in useComments hook:', commentsError);
    }
  }, [commentsError]);

  const handleReaction = async (reactionType) => {
    if (!user) return;
    
    // Update local state first for instant feedback
    setLocalReactions(prev => {
      const currentCount = prev[reactionType] || 0;
      return {
        ...prev,
        [reactionType]: currentCount + 1
      };
    });
    
    setAnimatingReaction(reactionType);
    
    // Create sparkle effect
    const newSparkles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    
    setTimeout(() => {
      setAnimatingReaction(null);
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
    
    try {
      await addReaction(post.id, reactionType);
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Rollback local state if server update fails
      setLocalReactions(prev => {
        const currentCount = prev[reactionType] || 0;
        return {
          ...prev,
          [reactionType]: Math.max(0, currentCount - 1)
        };
      });
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

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'academic': '🎓',
      'social': '🎪',
      'family': '🏡',
      'financial': '💎',
      'general': '✨'
    };
    return emojiMap[category] || '✨';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'academic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'social': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'family': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'financial': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'general': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return colorMap[category] || colorMap['general'];
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: 'copy'
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      // Create fun notification
      const notification = document.createElement('div');
      notification.className = 'fp-copy-notification';
      notification.innerHTML = '📋 Link copied! ✨';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const reactions = { ...post.reactions, ...localReactions }; // Gabungkan reaksi dari props dan lokal
  const authorName = post.is_anonymous ? 'Anonymous' : (post.user?.username || 'User');
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  const isHotPost = totalReactions > 10 || (post.comment_count || 0) > 5;

  return (
    <div 
      className={`fp-post-card ${isHovered ? 'fp-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sparkle effects */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fp-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`
          }}
        >
          ✨
        </div>
      ))}

      {/* Animated corner decorations */}
      <div className="fp-corner-decor fp-corner-tl"></div>
      <div className="fp-corner-decor fp-corner-tr"></div>
      <div className="fp-corner-decor fp-corner-bl"></div>
      <div className="fp-corner-decor fp-corner-br"></div>



      <div className="fp-post-header">
        <div className="fp-author-section">
          {post.user?.avatar_url ? (
            <div className="fp-avatar-image-wrapper">
              <img 
                src={post.user.avatar_url} 
                alt="Author Avatar" 
                className="fp-avatar-img"
              />
              <div className="fp-avatar-ring"></div>
              <div className="fp-avatar-glow"></div>
            </div>
          ) : (
            <div 
              className="fp-avatar" 
              style={{ backgroundColor: generateAvatarColor(authorName) }}
            >
              <span>{authorName.charAt(0).toUpperCase()}</span>
              <div className="fp-avatar-ring"></div>
              <div className="fp-avatar-glow"></div>
            </div>
          )}
          <div className="fp-author-details">
            <div className="fp-author-name-row">
              <h4 className="fp-author-name">{authorName}</h4>
              {!post.is_anonymous && (
                <Star className="fp-badge-icon" size={14} />
              )}
              <Sparkles className="fp-sparkle-icon" size={12} />
            </div>
            <div className="fp-meta-row">
              <span className="fp-timestamp">
                <Zap size={10} className="fp-time-icon" />
                {formatDate(post.created_at)}
              </span>
              {post.category && (
                <>
                  <span className="fp-meta-dot">•</span>
                  <span 
                    className="fp-category-badge"
                    style={{ background: getCategoryColor(post.category) }}
                  >
                    <span className="fp-category-emoji">{getCategoryEmoji(post.category)}</span>
                    <span className="fp-category-text">{post.category}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="fp-header-actions">
          <div className="fp-dropdown-wrapper">
            <button 
              className="fp-action-btn"
              onClick={() => setShowShareMenu(!showShareMenu)}
              title="Share"
            >
              <Share2 size={18} />
            </button>
            {showShareMenu && (
              <div className="fp-dropdown-menu fp-share-menu">
                <button onClick={() => handleShare('twitter')} className="fp-dropdown-item">
                  <span>🐦</span> Twitter
                </button>
                <button onClick={() => handleShare('facebook')} className="fp-dropdown-item">
                  <span>📘</span> Facebook
                </button>
                <button onClick={() => handleShare('linkedin')} className="fp-dropdown-item">
                  <span>💼</span> LinkedIn
                </button>
                <button onClick={() => handleShare('copy')} className="fp-dropdown-item">
                  <span>📋</span> Copy Link
                </button>
              </div>
            )}
          </div>

          
        </div>
      </div>
      
      <div className="fp-post-body">
        <h3 className="fp-post-title">
          <span className="fp-title-glow">{post.title}</span>
        </h3>
        <p className={`fp-post-content ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? post.content : `${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}`}
        </p>
        {post.content.length > 200 && (
          <button 
            className="fp-read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '📖 Show less' : '📚 Read more'}
            <span className="fp-btn-arrow">{isExpanded ? '↑' : '↓'}</span>
          </button>
        )}
      </div>
      
      <div className="fp-post-stats">
        <div className="fp-stat-item">
          <MessageCircle size={14} />
          <span>{post.comment_count || 0} comments</span>
          <div className="fp-stat-bar"></div>
        </div>
        <div className="fp-stat-item">
          <Heart size={14} />
          <span>{totalReactions} reactions</span>
          <div className="fp-stat-bar"></div>
        </div>
      </div>
      
      <div className="fp-reactions-bar">
        <div className="fp-reactions-group">
          <button 
            className={`fp-reaction-btn ${reactions.heart > 0 ? 'active' : ''} ${animatingReaction === 'heart' ? 'animating' : ''}`}
            onClick={() => handleReaction('heart')}
            title="Heart"
            disabled={!user}
          >
            <Heart size={18} fill={reactions.heart > 0 ? 'currentColor' : 'none'} />
            {reactions.heart > 0 && <span className="fp-reaction-count">{reactions.heart}</span>}
            <div className="fp-reaction-popup">❤️</div>
          </button>
          
          <button 
            className={`fp-reaction-btn ${reactions.thumbsUp > 0 ? 'active' : ''} ${animatingReaction === 'thumbsUp' ? 'animating' : ''}`}
            onClick={() => handleReaction('thumbsUp')}
            title="Thumbs Up"
            disabled={!user}
          >
            <ThumbsUp size={18} fill={reactions.thumbsUp > 0 ? 'currentColor' : 'none'} />
            {reactions.thumbsUp > 0 && <span className="fp-reaction-count">{reactions.thumbsUp}</span>}
            <div className="fp-reaction-popup">👍</div>
          </button>
          
          <button 
            className={`fp-reaction-btn ${reactions.smile > 0 ? 'active' : ''} ${animatingReaction === 'smile' ? 'animating' : ''}`}
            onClick={() => handleReaction('smile')}
            title="Laugh"
            disabled={!user}
          >
            <Laugh size={18} fill={reactions.smile > 0 ? 'currentColor' : 'none'} />
            {reactions.smile > 0 && <span className="fp-reaction-count">{reactions.smile}</span>}
            <div className="fp-reaction-popup">😄</div>
          </button>
        </div>
        
        <button 
          className="fp-comment-btn" 
          disabled={!user || !post?.id}
          onClick={() => {
            // Toggle tampilan komentar
            setShowComments(!showComments);
          }}
        >
          <MessageCircle size={18} />
          <span>Comment</span>
          <div className="fp-btn-glow"></div>
        </button>
      </div>
      
      {/* Comments Section - Only show when showComments is true */}
      {showComments && (
        <CommentList
          comments={comments || []}
          loading={commentsLoading}
          error={commentsError}
          postId={post.id}
          onAddComment={async (commentData) => {
            if (!user) return Promise.reject(new Error('User not authenticated'));
            return addComment(commentData);
          }}
          onReplyComment={async (parentId, replyText) => {
            if (!user) return Promise.reject(new Error('User not authenticated'));
            // Untuk saat ini, kita hanya menambahkan komentar baru sebagai balasan
            // Implementasi balasan nested akan memerlukan modifikasi backend
            return addComment({
              user_id: user.id,
              content: replyText,
              post_id: post.id,
              is_anonymous: false
            });
          }}
          onLikeComment={async (commentId) => {
            // Implementasi like komentar jika diperlukan
            console.log('Liking comment:', commentId);
            return Promise.resolve();
          }}
          onDeleteComment={async (commentId) => {
            // Implementasi hapus komentar jika diperlukan
            console.log('Deleting comment:', commentId);
            return Promise.resolve();
          }}
        />
      )}
    </div>
  );
}

export default ForumPost