-- Supabase Storage Buckets for UniSphere Application

-- Create bucket for user avatars
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('user-avatars', 'user-avatars', NULL, NOW(), NOW(), true, false, 5242880, '{"image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"}');

-- Create bucket for forum images
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('forum-images', 'forum-images', NULL, NOW(), NOW(), true, false, 10485760, '{"image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"}');

-- Create bucket for complaint evidence
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('complaints-evidence', 'complaints-evidence', NULL, NOW(), NOW(), false, false, 20971520, '{"image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}');

-- Create bucket for chat attachments
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('chat-attachments', 'chat-attachments', NULL, NOW(), NOW(), false, false, 10485760, '{"image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif", "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}');

-- RLS Policies for user-avatars bucket
CREATE POLICY "Allow users to read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Allow users to upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for forum-images bucket
CREATE POLICY "Allow users to read forum images" ON storage.objects FOR SELECT USING (bucket_id = 'forum-images');
CREATE POLICY "Allow users to upload forum images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to update forum images" ON storage.objects FOR UPDATE USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to delete forum images" ON storage.objects FOR DELETE USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for complaints-evidence bucket
CREATE POLICY "Allow users to read their own complaint evidence" ON storage.objects FOR SELECT USING (bucket_id = 'complaints-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to upload complaint evidence" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'complaints-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to update complaint evidence" ON storage.objects FOR UPDATE USING (bucket_id = 'complaints-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to delete complaint evidence" ON storage.objects FOR DELETE USING (bucket_id = 'complaints-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow admins to manage complaint evidence" ON storage.objects FOR ALL USING (bucket_id = 'complaints-evidence' AND auth.role() = 'service_role');

-- RLS Policies for chat-attachments bucket
CREATE POLICY "Allow users to read their own chat attachments" ON storage.objects FOR SELECT USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to upload chat attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to update chat attachments" ON storage.objects FOR UPDATE USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Allow users to delete chat attachments" ON storage.objects FOR DELETE USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);