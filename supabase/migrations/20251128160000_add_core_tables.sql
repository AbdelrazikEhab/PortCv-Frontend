-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'free', -- free, premium, cancelled
    plan_id TEXT, -- stripe price id
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain TEXT UNIQUE,
    theme JSONB DEFAULT '{}'::jsonb,
    sections JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- view, click, download
    metadata JSONB DEFAULT '{}'::jsonb, -- device, location, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to resumes table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'ats_score') THEN
        ALTER TABLE public.resumes ADD COLUMN ats_score INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'ats_feedback') THEN
        ALTER TABLE public.resumes ADD COLUMN ats_feedback JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'version_history') THEN
        ALTER TABLE public.resumes ADD COLUMN version_history JSONB DEFAULT '[]'::jsonb;
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'is_public') THEN
        ALTER TABLE public.resumes ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Subscriptions: Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Portfolios: Users can CRUD their own portfolio
CREATE POLICY "Users can CRUD own portfolio" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

-- Portfolios: Public can view published portfolios
CREATE POLICY "Public can view published portfolios" ON public.portfolios
    FOR SELECT USING (is_published = true);

-- Analytics: Users can view their own analytics
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

-- Analytics: Insert allowed for tracking (public) - requires careful setup, usually via edge function or specific public policy
-- For now, allowing authenticated insert for own resources, and public insert for tracking views
CREATE POLICY "Public can insert analytics" ON public.analytics
    FOR INSERT WITH CHECK (true); 

-- Resumes: Update policies to allow public view if is_public is true
CREATE POLICY "Public can view public resumes" ON public.resumes
    FOR SELECT USING (is_public = true);

