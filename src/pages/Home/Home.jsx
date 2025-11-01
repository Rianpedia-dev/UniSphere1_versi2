import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  };

  const features = [
    {
      id: 1,
      emoji: '🤖',
      title: 'AI Emotional Chatbot',
      description: 'Talk to our empathetic AI anytime you need support. Get personalized responses based on your emotional state.',
      color: '#00f5ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      emoji: '🎭',
      title: 'Anonymous Forum',
      description: 'Terhubunglah dengan rekan-rekan di lingkungan yang aman dan suportif. Bagikan pengalaman dan dapatkan saran tanpa mengungkapkan identitas Anda..',
      color: '#ff00ff',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 3,
      emoji: '🗣️',
      title: 'Sistem Pengaduan',
      description: 'Platform untuk melaporkan masalah di lingkungan kampus. Klasifikasi dan prioritas pengaduan untuk penanganan yang efisien.',
      color: '#00ff88',
      gradient: 'linear-gradient(135deg, #9bfe4fff 0%, #fe0019ff 100%)'
    },
    {
      id: 4,
      emoji: '📊',
      title: 'Dashboard Analytics',
      description: 'Lacak perkembangan kesehatan mental Anda dengan wawasan. Admin kampus dapat memantau tren kesejahteraan mahasiswa secara keseluruhan.',
      color: '#00ff88',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <div className="unisphere-home-container" onMouseMove={handleMouseMove}>
      {/* Animated Background Particles */}
      <div className="unisphere-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="unisphere-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Orb that follows mouse */}
      <div
        className="unisphere-gradient-orb"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`
        }}
      />

      <main className="unisphere-home-main">
        {/* Hero Section */}
        <section className="unisphere-hero">
          <div className="unisphere-hero-badge">
            <span className="unisphere-badge-pulse"></span>
            <span>🌟 AI-Powered Support</span>
          </div>

          <h1 className="unisphere-hero-title">
            <span className="unisphere-title-line unisphere-gradient-text">Pendamping</span>
            <span className="unisphere-title-line">Kesehatan Mental Anda</span>
          </h1>

          <p className="unisphere-hero-subtitle">
            UniSphere menyediakan dukungan emosional bertenaga AI dan koneksi komunitas
          </p>

          <div className="unisphere-hero-cta">
            {user ? (
              <>
                <Link to="/chat" className="unisphere-btn unisphere-btn-primary">
                  <span className="unisphere-btn-icon">💬</span>
                  <span>Mulai Mengobrol</span>
                  <span className="unisphere-btn-shine"></span>
                </Link>
                <Link to="/forum" className="unisphere-btn unisphere-btn-outline">
                  <span className="unisphere-btn-icon">🌐</span>
                  <span>Bergabunglah dengan Forum</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="unisphere-btn unisphere-btn-primary">
                  <span className="unisphere-btn-icon">✨</span>
                  <span>Memulai</span>
                  <span className="unisphere-btn-shine"></span>
                </Link>
                <Link to="/forum" className="unisphere-btn unisphere-btn-outline">
                  <span className="unisphere-btn-icon">🔍</span>
                  <span>Jelajahi Forum</span>
                </Link>
              </>
            )}
          </div>

          {/* Floating Stats */}
          <div className="unisphere-floating-stats">
            <div className="unisphere-stat-card">
              <div className="unisphere-stat-number">24/7</div>
              <div className="unisphere-stat-label">AI Support</div>
            </div>
            <div className="unisphere-stat-card">
              <div className="unisphere-stat-number">100%</div>
              <div className="unisphere-stat-label">Anonymous</div>
            </div>
            <div className="unisphere-stat-card">
              <div className="unisphere-stat-number">Safe</div>
              <div className="unisphere-stat-label">Community</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="unisphere-features">
          <h2 className="unisphere-section-title">
            <span className="unisphere-title-decoration">⚡</span>
            Powerful Features
            <span className="unisphere-title-decoration">⚡</span>
          </h2>

          <div className="unisphere-features-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`unisphere-feature-card ${activeFeature === feature.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
                style={{
                  '--feature-color': feature.color,
                  '--feature-gradient': feature.gradient
                }}
              >
                <div className="unisphere-feature-glow"></div>
                <div className="unisphere-feature-emoji">{feature.emoji}</div>
                <h3 className="unisphere-feature-title">{feature.title}</h3>
                <p className="unisphere-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts Ticker */}
        <section className="unisphere-ticker-section">
          <div className="unisphere-ticker">
            <div className="unisphere-ticker-content">
              <span>🧠 Kesehatan mental itu penting</span>
              <span>💪 Kamu tidak sendirian</span>
              <span>🌈 Setiap perasaan itu valid</span>
              <span>🎯 Kemajuan, bukan kesempurnaan</span>
              <span>🌟 Kamu bisa melakukannya</span>
              <span>🤗 Dukungan sudah ada di sini</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="unisphere-home-footer">
        <div className="unisphere-footer-content">
          <p className="unisphere-footer-text">
            <span className="unisphere-footer-logo">🌍 UniSphere</span>
            <span className="unisphere-footer-separator">•</span>
            <span>Dukungan Kesehatan Mental untuk Mahasiswa</span>
          </p>
          <div className="unisphere-footer-pulse"></div>
        </div>
      </footer>
    </div>
  );
}

export default Home;