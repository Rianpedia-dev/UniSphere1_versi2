// src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load notifications
  useEffect(() => {
    if (!userId) return;

    loadNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === payload.new.id ? payload.new : notification
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

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (notificationData) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!notificationData.title || !notificationData.message || !notificationData.type) {
      throw new Error('Title, message, and type are required for notifications');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setNotifications(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (notificationId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update(updateData)
        .eq('id', notificationId)
        .eq('user_id', userId) // Ensure user can only update their own notifications
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, ...data } : notification
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating notification:', err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId); // Ensure user can only delete their own notifications

      if (error) throw error;

      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await updateNotification(notificationId, { is_read: true });
    } catch (err) {
      setError(err.message);
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Only update unread notifications

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          ({ ...notification, is_read: true })
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  // Get count of unread notifications
  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.is_read).length;
  };

  return {
    notifications,
    loading,
    error,
    addNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };
};