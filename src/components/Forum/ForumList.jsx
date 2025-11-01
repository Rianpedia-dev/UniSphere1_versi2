import React, { useState } from 'react';
import ForumPost from '../Forum/ForumPost.jsx';
import { Plus, Sparkles, MessageSquare, TrendingUp, X } from 'lucide-react';
import LoadingScreen from '../common/LoadingScreen.jsx';
import { useAuth } from '../../hooks/useAuth';
import './ForumList.css';

function ForumList({ 
  posts,
  loading,
  error,
  showCreateForm = false, 
  setShowCreateForm = () => {}, 
  newPost = { title: '', content: '', category: '' }, 
  setNewPost = () => {}, 
  handleCreatePost = () => {},
  isCreating = false 
}) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: '🌟 All Topics', emoji: '🌟' },
    { value: 'academic', label: '📚 Academic', emoji: '📚' },
    { value: 'social', label: '🎭 Social', emoji: '🎭' },
    { value: 'family', label: '🏠 Family', emoji: '🏠' },
    { value: 'financial', label: '💰 Financial', emoji: '💰' },
    { value: 'general', label: '💬 General', emoji: '💬' }
  ];



  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (error) {
    return (
      <div className="forum-list-container">
        <div className="forum-error-message">
          <div className="error-icon">⚠️</div>
          <p>Oops! Something went wrong</p>
          <span className="error-detail">{error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-list-container">
      {/* Animated Background */}
      <div className="forum-bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Header Section */}
      <div className="forum-header">
        <div className="forum-header-content">
          <div className="forum-title-group">
            <MessageSquare className="forum-icon" size={32} />
            <div>
              <h2 className="forum-title">
                Support Forum
                <Sparkles className="sparkle-icon" size={20} />
              </h2>
              <p className="forum-subtitle">Share, connect, and grow together ✨</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="forum-stats">
          <div className="stat-item">
            <TrendingUp size={16} />
            <span>{posts.length} Posts</span>
          </div>
          <div className="stat-item">
            <MessageSquare size={16} />
            <span>Active Community</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="forum-category-filter">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`category-chip ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            <span className="category-emoji">{cat.emoji}</span>
            <span className="category-label">{cat.label.replace(/^.+\s/, '')}</span>
          </button>
        ))}
      </div>

      {/* Create Post Popup */}
      {showCreateForm && user && (
        <div className="forum-create-popup-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="forum-create-popup" onClick={(e) => e.stopPropagation()}>
            <div className="forum-create-popup-header">
              <h3>✍️ Create New Post</h3>
              <button className="forum-popup-close-btn" onClick={() => setShowCreateForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="forum-popup-form">
              <div className="form-group">
                <label className="form-label">📝 Title</label>
                <input
                  type="text"
                  placeholder="What's your topic?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="forum-input"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🏷️ Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="forum-select"
                  required
                >
                  <option value="">Choose a category...</option>
                  <option value="academic">📚 Academic Stress</option>
                  <option value="social">🎭 Social Issues</option>
                  <option value="family">🏠 Family Concerns</option>
                  <option value="financial">💰 Financial</option>
                  <option value="general">💬 General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">💭 Content</label>
                <textarea
                  placeholder="Share your story, ask for advice, or start a discussion..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="forum-textarea"
                  rows="5"
                  required
                />
              </div>

              <div className="forum-popup-actions">
                <button 
                  type="submit" 
                  className="forum-submit-btn"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="cp-spin cp-spinner-inline" style={{width: '20px', height: '20px'}}></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Publish Post</span>
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="forum-cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X size={20} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Posts List */}
      {loading && !posts.length ? (
        <LoadingScreen />
      ) : (
        <div className="forum-posts-grid">
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="forum-post-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ForumPost post={post} key={post.id} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <div className="forum-empty-state">
          <div className="empty-icon">🌟</div>
          <h3>No posts yet!</h3>
          <p>
            {selectedCategory === 'all' 
              ? "Be the first to share your thoughts and start a conversation!"
              : `No posts in this category yet. Try another category or create a new post!`}
          </p>
          {user && (
            <button 
              className="empty-action-btn"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={20} />
              <span>Create First Post</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ForumList;