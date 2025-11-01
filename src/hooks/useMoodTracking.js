// src/hooks/useMoodTracking.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useMoodTracking = (userId) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load mood entries
  useEffect(() => {
    if (!userId) return;

    loadMoodEntries();

    // Set up real-time subscription
    const subscription = supabase
      .channel('mood-tracking-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_tracking',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setMoodEntries(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mood_tracking',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setMoodEntries(prev => 
            prev.map(entry => 
              entry.id === payload.new.id ? payload.new : entry
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'mood_tracking',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setMoodEntries(prev => 
            prev.filter(entry => entry.id !== payload.old.id)
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

  const loadMoodEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;

      setMoodEntries(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading mood entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMoodEntry = async (moodData) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!moodData.mood) {
      throw new Error('Mood is required');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_tracking')
        .insert([{
          user_id: userId,
          mood: moodData.mood,
          note: moodData.note || '',
          intensity: moodData.intensity || 5 // Default to 5 if not provided
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setMoodEntries(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding mood entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMoodEntry = async (entryId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('mood_tracking')
        .update(updateData)
        .eq('id', entryId)
        .eq('user_id', userId) // Ensure user can only update their own entries
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setMoodEntries(prev => 
        prev.map(entry => 
          entry.id === entryId ? { ...entry, ...data } : entry
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating mood entry:', err);
      throw err;
    }
  };

  const deleteMoodEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('mood_tracking')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId); // Ensure user can only delete their own entries

      if (error) throw error;

      // Remove from local state
      setMoodEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting mood entry:', err);
      throw err;
    }
  };

  // Function to get mood summary for analytics
  const getMoodSummary = () => {
    if (!moodEntries.length) return {};

    const moodCounts = {};
    let totalIntensity = 0;
    let countWithIntensity = 0;

    moodEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      if (entry.intensity !== null) {
        totalIntensity += entry.intensity;
        countWithIntensity++;
      }
    });

    const averageIntensity = countWithIntensity > 0 ? totalIntensity / countWithIntensity : 0;

    return {
      moodCounts,
      averageIntensity,
      totalCount: moodEntries.length
    };
  };

  return {
    moodEntries,
    loading,
    error,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getMoodSummary
  };
};