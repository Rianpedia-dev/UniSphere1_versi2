import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Brain, Users, Shield, User, LogOut, LogIn, Zap, AlertCircle } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, signOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [particles, setParticles] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Rumah', icon: Sparkles, emoji: '🏠' },
    { path: '/chat', label: 'Teman Ai', icon: Brain, emoji: '🤖' },
    { path: '/forum', label: 'Forum', icon: Users, emoji: '💬' },
    ...(user ? [{ path: '/complaints', label: 'Pengaduan', icon: AlertCircle, emoji: '📢' }] : []),
    ...(user ? [{ path: '/admin', label: 'Admin', icon: Shield, emoji: '👑' }] : [])
  ];

  const handleLinkHover = (path) => {
    setHoveredLink(path);
  };

  return (
    <header className={`unisphere-app-header ${scrolled ? 'unisphere-scrolled' : ''}`}>
      {/* Animated background particles */}
      <div className="unisphere-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="unisphere-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <nav className="unisphere-nav">
        {/* Brand/Logo with animation */}
        <div className="unisphere-nav-brand">
          <Link to="/" className="unisphere-brand-link">
            <div className="unisphere-brand-icon">
              <span className="unisphere-icon-emoji">
                <img className="unisphere-brand-icon" src="/logo2us.png" alt="Logo" />
              </span>
              <div className="unisphere-brand-orbit"></div>
              <div className="unisphere-brand-orbit unisphere-orbit-2"></div>
            </div>
            <span className="unisphere-brand-text">
              <span className="unisphere-text-gradient">UniSphere</span>
            </span>
            <Zap className="unisphere-brand-zap" size={16} />
            <div className="unisphere-brand-glow"></div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="unisphere-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`unisphere-nav-link ${isActive(item.path) ? 'unisphere-active' : ''}`}
                onMouseEnter={() => handleLinkHover(item.path)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="unisphere-link-content">
                  <span className="unisphere-link-emoji">{item.emoji}</span>
                  <Icon size={18} className="unisphere-nav-icon" />
                  <span className="unisphere-link-text">{item.label}</span>
                </div>
                {isActive(item.path) && (
                  <>
                    <div className="unisphere-nav-active-indicator" />
                    <div className="unisphere-nav-active-glow" />
                  </>
                )}
                {hoveredLink === item.path && <div className="unisphere-nav-hover-glow" />}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="unisphere-nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="unisphere-profile-btn">
                <div className="unisphere-profile-avatar">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile Avatar" 
                      className="unisphere-profile-avatar-img"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <div className="unisphere-avatar-pulse"></div>
                </div>
                <span className="unisphere-profile-name">
                  {user.email?.split('@')[0]}
                </span>
                <span className="unisphere-profile-badge">✨</span>
              </Link>
              <button className="unisphere-btn unisphere-btn-signout" onClick={signOut}>
                <LogOut size={18} />
                <span>Keluar</span>
                <div className="unisphere-btn-glow"></div>
              </button>
            </>
          ) : (
            <Link to="/login" className="unisphere-btn unisphere-btn-signin">
              <LogIn size={18} />
              <span>Masuk</span>
              <div className="unisphere-btn-shine"></div>
              <div className="unisphere-btn-glow"></div>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="unisphere-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="unisphere-menu-icon-wrapper">
            {mobileMenuOpen ? (
              <X size={24} className="unisphere-menu-icon" />
            ) : (
              <Menu size={24} className="unisphere-menu-icon" />
            )}
            <div className="unisphere-menu-icon-bg"></div>
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`unisphere-mobile-menu ${mobileMenuOpen ? 'unisphere-menu-open' : ''}`}>
        <div className="unisphere-mobile-menu-bg"></div>
        <div className="unisphere-mobile-menu-content">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`unisphere-mobile-link ${isActive(item.path) ? 'unisphere-active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="unisphere-mobile-emoji">{item.emoji}</span>
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive(item.path) && <div className="unisphere-mobile-active-dot" />}
              </Link>
            );
          })}
          <div className="unisphere-mobile-divider">
            <div className="unisphere-divider-glow"></div>
          </div>
          {user ? (
            <>
              <Link to="/profile" className="unisphere-mobile-link unisphere-has-avatar">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile Avatar" 
                    className="unisphere-mobile-avatar-img"
                  />
                ) : (
                  <span className="unisphere-mobile-emoji">👤</span>
                )}
                <User size={20} />
                <span>Profil</span>
              </Link>
              <button className="unisphere-mobile-link" onClick={signOut}>
                <span className="unisphere-mobile-emoji">👋</span>
                <LogOut size={20} />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="unisphere-mobile-link">
              <span className="unisphere-mobile-emoji">🚀</span>
              <LogIn size={20} />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;