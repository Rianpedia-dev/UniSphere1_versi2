// src/hooks/useAdmin.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useAdmin = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if environment variables are properly set
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not properly configured. Please check your .env file.');
      setError(new Error('Supabase configuration is missing. Check environment variables.'));
    }
  }, []);

  // Fetch various analytics data
  const fetchAnalytics = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError(new Error('Supabase configuration is missing. Check environment variables.'));
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Get user statistics
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get active sessions (chat sessions in last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: activeSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      if (sessionsError) throw sessionsError;

      // Get forum posts
      const { count: forumPosts, error: postsError } = await supabase
        .from('forum_posts')
        .select('*', { count: 'exact', head: true });

      if (postsError) throw postsError;

      // Get average session duration (simplified calculation)
      const avgSession = 24; // Placeholder - would require more complex query in real app

      // Get sentiment trends (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: sentimentData, error: sentimentError } = await supabase
        .from('sentiment_reports')
        .select('date, sentiment')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (sentimentError) throw sentimentError;

      // Get issue distribution
      const { data: issueData, error: issueError } = await supabase
        .from('forum_posts')
        .select('category')
        .not('category', 'is', null);

      if (issueError) throw issueError;

      // Process sentiment data for chart
      const processedSentimentData = processSentimentData(sentimentData);
      
      // Process issue distribution
      const processedIssueData = processIssueData(issueData);

      setAnalytics({
        totalUsers: totalUsers || 0,
        activeSessions: activeSessions || 0,
        forumPosts: forumPosts || 0,
        avgSession: `${avgSession}m`,
        sentimentTrends: processedSentimentData,
        issueDistribution: processedIssueData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process sentiment data for chart
  const processSentimentData = (data) => {
    if (!data || data.length === 0) return [];
    
    // Group by date and sentiment
    const grouped = {};
    data.forEach(item => {
      const date = item.date.split('T')[0]; // Get just the date part
      if (!grouped[date]) {
        grouped[date] = { name: date, positive: 0, neutral: 0, negative: 0 };
      }
      if (item.sentiment) {
        grouped[date][item.sentiment] += 1;
      }
    });
    
    return Object.values(grouped);
  };

  // Helper function to process issue data for chart
  const processIssueData = (data) => {
    if (!data || data.length === 0) return [];
    
    // Count occurrences of each category
    const counts = {};
    data.forEach(item => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};