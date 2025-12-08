import { Toaster } from "@/components/ui/toaster";
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
    const parts = hostname.split('.');

    // If subdomain exists and it's not 'www' or localhost
    if (parts.length >= 3 && parts[0] !== 'www') {
      return true;
    }

    // Also check localhost with subdomain for testing (e.g., user.localhost:8080)
    if (hostname.includes('localhost') && parts.length > 1 && parts[0] !== 'localhost') {
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
