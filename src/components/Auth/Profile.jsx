import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateAvatarColor } from '../../utils/helpers';
import { Edit3, Save, X, LogOut, Mail, Calendar, Sparkles, User, FileText, Shield, Award, Zap } from 'lucide-react';
import './Profile.css';

// Komponen untuk memilih avatar
const AvatarSelector = ({ selectedAvatar, onAvatarChange }) => {
  // Ambil daftar avatar dari direktori src/assets/avatar
  const avatars = [
    { id: 'c1.png', name: 'Avatar 1' },
    { id: 'c2.png', name: 'Avatar 2' },
    { id: 'c3.png', name: 'Avatar 3' },
    { id: 'c4.png', name: 'Avatar 4' },
    { id: 'c5.png', name: 'Avatar 5' },
    { id: 'c6.png', name: 'Avatar 6' },
    { id: 'c7.png', name: 'Avatar 7' },
    { id: 'c8.png', name: 'Avatar 8' },
    { id: 'c9.png', name: 'Avatar 9' },
    { id: 'c10.png', name: 'Avatar 10' },
    { id: 'c11.png', name: 'Avatar 11' },
    { id: 'c12.png', name: 'Avatar 12' },
    { id: 'c13.png', name: 'Avatar 13' },
    { id: 'c14.png', name: 'Avatar 14' },
    { id: 'c15.png', name: 'Avatar 15' },
    { id: 'c16.png', name: 'Avatar 16' },
  ];

  return (
    <div className="prof-avatar-selector">
      <h3>Select Avatar</h3>
      <div className="prof-avatar-grid">
        {avatars.map((avatar) => {
          const isSelected = selectedAvatar === `/assets/avatar/${avatar.id}`;
          return (
            <div
              key={avatar.id}
              className={`prof-avatar-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onAvatarChange(`/assets/avatar/${avatar.id}`)}
            >
              <img 
                src={`/assets/avatar/${avatar.id}`} 
                alt={avatar.name}
                className="prof-avatar-option-img"
              />
              {isSelected && <div className="prof-avatar-selected-check">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Profile() {
  const { user, updateProfile, signOut, error: authError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
    full_name: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    avatar_url: user?.user_metadata?.avatar_url || ''
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
        full_name: user?.user_metadata?.full_name || '',
        bio: user?.user_metadata?.bio || '',
        avatar_url: user?.user_metadata?.avatar_url || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setLocalError('');
    
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      full_name: user.user_metadata?.full_name || '',
      bio: user.user_metadata?.bio || '',
      avatar_url: user.user_metadata?.avatar_url || ''
    });
    setLocalError('');
  };

  if (!user) {
    return (
      <div className="prof-container">
        <div className="prof-empty-state">
          <Shield size={64} className="prof-empty-icon" />
          <h2>Akses Diperlukan</h2>
          <p>Silakan masuk untuk melihat profil Anda.</p>
        </div>
      </div>
    );
  }

  const errorMessage = authError?.message || localError;
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="prof-container">
      {showSuccessAnimation && (
        <div className="prof-success-toast">
          <Sparkles size={20} />
          <span>Profile updated successfully! ✨</span>
        </div>
      )}

      <div className="prof-card">
        {/* Decorative Background Elements */}
        <div className="prof-bg-decoration">
          <div className="prof-decoration-circle prof-circle-1"></div>
          <div className="prof-decoration-circle prof-circle-2"></div>
          <div className="prof-decoration-circle prof-circle-3"></div>
        </div>

        {/* Profile Header */}
        <div className="prof-header">
          <div className="prof-avatar-wrapper">
            {isEditing ? (
              // Dalam mode edit, tampilkan avatar yang dipilih di form
              profileData.avatar_url ? (
                <div className="prof-avatar-image-wrapper">
                  <img 
                    src={profileData.avatar_url} 
                    alt="Profile Avatar" 
                    className="prof-avatar-image"
                  />
                  <div className="prof-avatar-ring"></div>
                  <div className="prof-avatar-glow"></div>
                </div>
              ) : (
                <div 
                  className="prof-avatar" 
                  style={{ backgroundColor: generateAvatarColor(profileData.username || user.email) }}
                >
                  <span className="prof-avatar-text">
                    {(profileData.username || user.email).charAt(0).toUpperCase()}
                  </span>
                  <div className="prof-avatar-ring"></div>
                  <div className="prof-avatar-glow"></div>
                </div>
              )
            ) : (
              // Dalam mode tampilan, tampilkan avatar dari user metadata
              user.user_metadata?.avatar_url ? (
                <div className="prof-avatar-image-wrapper">
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile Avatar" 
                    className="prof-avatar-image"
                  />
                  <div className="prof-avatar-ring"></div>
                  <div className="prof-avatar-glow"></div>
                </div>
              ) : (
                <div 
                  className="prof-avatar" 
                  style={{ backgroundColor: generateAvatarColor(user.user_metadata?.username || user.email) }}
                >
                  <span className="prof-avatar-text">
                    {(user.user_metadata?.username || user.email).charAt(0).toUpperCase()}
                  </span>
                  <div className="prof-avatar-ring"></div>
                  <div className="prof-avatar-glow"></div>
                </div>
              )
            )}
            {!isEditing && (
              <button 
                className="prof-edit-avatar-btn"
                onClick={() => setIsEditing(true)}
                title="Edit Profile"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>
          
          <div className="prof-header-info">
            <h1 className="prof-name">
              {profileData.full_name || profileData.username || user.email}
              <Sparkles className="prof-sparkle-icon" size={20} />
            </h1>
            <div className="prof-email-badge">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
            <div className="prof-badges">
              <div className="prof-badge prof-badge-verified">
                <Award size={12} />
                <span>Terverifikasi</span>
              </div>
              <div className="prof-badge prof-badge-active">
                <Zap size={12} />
                <span>Anggota Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="prof-error-message">
            <span className="prof-error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {isEditing ? (
          <div className="prof-edit-section">
            <div className="prof-section-header">
              <h2>
                <Edit3 size={20} />
                Edit Your Profile
              </h2>
              <p>Perbarui informasi pribadi Anda</p>
            </div>

            <div className="prof-form">
              <div className="prof-form-group">
                <label htmlFor="username" className="prof-label">
                  <User size={16} />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className="prof-input"
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="prof-form-group">
                <label htmlFor="full_name" className="prof-label">
                  <Sparkles size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  className="prof-input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <AvatarSelector 
                selectedAvatar={profileData.avatar_url}
                onAvatarChange={(avatarUrl) => setProfileData({...profileData, avatar_url: avatarUrl})}
              />
              
              <div className="prof-form-group">
                <label htmlFor="bio" className="prof-label">
                  <FileText size={16} />
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="prof-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
                <span className="prof-char-count">
                  {profileData.bio.length} / 200 characters
                </span>
              </div>
            </div>
            
            <div className="prof-actions">
              <button 
                className="prof-btn prof-btn-primary" 
                onClick={handleSave}
                disabled={loading}
              >
                <Save size={18} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button 
                className="prof-btn prof-btn-outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="prof-view-section">
            {/* Bio Section */}
            {profileData.bio && (
              <div className="prof-bio-card">
                <div className="prof-card-header">
                  <FileText size={18} />
                  <h3>Tentang saya</h3>
                </div>
                <p className="prof-bio-text">{profileData.bio}</p>
              </div>
            )}
            
            {/* Stats Section */}
            <div className="prof-stats-grid">
              <div className="prof-stat-card">
                <Calendar className="prof-stat-icon" size={24} />
                <div className="prof-stat-content">
                  <h4>Anggota Sejak</h4>
                  <p>{memberSince}</p>
                </div>
                <div className="prof-stat-glow"></div>
              </div>

              <div className="prof-stat-card">
                <Shield className="prof-stat-icon" size={24} />
                <div className="prof-stat-content">
                  <h4>Status Akun</h4>
                  <p>Aktif & Terverifikasi</p>
                </div>
                <div className="prof-stat-glow"></div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="prof-actions">
              <button 
                className="prof-btn prof-btn-primary" 
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </button>
              <button 
                className="prof-btn prof-btn-danger" 
                onClick={signOut}
              >
                <LogOut size={18} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="prof-footer">
          <p>✨ Data Anda aman dan terenkripsi</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;