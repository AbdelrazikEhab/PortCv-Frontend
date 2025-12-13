import { Toaster } from "@/components/ui/toaster";
import "@/lib/i18n";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ResumeListProvider } from "@/contexts/ResumeListContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Edit from "./pages/Edit";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import ResumeList from "./pages/ResumeList";
import EditResume from "./pages/EditResume";
import EditPortfolio from "./pages/EditPortfolio";
import PricingPage from "./pages/PricingPage";
import SubscriptionSettings from "./pages/SubscriptionSettings";
import MasterDashboard from "./pages/admin/MasterDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import ProjectManagement from "./pages/admin/ProjectManagement";
import FeatureControl from "./pages/admin/FeatureControl";
import DatabaseManagement from "./pages/admin/DatabaseManagement";
import PaymentSettings from "./pages/admin/PaymentSettings";
import DevelopSkill from "./pages/DevelopSkill";
import NotFound from "./pages/NotFound";

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
    if (hostname.endsWith('.vercel.app')) {
      return false;
    }

    // Ignore IP addresses (e.g. 192.168.1.1)
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) {
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
              </TooltipProvider>
            </ResumeListProvider>
          </ResumeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
