-- KourseOS Database Schema
-- Focus: Infrastructure for Course Creators, Nano Learning, and Audio Delivery

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES: Core user data for creators and students
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('super_admin', 'creator', 'student')) DEFAULT 'student',
    organization_name TEXT, -- Reflects 'Infrastructure' branding (the creator's brand)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COURSES: The high-level product
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('draft', 'published', 'archived', 'review')) DEFAULT 'draft',
    category TEXT,
    settings JSONB DEFAULT '{}'::JSONB, -- For advanced configurations (marketing tags, affiliates rules)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LESSONS: The actual educational units
-- Includes logic for Nano Learning and Audio support
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    lesson_type TEXT CHECK (lesson_type IN ('text', 'video', 'audio', 'quiz')) DEFAULT 'text',
    
    -- Content fields
    content TEXT, -- Markdown or HTML content
    video_url TEXT,
    audio_url TEXT, -- Used for the 'Free Audio' / Podcastify feature
    
    -- Nano Learning Fields (IA Generated)
    nano_summary TEXT, -- Concise 1-minute read version
    action_item TEXT, -- The 'Concrete Task' for the student
    key_concept TEXT, -- The single idea the student must retain
    
    -- Access Control
    is_free BOOLEAN DEFAULT false, -- For marketing 'Audio Gratuito'
    duration_seconds INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_courses_creator ON public.courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- AFFILIATE SYSTEM: Infrastructure for growth and monetization
CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 30.00, -- Default 30% commission
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) DEFAULT 0.00,
    status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE SET NULL,
    referred_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method TEXT NOT NULL, -- PayPal, Stripe, Crypto
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for affiliate system
CREATE INDEX IF NOT EXISTS idx_affiliate_user ON public.affiliate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_user ON public.referrals(referred_user_id);

CREATE TRIGGER tr_affiliate_profiles_updated_at BEFORE UPDATE ON public.affiliate_profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
