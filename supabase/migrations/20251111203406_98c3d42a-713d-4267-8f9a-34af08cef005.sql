-- Create portfolio_settings table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  colors JSONB NOT NULL DEFAULT '{"primary": "#9b87f5", "accent": "#0EA5E9", "background": "#1A1F2C"}'::jsonb,
  sections JSONB NOT NULL DEFAULT '{"summary": true, "experience": true, "education": true, "skills": true, "softSkills": true, "projects": true, "languages": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own portfolio settings"
  ON public.portfolio_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio settings"
  ON public.portfolio_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio settings"
  ON public.portfolio_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_settings_updated_at
  BEFORE UPDATE ON public.portfolio_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();