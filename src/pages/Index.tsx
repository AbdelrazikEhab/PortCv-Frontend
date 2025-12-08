import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  UserPlus,
  FileText,
  Globe,
  Sparkles,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  Layout,
  Palette,
  Download
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "ATS-Friendly Templates",
      description: "Professionally designed resume templates that pass applicant tracking systems with flying colors.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Personal Portfolio URL",
      description: "Get your own yourname.portcv.com subdomain to showcase your work professionally.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Multiple Resumes",
      description: "Create and manage multiple resume versions tailored for different job applications.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Parsing",
      description: "Upload your existing resume or LinkedIn PDF and let AI extract all your details instantly.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Full Customization",
      description: "Choose colors, fonts, layouts, and animations to make your portfolio truly yours.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export to PDF",
      description: "Download your perfectly formatted resume as a PDF ready to submit to employers.",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const benefits = [
    "No credit card required to start",
    "Takes less than 5 minutes to set up",
    "Real-time preview as you edit",
    "SEO-optimized portfolio pages",
    "Analytics to track profile views",
    "Mobile-responsive designs"
  ];

  const stats = [
    { value: "10K+", label: "Resumes Created" },
    { value: "95%", label: "ATS Pass Rate" },
    { value: "50+", label: "Templates" },
    { value: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="PortCV" className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PortCV
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="hidden sm:flex">
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Resume & Portfolio Builder</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Build Your
            </span>
            <br />
            <span className="text-foreground">Professional Portfolio</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Create stunning ATS-friendly resumes and showcase your work with a personalized portfolio website.
            <span className="text-foreground font-medium"> Stand out. Get hired.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 border-2 hover:bg-accent/10 hover:border-accent transition-all"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Land Your Dream Job</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create professional resumes and portfolios that get results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PortCV?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              We've helped thousands of professionals create impressive portfolios and land their dream jobs. Here's what makes us different.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Trusted by Professionals</h4>
                  <p className="text-sm text-muted-foreground">Join thousands of successful users</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "PortCV helped me land interviews at top tech companies. The ATS-friendly templates are a game changer!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— Software Engineer at Google</p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "The portfolio feature is amazing. I got my first client just days after sharing my PortCV link!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— Freelance Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container max-w-7xl mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-accent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoMnY0aC0yem0xMiAxMHYtMmgtNHYyaDR6bS02IDBoLTR2LTJoNHYyem0tMTAgMHYtMmgtNHYyaDR6bS02IDBoLTR2MmgtMnYtMmgtMnYtMmgydi0yaDJ2Mmgydjto2poLTR6bS0yLTEwdi0yaDJ2MmgtMnptMTIgNnYtMmgydjJoLTJ6bS04LTZ2LTJoMnYyaC0yem0wIDZ2LTJoMnYyaC0yem04IDB2LTJoMnYyaC0yem02IDZ2LTJoLTR2LTJoNnY0aC0yem0tNi02aC0ydi0yaDJ2MnptLTYtMTJoMnY0aC0ydi00em0tOCA4djJoLTJ2LTJoMnptNi02aC0ydi0yaDJ2MnptMCA2di0yaDJ2Mmgtey2btNjB2LTJoMnYyaC0yem0wLTZ2LTJoMnYyaC0yem0wLTZ2LTJoMnYyey2em0wLTZ2LTJoMnYyaC0yem0wLTZ2LTJoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

          <div className="relative px-8 py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Professional Presence?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with PortCV. Start for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-white text-primary hover:bg-white/90 shadow-lg transition-all hover:scale-105"
                onClick={() => navigate("/auth")}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                onClick={() => navigate("/auth")}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="PortCV" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PortCV
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} PortCV. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
