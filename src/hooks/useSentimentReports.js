// src/hooks/useSentimentReports.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useSentimentReports = (userId) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load sentiment reports
  useEffect(() => {
    if (!userId) return;

    loadReports();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sentiment-reports-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sentiment_reports',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setReports(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sentiment_reports',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setReports(prev => 
            prev.map(report => 
              report.id === payload.new.id ? payload.new : report
            )
          );
        }
      )
      .subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [userId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sentiment_reports')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sentiment reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!reportData.sentiment || !reportData.score) {
      throw new Error('Sentiment and score are required for reports');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sentiment_reports')
        .insert([{
          user_id: userId,
          date: reportData.date || new Date().toISOString().split('T')[0], // Use current date if not provided
          sentiment: reportData.sentiment,
          score: reportData.score,
          conversation_summary: reportData.conversation_summary || '',
          recommendations: reportData.recommendations || ''
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setReports(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding sentiment report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('sentiment_reports')
        .update(updateData)
        .eq('id', reportId)
        .eq('user_id', userId) // Ensure user can only update their own reports
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, ...data } : report
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating sentiment report:', err);
      throw err;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const { error } = await supabase
        .from('sentiment_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId); // Ensure user can only delete their own reports

      if (error) throw error;

      // Remove from local state
      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting sentiment report:', err);
      throw err;
    }
  };

  // Get sentiment trends for analytics
  const getSentimentTrend = (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const filteredReports = reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= startDate;
    });

    // Group by date and calculate average sentiment score
    const groupedByDate = {};
    filteredReports.forEach(report => {
      const date = report.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date, positive: 0, negative: 0, neutral: 0, count: 0 };
      }
      
      groupedByDate[date][report.sentiment] += 1;
      groupedByDate[date].count += 1;
    });

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get overall sentiment statistics
  const getSentimentStats = () => {
    if (!reports.length) return { positive: 0, negative: 0, neutral: 0, total: 0 };

    const stats = reports.reduce(
      (acc, report) => {
        acc[report.sentiment] += 1;
        acc.total += 1;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0, total: 0 }
    );

    return stats;
  };

  return {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    getSentimentTrend,
    getSentimentStats
  };
};