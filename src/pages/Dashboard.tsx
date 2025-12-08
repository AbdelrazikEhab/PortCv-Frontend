import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Pencil,
  Trash2,
  FileText,
  LogOut,
  User,
  Eye,
  Plus,
  Sparkles,
  Briefcase,
  FileEdit,
  Mail,
  MessageSquare,
  TrendingUp,
  Clock,
  MoreVertical,
  ExternalLink,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { JobMatcher } from "@/components/ai/JobMatcher";
import { CVRewriter } from "@/components/ai/CVRewriter";
import { CoverLetterGen } from "@/components/ai/CoverLetterGen";
import { InterviewPrep } from "@/components/ai/InterviewPrep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/resume/ResumeUploader";
import { PricingModal } from "@/components/payment/PricingModal";

interface Resume {
  id: string;
  name: string;
  template: string;
  colorScheme: string;
  createdAt: string;
  updatedAt: string;
  data: any;
}

interface Profile {
  username: string;
  fullName: string | null;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newResumeName, setNewResumeName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchResumes();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/resumes');
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch resumes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    if (!newResumeName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a resume name",
      });
      return;
    }

    try {
      const { data } = await api.post('/resumes', {
        name: newResumeName,
        template: 'classic',
        data: {}
      });

      setResumes([data, ...resumes]);
      setDialogOpen(false);
      setNewResumeName("");
      toast({
        title: "Success",
        description: "Resume created successfully!",
      });
    } catch (error) {
      console.error("Error creating resume:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create resume",
      });
    }
  };

  const handleDeleteResume = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/resumes/${id}`);
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      fetchResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resume",
      });
    }
  };

  const aiTools = [
    {
      id: "match",
      icon: <Briefcase className="w-5 h-5" />,
      title: "Job Match",
      description: "Find matching jobs",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "rewrite",
      icon: <FileEdit className="w-5 h-5" />,
      title: "Rewrite CV",
      description: "Optimize your resume",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "cover",
      icon: <Mail className="w-5 h-5" />,
      title: "Cover Letter",
      description: "Generate letters",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      id: "prep",
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Interview Prep",
      description: "Practice questions",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="PortCV" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PortCV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PricingModal />
            {profile && profile.username && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/portfolio/${profile.username}`)}
                  className="hidden sm:flex gap-2 border-border/50 hover:border-primary/30"
                >
                  <Eye className="w-4 h-4" />
                  View Portfolio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/edit-portfolio')}
                  className="hidden sm:flex gap-2 border-border/50 hover:border-primary/30"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </Button>
              </>
            )}
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-medium">
                {profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.fullName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your resumes and access AI-powered career tools.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                  <p className="text-sm text-muted-foreground">Resumes</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">AI Tools</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{resumes.length > 0 ? format(new Date(resumes[0]?.updatedAt || new Date()), "d") : "-"}</p>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">My Resumes</h2>
              <p className="text-muted-foreground text-sm">Create, edit, and manage your resumes</p>
            </div>
            <div className="flex gap-3">
              <ResumeUploader onUploadComplete={fetchResumes} />
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    New Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Resume</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new resume
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="resume-name">Resume Name</Label>
                      <Input
                        id="resume-name"
                        placeholder="e.g., Software Engineer Resume"
                        value={newResumeName}
                        onChange={(e) => setNewResumeName(e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateResume} className="bg-primary">
                      Create Resume
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {resumes.length === 0 ? (
            <Card className="border-dashed border-2 border-border/50 bg-card/30">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first professional resume or import an existing one
                </p>
                <div className="flex gap-3 justify-center">
                  <ResumeUploader onUploadComplete={fetchResumes} />
                  <Button onClick={() => setDialogOpen(true)} className="bg-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="group bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resume.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {resume.template} template
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteResume(resume.id, resume.name)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-border/50 hover:bg-primary/5 hover:border-primary/30"
                      onClick={() => navigate(`/edit-resume/${resume.id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Resume
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* AI Tools Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">AI Career Tools</h2>
            <p className="text-muted-foreground text-sm">Powered by AI to accelerate your job search</p>
          </div>

          <Tabs defaultValue="match" className="w-full">
            {/* Tool Selection Cards */}
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 h-auto bg-transparent p-0">
              {aiTools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="data-[state=active]:bg-card data-[state=active]:border-primary/30 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 bg-card/30 border border-border/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-all h-auto"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} p-0.5`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      {tool.icon}
                    </div>
                  </div>
                  <span className="font-medium text-sm">{tool.title}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{tool.description}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tool Content */}
            <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
              <TabsContent value="match" className="mt-0">
                <JobMatcher resumeText={resumes.length > 0 ? JSON.stringify(resumes[0].data) : ""} />
              </TabsContent>
              <TabsContent value="rewrite" className="mt-0">
                <CVRewriter />
              </TabsContent>
              <TabsContent value="cover" className="mt-0">
                <CoverLetterGen resumeText={resumes.length > 0 ? JSON.stringify(resumes[0].data) : ""} />
              </TabsContent>
              <TabsContent value="prep" className="mt-0">
                <InterviewPrep resumeText={resumes.length > 0 ? JSON.stringify(resumes[0].data) : ""} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
