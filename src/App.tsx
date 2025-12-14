import { Toaster } from "@/components/ui/toaster";
import "@/lib/i18n";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ResumeListProvider } from "@/contexts/ResumeListContext";
import { AuthProvider } from "@/contexts/AuthContext";


// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const Edit = lazy(() => import("./pages/Edit"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ResumeList = lazy(() => import("./pages/ResumeList"));
const EditResume = lazy(() => import("./pages/EditResume"));
const EditPortfolio = lazy(() => import("./pages/EditPortfolio"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const SubscriptionSettings = lazy(() => import("./pages/SubscriptionSettings"));
const MasterDashboard = lazy(() => import("./pages/admin/MasterDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ProjectManagement = lazy(() => import("./pages/admin/ProjectManagement"));
const FeatureControl = lazy(() => import("./pages/admin/FeatureControl"));
const DatabaseManagement = lazy(() => import("./pages/admin/DatabaseManagement"));
const PaymentSettings = lazy(() => import("./pages/admin/PaymentSettings"));
const DevelopSkill = lazy(() => import("./pages/DevelopSkill"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  // Check if we're accessing via subdomain
  const isSubdomain = () => {
    const hostname = window.location.hostname;

    // Define main domains that should ALWAYS show the landing page (not a user portfolio)
    const mainDomains = [
      'localhost',
      '127.0.0.1',
      'port-cv-frontend.vercel.app', // Vercel Production
      'www.port-cv-frontend.vercel.app',
      'port-cv.com',                 // Custom Domain (Future proofing)
      'www.port-cv.com'
    ];

    // If exact match with a main domain, it's NOT a subdomain
    if (mainDomains.includes(hostname)) {
      return false;
    }

    // Ignore Vercel preview URLs (anything ending in .vercel.app)
    // We assume ONLY custom domains support subdomains for now, OR we have a specific wildcard list.
    // If we want to support actual subdomains on vercel (e.g. user.project.vercel.app), we need to be more specific.
    // But generally, for this app, any *.vercel.app is likely a deployment preview -> Main App
    // if (hostname.endsWith('.vercel.app')) {
    //   return false;
    // }

    // Ignore IP addresses (e.g. 192.168.1.1)
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) {
      return false;
    }

    // Ignore Vercel previews for this specific project (starts with project name)
    if (hostname.startsWith('port-cv-frontend')) {
      return false;
    }

    const parts = hostname.split('.');

    // Handle localhost subdomains (e.g. user.localhost)
    if (hostname.includes('localhost')) {
      return parts.length > 1 && parts[0] !== 'www';
    }

    // Handle Custom Domains (e.g. user.port-cv.com)
    // standard: domain.com (2 parts) -> Main
    // www.domain.com (3 parts) -> Main
    // sub.domain.com (3 parts) -> Subdomain
    if (parts.length >= 3 && parts[0] !== 'www') {
      return true;
    }

    return false;
  };

  // If accessing via subdomain, show portfolio directly
  if (isSubdomain()) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ResumeProvider>
              <ResumeListProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Portfolio />
                </TooltipProvider>
              </ResumeListProvider>
            </ResumeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ResumeProvider>
            <ResumeListProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/subscription" element={<SubscriptionSettings />} />
                    <Route path="/portfolio/:username" element={<Portfolio />} />
                    <Route path="/resumes" element={<ResumeList />} />
                    <Route path="/edit-resume/:id" element={<EditResume />} />
                    <Route path="/edit-portfolio" element={<EditPortfolio />} />
                    <Route path="/admin" element={<MasterDashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/settings" element={<SystemSettings />} />
                    <Route path="/admin/projects" element={<ProjectManagement />} />
                    <Route path="/admin/features" element={<FeatureControl />} />
                    <Route path="/admin/database" element={<DatabaseManagement />} />
                    <Route path="/admin/payments" element={<PaymentSettings />} />
                    <Route path="/develop-skills" element={<DevelopSkill />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </ResumeListProvider>
          </ResumeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
