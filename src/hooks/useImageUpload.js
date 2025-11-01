// src/hooks/useImageUpload.js
import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file, folderPath = 'general', userId = null, bucketName = 'complaints') => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file (JPEG, PNG, etc.)');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Correct path structure for RLS policy: userId/folderPath/fileName
      const filePath = userId ? `${userId}/${folderPath}/${fileName}` : `${folderPath}/${fileName}`;

      // Upload file to Supabase Storage using the specified bucket
      const { data, error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadImage,
    uploading,
    error
  };
};