// src/components/Complaint/ComplaintForm.jsx
import React, { useState } from 'react';
import { Upload, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabase';
import './ComplaintForm.css';

function ComplaintForm({ onSubmit, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Ref untuk mengakses file input
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Harap unggah file gambar (JPEG, PNG, dll)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file harus kurang dari 5MB');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Judul dan deskripsi wajib diisi');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const complaintData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };
      
      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/complaint-evidence/${fileName}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('complaints-evidence')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Use signed URL for private bucket access
        const { data: { signedUrl }, error: signedUrlError } = await supabase
          .storage
          .from('complaints-evidence')
          .createSignedUrl(filePath, 3600); // Valid for 1 hour
        
        if (signedUrlError) {
          // Fallback to public URL if signed URL creation fails
          const { data: { publicUrl } } = supabase
            .storage
            .from('complaints-evidence')
            .getPublicUrl(filePath);
          complaintData.image_url = publicUrl;
        } else {
          complaintData.image_url = signedUrl;
        }
      }
      
      await onSubmit(complaintData);
      setSuccess(true);
      setSubmitting(false);
      setUploading(false);
      
      // Reset form after successful submission
      setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengaduan');
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="cf-container">
      <div className="cf-header">
        <h3>Ajukan Keluhan Baru</h3>
        <p>Jelaskan masalah yang Anda alami</p>
      </div>
      
      {error && (
        <div className="cf-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="cf-error-close">
            &times;
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="cf-form">
        <div className="cf-form-grid">
          <div className="cf-form-group">
            <label>Judul *</label>
            <input
              type="text"
              placeholder="Deskripsikan masalah secara singkat..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="cf-input"
              required
              disabled={submitting}
            />
          </div>
          
          <div className="cf-form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="cf-select"
              disabled={submitting}
            >
              <option value="general">Umum</option>
              <option value="technical">Masalah Teknis</option>
              <option value="academic">Akademik</option>
              <option value="facility">Fasilitas</option>
              <option value="safety">Keamanan</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className="cf-form-group">
            <label>Prioritas</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="cf-select"
              disabled={submitting}
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>

          <div className="cf-form-group cf-full-width">
            <label>Deskripsi *</label>
            <textarea
              placeholder="Jelaskan secara detail tentang keluhan Anda..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="cf-textarea"
              rows="4"
              required
              disabled={submitting}
            />
          </div>
          
          <div className="cf-form-group cf-full-width">
            <label>Gambar (Opsional)</label>
            <div className="cf-upload-area">
              <input
                type="file"
                id="cf-image-upload"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="cf-upload-input"
                disabled={submitting || uploading}
              />
              {uploading ? (
                <div className="cf-upload-label">
                  <div className="cf-upload-content">
                    <Upload size={24} />
                    <div className="cf-spin"></div>
                  </div>
                  <span>
                    Mengunggah {imageFile ? imageFile.name : 'gambar...'}
                  </span>
                  <small>Harap tunggu...</small>
                </div>
              ) : (
                <label htmlFor="cf-image-upload" className="cf-upload-label">
                  <div className="cf-upload-content">
                    <Upload size={24} />
                  </div>
                  <span>
                    {imageFile ? imageFile.name : 'Klik atau seret gambar ke sini'}
                  </span>
                  <small>Maks. 5MB • JPG, PNG, GIF</small>
                </label>
              )}
              
              {imagePreview && (
                <div className="cf-preview">
                  <img src={imagePreview} alt="Pratinjau" className="cf-preview-img" />
                  <button
                    type="button"
                    className="cf-preview-remove"
                    onClick={removeImage}
                    disabled={submitting}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cf-form-actions">
          {!submitting ? (
            <button 
              type="submit" 
              className="cf-submit-btn"
              disabled={submitting || uploading}
            >
              <div className="cf-button-content">
                <Send size={18} />
                {'Kirim Pengaduan'}
              </div>
            </button>
          ) : (
            <button 
              type="button"
              className="cf-submit-btn cf-submitting"
              disabled
            >
              <div className="cf-button-content">
                <div className="cf-spin"></div>
                {'Mengirim...'}
              </div>
            </button>
          )}
          <button 
            type="button" 
            className="cf-cancel-btn"
            onClick={onCancel}
            disabled={submitting || uploading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComplaintForm;