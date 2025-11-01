-- Supabase Tables for UniSphere Application

-- Profiles table for user information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username VARCHAR(100),
  full_name VARCHAR(150),
  avatar_url TEXT,
  bio TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Chat sessions table for AI conversations
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat sessions." ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions." ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Forum posts table
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  category VARCHAR(50),
  reactions JSONB DEFAULT '{}', -- Store reactions as JSON (e.g., {"heart": 5, "laugh": 2})
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for forum_posts
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all forum posts." ON forum_posts
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own forum posts." ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_anonymous = TRUE);
CREATE POLICY "Users can update their own forum posts." ON forum_posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own forum posts." ON forum_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Forum comments table
CREATE TABLE forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts NOT NULL,
  user_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  parent_comment_id UUID REFERENCES forum_comments, -- For nested replies
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for forum_comments
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all forum comments." ON forum_comments
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own forum comments." ON forum_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_anonymous = TRUE);
CREATE POLICY "Users can update their own forum comments." ON forum_comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own forum comments." ON forum_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Sentiment reports table for analytics
CREATE TABLE sentiment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  score NUMERIC(3,2), -- A score between 0 and 1 representing sentiment intensity
  conversation_summary TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for sentiment_reports
ALTER TABLE sentiment_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sentiment reports." ON sentiment_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sentiment reports." ON sentiment_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sentiment reports." ON sentiment_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin analytics table for campus-wide insights
CREATE TABLE admin_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  value JSONB NOT NULL, -- Store metric values as JSON
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for admin_analytics (only for admin access)
ALTER TABLE admin_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view analytics." ON admin_analytics
  FOR SELECT USING (auth.role() = 'service_role');

-- User mood tracking table
CREATE TABLE mood_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood VARCHAR(20) NOT NULL CHECK (mood IN ('happy', 'sad', 'anxious', 'calm', 'stressed', 'excited', 'tired')),
  note TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10), -- Scale from 1-10
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for mood_tracking
ALTER TABLE mood_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own mood entries." ON mood_tracking
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mood entries." ON mood_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood entries." ON mood_tracking
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood entries." ON mood_tracking
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- e.g., 'chat_response', 'forum_reply', 'wellness_tip'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications." ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications." ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications." ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Realtime subscriptions
-- Enable real-time for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at);
CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX idx_sentiment_reports_user_id ON sentiment_reports(user_id);
CREATE INDEX idx_sentiment_reports_date ON sentiment_reports(date);
CREATE INDEX idx_mood_tracking_user_id ON mood_tracking(user_id);
CREATE INDEX idx_mood_tracking_recorded_at ON mood_tracking(recorded_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create RLS function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables that have updated_at column
CREATE TRIGGER handle_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_forum_posts_updated_at 
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment view count on forum posts
CREATE OR REPLACE FUNCTION increment_post_view(post_id_arg UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts SET views = views + 1 WHERE id = post_id_arg;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment count when a comment is added
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_posts 
  SET comment_count = comment_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment count
CREATE TRIGGER increment_comment_count_trigger
  AFTER INSERT ON forum_comments
  FOR EACH ROW EXECUTE FUNCTION increment_comment_count();

-- Complaints table for user reports
CREATE TABLE complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category VARCHAR(50) DEFAULT 'general',
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own complaints." ON complaints
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own complaints." ON complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all complaints." ON complaints
  FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Admins can update complaints." ON complaints
  FOR UPDATE USING (auth.role() = 'service_role');

-- Create index for better performance
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_complaints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for complaints updated_at
CREATE TRIGGER handle_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION public.handle_complaints_updated_at();

-- Apply trigger to forum_comments table (it has updated_at column but no trigger)
CREATE TRIGGER handle_forum_comments_updated_at 
  BEFORE UPDATE ON forum_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();