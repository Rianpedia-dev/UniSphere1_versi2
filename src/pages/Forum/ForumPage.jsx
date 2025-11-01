import React, { useState, useEffect } from 'react';
import ForumList from '../../components/Forum/ForumList.jsx';
import FloatingCreateButton from '../../components/Forum/FloatingCreateButton.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useForum } from '../../hooks/useForum';
import { Plus, X, Sparkles, Loader } from 'lucide-react';
import './ForumPage.css';

function ForumPage() {
  const [glitchText, setGlitchText] = useState('Support Forum');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const { user } = useAuth();
  const { posts, loading, error, createPost } = useForum();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const [isCreating, setIsCreating] = useState(false);
  
  // Fun glitch effect for title
  useEffect(() => {
    const glitchChars = ['S', 'u', 'p', 'p', '0', 'r', 't', ' ', 'F', '0', 'r', 'u', 'm', '!'];
    const originalText = 'Support Forum';
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomText = originalText.split('').map(char => 
          Math.random() > 0.8 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');
        setGlitchText(randomText);
        
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Generate floating emojis
  useEffect(() => {
    const emojis = ['🚀', '✨', '💬', '🌟', '💫', '🎮', '🤖', '👾'];
    const newFloatingEmojis = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingEmojis(newFloatingEmojis);
  }, []);
  
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    setIsCreating(true);
    try {
      await createPost({
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category || 'general',
        is_anonymous: false,
        reactions: {}
      });

      setNewPost({ title: '', content: '', category: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="forum-page-container-futuristic">
      {/* Animated background elements */}
      <div className="forum-bg-grid"></div>
      <div className="forum-bg-orbs">
        <div className="forum-orb forum-orb-1"></div>
        <div className="forum-orb forum-orb-2"></div>
        <div className="forum-orb forum-orb-3"></div>
      </div>
      
      {/* Floating emojis */}
      {floatingEmojis.map(item => (
        <div 
          key={item.id}
          className="forum-floating-emoji"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      <header className="forum-header-futuristic">
        <div className="forum-header-glow"></div>
        <div className="forum-robot-icon">🤖</div>
        <h1 className="forum-title-glitch" data-text={glitchText}>
          {glitchText}
        </h1>
        <p className="forum-subtitle">
          <span className="forum-typing-text">Diskusi masa depan dimulai di sini...</span>
          <span className="forum-cursor">|</span>
        </p>
        
        {/* Fun status indicator */}
        <div className="forum-status-bar">
          <div className="forum-status-item">
            <span className="forum-status-dot forum-pulse-green"></span>
            <span>Online</span>
          </div>
        </div>
      </header>
      
      <main className="forum-main-futuristic">
        <div className="forum-content-wrapper">
          {/* Decorative corner accents */}
          <div className="forum-corner forum-corner-tl"></div>
          <div className="forum-corner forum-corner-tr"></div>
          <div className="forum-corner forum-corner-bl"></div>
          <div className="forum-corner forum-corner-br"></div>
          
          <ForumList 
            posts={posts}
            loading={loading}
            error={error}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            newPost={newPost}
            setNewPost={setNewPost}
            handleCreatePost={handleCreatePost}
            isCreating={isCreating}
          />
        </div>
      </main>
      
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
                      <Loader className="spin-animation" size={20} />
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
      
      {/* Floating Create Post Button - This will stay fixed regardless of scroll */}
      {user && (
        <button 
          className={`forum-create-btn-bottom ${showCreateForm ? 'active' : ''}`}
          onClick={() => setShowCreateForm(!showCreateForm)}
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
      )}
      
      {/* Bottom decoration */}
      <div className="forum-bottom-wave"></div>
    </div>
  );
}

export default ForumPage;