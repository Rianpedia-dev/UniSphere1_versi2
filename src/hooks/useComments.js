// src/hooks/useComments.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processCommentsWithAuthors = useCallback(async (commentsData) => {
    try {
      const commentsWithProfiles = await Promise.all(
        commentsData.map(async (comment) => {
          let processedComment;
          
          if (comment.user_id && !comment.is_anonymous) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', comment.user_id)
                .maybeSingle();

              if (profileError) {
                console.error('Error fetching profile for comment:', profileError);
                processedComment = { ...comment, author: null };
              } else {
                processedComment = { ...comment, author: profileData || null };
                // Tambahkan log untuk debugging
                console.log('Non-anonymous comment author data:', profileData);
              }
            } catch (err) {
              console.error('Error in processCommentsWithAuthors for single comment:', err);
              processedComment = { ...comment, author: null };
            }
          } else {
            processedComment = { ...comment, author: null };
            // Tambahkan log untuk debugging komentar anonim
            if (comment.is_anonymous) {
              console.log('Anonymous comment - no author data needed:', comment.id);
            } else {
              console.log('Comment with no user_id - no author data:', comment.id);
            }
          }
          
          // Proses juga replies (jika ada) untuk menambahkan informasi author
          if (processedComment.replies && Array.isArray(processedComment.replies)) {
            const processedReplies = await processCommentsWithAuthors(processedComment.replies);
            processedComment = { ...processedComment, replies: processedReplies };
          }
          
          return processedComment;
        })
      );
      return commentsWithProfiles;
    } catch (error) {
      console.error('Critical error in processCommentsWithAuthors:', error);
      return commentsData.map(comment => ({...comment, author: null}));
    }
  }, []);

  const loadComments = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Ambil semua komentar untuk post ini
      const { data: allComments, error: commentsError } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        throw commentsError;
      }
      
      // Bangun struktur hierarki komentar (parent-child)
      const buildCommentTree = (comments) => {
        // Buat mapping dari semua komentar berdasarkan ID
        const commentMap = {};
        comments.forEach(comment => {
          commentMap[comment.id] = { ...comment, replies: [] };
        });
        
        // Array untuk menyimpan komentar utama (tanpa parent)
        const rootComments = [];
        
        // Proses setiap komentar untuk menautkan parent-child
        comments.forEach(comment => {
          const commentWithReplies = commentMap[comment.id];
          
          if (comment.parent_comment_id) {
            // Jika komentar ini adalah reply, tambahkan ke replies komentar parent
            const parent = commentMap[comment.parent_comment_id];
            if (parent) {
              parent.replies.push(commentWithReplies);
            } else {
              // Jika parent tidak ditemukan, tambahkan sebagai root comment
              rootComments.push(commentWithReplies);
            }
          } else {
            // Jika bukan reply, tambahkan sebagai root comment
            rootComments.push(commentWithReplies);
          }
        });
        
        return rootComments;
      };
      
      console.log('All comments from DB:', allComments);
      const hierarchicalComments = buildCommentTree(allComments);
      console.log('Hierarchical comments before processing:', hierarchicalComments);
      const processedComments = await processCommentsWithAuthors(hierarchicalComments);
      console.log('Processed comments:', processedComments);
      setComments(processedComments);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, processCommentsWithAuthors]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }

    loadComments();

    const subscription = supabase
      .channel(`forum-comments-updates-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_comments', filter: `post_id=eq.${postId}` },
        async (payload) => {
          // Untuk komentar baru, kita perlu rebuild struktur karena bisa jadi komentar ini adalah reply
          loadComments();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'forum_comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          // Untuk update, kita perlu rebuild struktur juga agar author info tetap terjaga
          loadComments();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'forum_comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          // Untuk delete, kita juga perlu rebuild struktur karena bisa mengubah hierarki
          loadComments();
        }
      )
      .subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [postId, loadComments, processCommentsWithAuthors]);

  const addComment = useCallback(async (commentData) => {
    if (!commentData.content.trim() || !commentData.user_id) {
      const error = new Error('Comment content and user ID are required');
      throw error;
    }

    setLoading(true);
    try {
      const insertResult = await supabase
        .from('forum_comments')
        .insert([{
          ...commentData,
          post_id: postId,
          likes: 0,
          parent_comment_id: null // Ini komentar utama, bukan reply
        }])
        .select('*')
        .single();
      
      if (insertResult.error) {
        throw insertResult.error;
      }
      
      // Karena kita menggunakan loadComments() di event listener, kita bisa return data dasar
      // Tapi kita tetap return data lengkap untuk kemungkinan penggunaan lain
      const [commentWithAuthor] = await processCommentsWithAuthors([insertResult.data]);
      
      // Realtime akan trigger loadComments() sehingga struktur hierarki akan tetap terjaga
      // Tapi kita tetap return data untuk keperluan lain 
      return commentWithAuthor;
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      console.error('Error adding comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postId, processCommentsWithAuthors, loadComments]);

  const updateComment = useCallback(async (commentId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .update(updateData)
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      
      // Realtime should handle this update
      // setComments(prev => 
      //   prev.map(comment => 
      //     comment.id === commentId ? { ...comment, ...data } : comment
      //   )
      // );

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating comment:', err);
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Realtime should handle this update
      // setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting comment:', err);
      throw err;
    }
  }, []);

  const addReply = useCallback(async (commentData, parentCommentId) => {
    if (!commentData.content.trim() || !commentData.user_id) {
      throw new Error('Reply content and user ID are required');
    }

    setLoading(true);
    try {
      const insertResult = await supabase
        .from('forum_comments')
        .insert([{
          ...commentData,
          post_id: postId,
          parent_comment_id: parentCommentId,
          likes: 0
        }])
        .select('*')
        .single();
      
      if (insertResult.error) {
        throw insertResult.error;
      }
      
      // Kita tidak perlu menangani secara manual karena realtime subscription akan memicu loadComments()
      const [replyWithAuthor] = await processCommentsWithAuthors([insertResult.data]);

      // Realtime akan handle pembaruan struktur komentar
      return replyWithAuthor;
    } catch (err) {
      setError(err.message);
      console.error('Error adding reply:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postId, processCommentsWithAuthors, loadComments]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    addReply
  };
};