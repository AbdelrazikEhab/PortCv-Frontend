-- Add unique constraint to portfolios.user_id
-- This allows upsert operations with onConflict: 'user_id'
ALTER TABLE public.portfolios 
ADD CONSTRAINT portfolios_user_id_unique UNIQUE (user_id);

-- Add unique constraint to subscriptions.user_id
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);
