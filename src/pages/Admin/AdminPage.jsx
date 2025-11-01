import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/Dashboard/AdminDashboard.jsx';
import './AdminPage.css';
import AdminComplaintsPage from './AdminComplaintsPage.jsx';

function AdminPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="admin-page-container-v2">
      {/* Animated Background */}
      <div className="admin-bg-animation">
        <div className="admin-grid-overlay"></div>
        <div className="admin-circle-1"></div>
        <div className="admin-circle-2"></div>
        <div className="admin-circle-3"></div>
      </div>

      {/* Particle Effects */}
      <div className="admin-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="admin-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      <header className={`admin-header-v2 ${glitchActive ? 'admin-glitch' : ''}`}>
        <div className="admin-header-content">
          <div className="admin-logo-section">
            <div className="admin-logo-icon">
              <span className="admin-emoji">🚀</span>
              <div className="admin-logo-pulse"></div>
            </div>
            <div className="admin-title-group">
              <h1 className="admin-title">
                <span className="admin-title-text">Admin Dashboard</span>
                <span className="admin-title-underline"></span>
              </h1>
            </div>
          </div>

          <div className="admin-info-panel">
            <div className="admin-time-display">
              <span className="admin-time-icon">⏰</span>
              <div className="admin-time-text">
                <div className="admin-time">{formatTime(currentTime)}</div>
                <div className="admin-date">{formatDate(currentTime)}</div>
              </div>
            </div>
            <div className="admin-status-indicator">
              <span className="admin-status-dot"></span>
              <span className="admin-status-text">System Active</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="admin-header-corner admin-corner-tl"></div>
        <div className="admin-header-corner admin-corner-tr"></div>
        <div className="admin-header-corner admin-corner-bl"></div>
        <div className="admin-header-corner admin-corner-br"></div>
      </header>
      
      <main className="admin-main-v2">
        <div className="admin-dashboard-wrapper">
          <div className="admin-scan-line"></div>
          <AdminDashboard />
          <AdminComplaintsPage/>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-footer-v2">
        <div className="admin-footer-content">
          <span className="admin-footer-text">
            <span className="admin-emoji-small">✨</span> 
            Powered by Future Tech 
            <span className="admin-emoji-small">✨</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage;