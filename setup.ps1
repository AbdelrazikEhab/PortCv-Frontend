# Portfolio Craft - Setup and Deployment Script
# Run this script to set up your Supabase project

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Portfolio Craft - Setup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Supabase
Write-Host "[1/5] Logging in to Supabase..." -ForegroundColor Yellow
Write-Host "This will open your browser for authentication." -ForegroundColor Gray
npx supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Link project
Write-Host "[2/5] Linking to Supabase project..." -ForegroundColor Yellow
Write-Host "Project ID: iqwkwwbqxcxfqgvvqpvg" -ForegroundColor Gray
npx supabase link --project-ref iqwkwwbqxcxfqgvvqpvg

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Project linking failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project linked!" -ForegroundColor Green
Write-Host ""

# Step 3: Apply database migrations
Write-Host "[3/5] Applying database migrations..." -ForegroundColor Yellow
npx supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Migration failed. You may need to apply them manually." -ForegroundColor Yellow
} else {
    Write-Host "✅ Migrations applied!" -ForegroundColor Green
}
Write-Host ""

# Step 4: Deploy edge functions
Write-Host "[4/5] Deploying edge functions..." -ForegroundColor Yellow

$functions = @("openai-proxy", "create-checkout-session", "check-ats-score", "parse-resume")

foreach ($func in $functions) {
    Write-Host "  Deploying $func..." -ForegroundColor Gray
    npx supabase functions deploy $func
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $func deployed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $func deployment failed" -ForegroundColor Red
    }
}

Write-Host ""

# Step 5: Set secrets
Write-Host "[5/5] Setting up environment secrets..." -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to set the following secrets manually:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. OpenAI API Key:" -ForegroundColor White
Write-Host "   npx supabase secrets set OPENAI_API_KEY=your_key_here" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Stripe Secret Key:" -ForegroundColor White
Write-Host "   npx supabase secrets set STRIPE_SECRET_KEY=your_key_here" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Supabase URL:" -ForegroundColor White
Write-Host "   npx supabase secrets set SUPABASE_URL=https://iqwkwwbqxcxfqgvvqpvg.supabase.co" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Supabase Anon Key:" -ForegroundColor White
Write-Host "   npx supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here" -ForegroundColor Gray
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set the secrets listed above" -ForegroundColor White
Write-Host "2. Test the application at http://localhost:4173" -ForegroundColor White
Write-Host "3. Check DEPLOYMENT.md for troubleshooting" -ForegroundColor White
Write-Host ""
