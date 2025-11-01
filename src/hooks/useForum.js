// src/hooks/useForum.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load forum posts
  useEffect(() => {
    loadPosts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('forum-posts-updates', { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_posts'
        },
        async (payload) => {
          let user = null;
          if (payload.new.user_id && !payload.new.is_anonymous) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching profile for real-time post:', profileError);
            } else {
              user = profileData;
            }
          }
          const postWithUserInfo = {
            ...payload.new,
            user: user
          };
          setPosts(prev => {
            console.log('Real-time event received:', postWithUserInfo.id);
            if (prev.find(p => p.id === postWithUserInfo.id)) {
              console.log('Duplicate found in real-time. Ignoring.');
              return prev;
            }
            console.log('Adding post from real-time.');
            return [postWithUserInfo, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          // Update dengan data baru, tapi info user tetap null karena tidak bisa fetch async
          setPosts(prev => 
            prev.map(post => 
              post.id === payload.new.id ? { ...payload.new, user: post.user } : post
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
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // First, get all forum posts
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // For posts that have user_id, fetch user profiles separately
      const postsWithUserInfo = await Promise.all(
        postsData.map(async (post) => {
          if (post.user_id && !post.is_anonymous) {
            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', post.user_id)
              .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles
            
            if (profileError) {
              console.error('Error fetching profile for post:', profileError);
              // Return post with user set to null if profile fetch fails
              return { ...post, user: null };
            }
            
            // If no profile data is found (maybeSingle returns null when no match)
            return { ...post, user: profileData || null };
          } else {
            // For anonymous posts, set user to null
            return { ...post, user: null };
          }
        })
      );

      setPosts(postsWithUserInfo);
    } catch (err) {
      setError(err.message);
      console.error('Error loading forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    if (!postData.user_id) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    try {
      // Insert the new post
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          ...postData,
          views: 0,
          likes: 0,
          comment_count: 0,
          reactions: {} // Initialize with empty reactions object
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state (add user info if possible)
      let user = null;
      if (data.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', data.user_id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile for new post:', profileError);
        } else {
          user = profileData || null;
        }
      }
      
      const postWithUserInfo = {
        ...data,
        user: user
      };
      
      setPosts(prev => {
        console.log('Manual update after createPost:', postWithUserInfo.id);
        if (prev.find(p => p.id === postWithUserInfo.id)) {
          console.log('Duplicate found in createPost. Ignoring.');
          return prev;
        }
        console.log('Adding post from createPost.');
        return [postWithUserInfo, ...prev];
      });
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating forum post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, ...data } : post
        )
      );
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating forum post:', err);
      throw err;
    }
  };

  const deletePost = async (postId) => {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting forum post:', err);
      throw err;
    }
  };

  const addReaction = async (postId, reactionType) => {
    // Update local state immediately for better UX
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const currentReactions = post.reactions || {};
          const updatedReactions = {
            ...currentReactions,
            [reactionType]: (currentReactions[reactionType] || 0) + 1
          };
          return { ...post, reactions: updatedReactions };
        }
        return post;
      })
    );
    
    try {
      // Then update on server
      const { data: currentPost, error: selectError } = await supabase
        .from('forum_posts')
        .select('reactions')
        .eq('id', postId)
        .single();

      if (selectError) throw selectError;

      const currentReactions = currentPost.reactions || {};
      const updatedReactions = {
        ...currentReactions,
        [reactionType]: (currentReactions[reactionType] || 0) + 1
      };

      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ reactions: updatedReactions })
        .eq('id', postId);

      if (updateError) throw updateError;
    } catch (err) {
      // Rollback the local update if server update fails
      setPosts(prev => 
        prev.map(post => {
          if (post.id === postId) {
            const currentReactions = post.reactions || {};
            const updatedReactions = {
              ...currentReactions,
              [reactionType]: Math.max(0, (currentReactions[reactionType] || 0) - 1)
            };
            return { ...post, reactions: updatedReactions };
          }
          return post;
        })
      );
      setError(err.message);
      console.error('Error adding reaction:', err);
      throw err;
    }
  };

  // Function to increment view count on forum posts using the database function
  const incrementPostView = async (postId) => {
    try {
      // This function calls the PostgreSQL function defined in the database schema
      const { data, error } = await supabase
        .rpc('increment_post_view', { post_id_arg: postId });

      if (error) throw error;

      // Update local state to reflect the view count change
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, views: post.views + 1 } : post
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error incrementing post view:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
    addReaction,
    incrementPostView
  };
};