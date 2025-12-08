# Deployment Instructions

## Issues Identified

1. **Edge Functions Not Deployed**: AI features (Job Match, CV Rewriter, Cover Letter, Interview Prep) are calling edge functions that exist locally but haven't been deployed to Supabase.

2. **Missing Database Constraints**: Portfolio edits not saving due to missing unique constraint on `portfolios.user_id`.

3. **CV Data Reading**: Need to verify resume data structure being passed to AI components.

---

## Steps to Fix

### 1. Apply Database Migration

The unique constraint migration has been created. Apply it:

```powershell
npx supabase db push
```

This will add unique constraints to:
- `portfolios.user_id`
- `subscriptions.user_id`

### 2. Deploy Edge Functions

You need to login to Supabase and deploy the edge functions:

```powershell
# Login to Supabase (this will open a browser for authentication)
npx supabase login

# Deploy all edge functions
npx supabase functions deploy openai-proxy
npx supabase functions deploy create-checkout-session
npx supabase functions deploy check-ats-score
npx supabase functions deploy parse-resume
```

### 3. Set Environment Variables

After deploying, set the required secrets for edge functions:

```powershell
# Set OpenAI API Key
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# Set Stripe Secret Key
npx supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Set Supabase credentials (for edge functions)
npx supabase secrets set SUPABASE_URL=your_supabase_url
npx supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Verify Deployment

After deployment, test each feature:

1. **AI Job Match**: Go to Dashboard → Job Match tab → Paste job description → Analyze
2. **CV Rewriter**: Go to Dashboard → Rewrite CV tab → Enter text → Rewrite
3. **Cover Letter**: Go to Dashboard → Cover Letter tab → Fill form → Generate
4. **Interview Prep**: Go to Dashboard → Interview tab → Enter job description → Generate
5. **Portfolio Edit**: Go to Edit Portfolio → Change colors → Save Changes

---

## Environment Variables Needed

Make sure you have these in your `.env` file:

```env
VITE_SUPABASE_URL=https://iqwkwwbqxcxfqgvvqpvg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

And these as Supabase secrets (for edge functions):

```env
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
SUPABASE_URL=https://iqwkwwbqxcxfqgvvqpvg.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Troubleshooting

### AI Features Not Working
- Check browser console (F12) for errors
- Verify edge functions are deployed: `npx supabase functions list`
- Check edge function logs: `npx supabase functions logs openai-proxy`

### Portfolio Edits Not Saving
- Check browser console for database errors
- Verify migration was applied successfully
- Check Supabase dashboard → Database → Tables → portfolios for unique constraint

### CV Data Reading Issues
- The resume data is passed as JSON string to AI components
- Check Dashboard.tsx line 306-329 for how resume data is passed
- Verify resume has data by checking Dashboard → My Resumes

---

## Quick Test Commands

```powershell
# Check if functions are deployed
npx supabase functions list

# View function logs
npx supabase functions logs openai-proxy --tail

# Check database status
npx supabase db diff
```
