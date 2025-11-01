import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, TrendingUp, Calendar, Activity, Sparkles, Zap, AlertCircle } from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';
import { useAdmin } from '../../hooks/useAdmin';
import './AdminDashboard.css';
import LineChart from './Charts/LineChart.jsx';
import PieChart from './Charts/PieChart.jsx';

function AdminDashboard() {
  const { analytics, loading, error, refetch } = useAdmin();
  const [animatedStats, setAnimatedStats] = useState({});
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    // Animate numbers on load
    if (analytics.totalUsers) {
      animateValue('totalUsers', 0, analytics.totalUsers, 1500);
      animateValue('activeSessions', 0, analytics.activeSessions, 1200);
      animateValue('forumPosts', 0, analytics.forumPosts, 1300);
    }
  }, [analytics]);

  const animateValue = (key, start, end, duration) => {
    const startTime = Date.now();
    const updateValue = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const current = Math.floor(start + (end - start) * easeOutQuad);
      
      setAnimatedStats(prev => ({ ...prev, [key]: current }));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    requestAnimationFrame(updateValue);
  };

  if (loading && !analytics.totalUsers) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="admin-dashboard-v2 dash-error">
        <div className="dash-error-container">
          <div className="dash-error-icon">
            <AlertCircle size={48} />
          </div>
          <h3 className="dash-error-title">⚠️ Oops! Something went wrong</h3>
          <p className="dash-error-message">Error loading analytics: {error}</p>
          <button onClick={refetch} className="dash-btn-retry">
            <Zap size={18} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Total Users', 
      value: (animatedStats.totalUsers || analytics.totalUsers || 0).toLocaleString(), 
      icon: Users, 
      change: '+12%',
      color: 'cyan',
      emoji: '👥'
    },
    { 
      title: 'Active Sessions', 
      value: (animatedStats.activeSessions || analytics.activeSessions || 0).toString(), 
      icon: Activity, 
      change: '+5%',
      color: 'green',
      emoji: '⚡'
    },
    { 
      title: 'Forum Posts', 
      value: (animatedStats.forumPosts || analytics.forumPosts || 0).toString(), 
      icon: MessageCircle, 
      change: '+8%',
      color: 'purple',
      emoji: '💬'
    },
    { 
      title: 'Avg. Session', 
      value: analytics.avgSession || '0m', 
      icon: Calendar, 
      change: '+3%',
      color: 'orange',
      emoji: '⏱️'
    }
  ];

  const sentimentData = analytics.sentimentTrends || [];
  const issueDistribution = analytics.issueDistribution || [];

  const recentActivity = [
    { type: 'forum_post', message: "New forum post: \"Overcoming exam anxiety\"", time: "2 minutes ago", emoji: "📝" },
    { type: 'session', message: "User completed emotional wellness session", time: "15 minutes ago", emoji: "✅" },
    { type: 'sentiment', message: "Positive sentiment increased by 12%", time: "1 hour ago", emoji: "📈" }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'forum_post': return MessageCircle;
      case 'session': return Activity;
      case 'sentiment': return TrendingUp;
      default: return MessageCircle;
    }
  };

  return (
    <div className="admin-dashboard-v2">
      <div className="dash-header">
        <div className="dash-header-content">
          <div className="dash-title-section">
            <h1 className="dash-main-title">
              <span className="dash-title-emoji">🧠</span>
              Campus Mental Health Dashboard
              <span className="dash-title-badge">Live</span>
            </h1>
            <p className="dash-subtitle">
              <Sparkles size={14} className="dash-subtitle-icon" />
              Real-time analytics and insights for student well-being
            </p>
          </div>
          <button className="dash-refresh-btn" onClick={refetch}>
            <Activity size={16} />
            Refresh Data
          </button>
        </div>
        <div className="dash-header-decoration"></div>
      </div>
      
      <div className="dash-stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index} 
              className={`dash-stat-card dash-card-${stat.color} ${activeCard === index ? 'dash-card-active' : ''}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="dash-stat-bg"></div>
              <div className="dash-stat-header">
                <div className="dash-stat-icon-wrapper">
                  <div className="dash-stat-icon">
                    <IconComponent size={24} />
                  </div>
                  <span className="dash-stat-emoji">{stat.emoji}</span>
                </div>
                <span className={`dash-stat-change dash-change-positive`}>
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
              <div className="dash-stat-content">
                <h3 className="dash-stat-value">{stat.value}</h3>
                <p className="dash-stat-title">{stat.title}</p>
              </div>
              <div className="dash-stat-glow"></div>
            </div>
          );
        })}
      </div>
      
      <div className="dash-charts-section">
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3 className="dash-chart-title">
              <span className="dash-chart-icon">📊</span>
              Weekly Sentiment Trends
            </h3>
            <span className="dash-chart-badge">7 Days</span>
          </div>
          <div className="dash-chart-wrapper">
            <LineChart data={sentimentData.length > 0 ? sentimentData : [
              { name: 'Mon', positive: 0, neutral: 0, negative: 0 },
              { name: 'Tue', positive: 0, neutral: 0, negative: 0 },
              { name: 'Wed', positive: 0, neutral: 0, negative: 0 },
              { name: 'Thu', positive: 0, neutral: 0, negative: 0 },
              { name: 'Fri', positive: 0, neutral: 0, negative: 0 },
              { name: 'Sat', positive: 0, neutral: 0, negative: 0 },
              { name: 'Sun', positive: 0, neutral: 0, negative: 0 }
            ]} />
          </div>
        </div>
        
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3 className="dash-chart-title">
              <span className="dash-chart-icon">🎯</span>
              Issue Distribution
            </h3>
            <span className="dash-chart-badge">Overview</span>
          </div>
          <div className="dash-chart-wrapper">
            <PieChart data={issueDistribution.length > 0 ? issueDistribution : [
              { name: 'No Data', value: 1 }
            ]} />
          </div>
        </div>
      </div>
      
      <div className="dash-activity-section">
        <div className="dash-activity-header">
          <h3 className="dash-activity-title">
            <span className="dash-activity-icon">🔔</span>
            Recent Activity
          </h3>
          <span className="dash-activity-live">
            <span className="dash-live-dot"></span>
            Live Updates
          </span>
        </div>
        <div className="dash-activity-list">
          {recentActivity.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div 
                key={index} 
                className="dash-activity-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="dash-activity-icon-wrapper">
                  <div className="dash-activity-item-icon">
                    <IconComponent size={16} />
                  </div>
                  <span className="dash-activity-emoji">{activity.emoji}</span>
                </div>
                <div className="dash-activity-content">
                  <p className="dash-activity-message">{activity.message}</p>
                  <span className="dash-activity-time">{activity.time}</span>
                </div>
                <div className="dash-activity-pulse"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;