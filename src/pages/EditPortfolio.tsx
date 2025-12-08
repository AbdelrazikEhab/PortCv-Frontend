import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Eye,
  RefreshCw,
  Palette,
  Layout,
  BarChart3,
  Type,
  Sparkles,
  Layers,
  Globe,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioColorPicker } from "@/components/edit/PortfolioColorPicker";
import { SectionManager } from "@/components/edit/SectionManager";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { EducationAndLanguages } from "@/components/EducationAndLanguages";
import { ResumeData } from "@/types/resume";
import { initialResumeData } from "@/data/resumeData";
import { AnalyticsDashboard } from "@/components/portfolio/AnalyticsDashboard";
import { hexToHSL } from "@/lib/utils";

export default function EditPortfolio() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [username, setUsername] = useState("");
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primary: "#9b87f5",
    accent: "#0EA5E9",
    background: "#1A1F2C",
  });
  const [font, setFont] = useState("inter");
  const [layout, setLayout] = useState("modern");
  const [animation, setAnimation] = useState("none");
  const [sections, setSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    softSkills: true,
    projects: true,
    languages: true,
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [customLogo, setCustomLogo] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [projects, setProjects] = useState<Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    link: string;
    github: string;
  }>>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      const { data: portfolioData } = await api.get('/portfolios');
      if (portfolioData) {
        if (portfolioData.theme) {
          setColors({
            primary: portfolioData.theme.primary || colors.primary,
            accent: portfolioData.theme.accent || colors.accent,
            background: portfolioData.theme.background || colors.background,
          });
          setAnimation(portfolioData.theme.animation || 'none');
        }
        setSections(portfolioData.sections || sections);
        setUsername(portfolioData.subdomain || '');
        setFont(portfolioData.font || 'inter');
        setLayout(portfolioData.layout || 'modern');
        setProfileImage(portfolioData.profileImage || '');
        setCustomLogo(portfolioData.customLogo || '');
      }

      await fetchLatestResume();
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestResume = async () => {
    try {
      const { data: resumesData } = await api.get('/resumes');
      if (resumesData && resumesData.length > 0) {
        setResumeData(resumesData[0].data);
        setResumeId(resumesData[0].id);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/portfolios', {
        subdomain: username,
        theme: { ...colors, animation },
        sections,
        font,
        layout,
        profileImage,
        customLogo,
        isPublished: true
      });

      toast.success("Portfolio settings saved successfully!");
    } catch (error) {
      console.error("Error saving portfolio settings:", error);
      toast.error("Failed to save portfolio settings");
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
  };

  const handleToggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePreview = () => {
    if (username) {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port ? `:${window.location.port}` : '';

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        window.open(`${protocol}//${username}.localhost${port}`, '_blank');
      } else {
        const rootDomain = hostname.replace(/^www\./, '');
        if (rootDomain.includes('portcv.com')) {
          window.open(`${protocol}//${username}.portcv.com${port}`, '_blank');
        } else {
          const parts = rootDomain.split('.');
          if (parts.length > 2) {
            parts[0] = username;
            window.open(`${protocol}//${parts.join('.')}${port}`, '_blank');
          } else {
            window.open(`${protocol}//${username}.${rootDomain}${port}`, '_blank');
          }
        }
      }
    } else {
      toast.error("Please set your username first");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'logo') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    if (type === 'profile') {
      setUploadingImage(true);
    } else {
      setUploadingLogo(true);
    }

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'profile') {
          setProfileImage(base64String);
          toast.success('Profile image uploaded successfully!');
        } else {
          setCustomLogo(base64String);
          toast.success('Logo uploaded successfully!');
          // Update favicon dynamically happens via useEffect now
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (link) link.href = base64String;
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      if (type === 'profile') {
        setUploadingImage(false);
      } else {
        setUploadingLogo(false);
      }
      // Reset file input
      event.target.value = '';
    }
  };

  // Update favicon when custom logo changes
  useEffect(() => {
    if (customLogo) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = customLogo;
      }

      // Cleanup: Reset favicon when leaving editor
      return () => {
        if (link) {
          link.href = "/logo.svg";
        }
      };
    }
  }, [customLogo]);

  const handleRegenerateWithAI = async () => {
    if (!resumeId) {
      toast.error('Please select a resume first');
      return;
    }

    setRegenerating(true);
    try {
      const { data } = await api.post('/ai/generate-portfolio-design', {
        resumeId
      });

      // Apply AI-generated design
      if (data.colors) {
        setColors(data.colors);
      }
      if (data.font) {
        setFont(data.font);
      }
      if (data.layout) {
        setLayout(data.layout);
      }
      if (data.sections) {
        setSections(data.sections);
      }

      toast.success('Portfolio design regenerated with AI!');
    } catch (error: any) {
      console.error('Error regenerating portfolio:', error);
      toast.error(error.response?.data?.error || 'Failed to regenerate portfolio');
    } finally {
      setRegenerating(false);
    }
  };

  const fonts = [
    { id: 'inter', name: 'Inter', style: 'font-sans' },
    { id: 'roboto', name: 'Roboto', style: 'font-sans' },
    { id: 'poppins', name: 'Poppins', style: 'font-sans' },
    { id: 'lora', name: 'Lora', style: 'font-serif' },
  ];

  const layouts = [
    { id: 'modern', name: 'Modern', desc: 'Clean & professional' },
    { id: 'minimal', name: 'Minimal', desc: 'Simple & elegant' },
    { id: 'creative', name: 'Creative', desc: 'Bold & unique' },
  ];

  const animations = [
    { id: 'none', name: 'None' },
    { id: 'fade', name: 'Fade' },
    { id: 'slide', name: 'Slide' },
    { id: 'scale', name: 'Scale' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading portfolio settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="hidden md:flex items-center gap-3">
              <img src="/logo.svg" alt="PortCV" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Edit Portfolio
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchLatestResume()} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            {resumeId && (
              <>
                <Button onClick={() => navigate(`/edit-resume/${resumeId}`)} variant="outline" size="sm" className="gap-2">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Content</span>
                </Button>
                <Button
                  onClick={handleRegenerateWithAI}
                  disabled={regenerating}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">{regenerating ? 'Regenerating...' : 'AI Regenerate'}</span>
                </Button>
              </>
            )}
            <Button
              onClick={handleSave}
              size="sm"
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              size="sm"
              className="gap-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-card/50 border border-border/50 rounded-xl">
                <TabsTrigger value="design" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Design</span>
                </TabsTrigger>
                <TabsTrigger value="sections" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">Sections</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="mt-6 space-y-6">
                {/* Username */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Portfolio URL</h3>
                      <p className="text-xs text-muted-foreground">Your unique portfolio address</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="your-name"
                      className="max-w-xs bg-background/50"
                    />
                    <span className="text-sm text-muted-foreground">.portcv.com</span>
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile Image</h3>
                      <p className="text-xs text-muted-foreground">Upload your profile picture</p>
                    </div>
                  </div>
                  {profileImage && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                      />
                    </div>
                  )}
                  <label htmlFor="profile-image-upload">
                    <Button
                      type="button"
                      disabled={uploadingImage}
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : profileImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'profile')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Custom Logo Upload */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Custom Logo</h3>
                      <p className="text-xs text-muted-foreground">Upload logo for browser tab (favicon)</p>
                    </div>
                  </div>
                  {customLogo && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={customLogo}
                        alt="Logo"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20"
                      />
                    </div>
                  )}
                  <label htmlFor="logo-upload">
                    <Button
                      type="button"
                      disabled={uploadingLogo}
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingLogo ? 'Uploading...' : customLogo ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Colors */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Colors</h3>
                      <p className="text-xs text-muted-foreground">Customize your portfolio theme</p>
                    </div>
                  </div>
                  <PortfolioColorPicker colors={colors} onColorChange={handleColorChange} />
                </div>

                {/* Typography */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <Type className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Typography</h3>
                      <p className="text-xs text-muted-foreground">Choose your font style</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFont(f.id)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${font === f.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 hover:border-primary/30'
                          }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Layout className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Layout Style</h3>
                      <p className="text-xs text-muted-foreground">Overall design approach</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {layouts.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLayout(l.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${layout === l.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/30'
                          }`}
                      >
                        <span className={`block text-sm font-medium ${layout === l.id ? 'text-primary' : ''}`}>
                          {l.name}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {l.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animations */}
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Animations</h3>
                      <p className="text-xs text-muted-foreground">Page transitions</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {animations.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setAnimation(a.id)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${animation === a.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 hover:border-primary/30'
                          }`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="mt-6 space-y-6">
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <SectionManager sections={sections} onToggleSection={handleToggleSection} />
                </div>

                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <h4 className="font-medium mb-3">Active Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sections)
                      .filter(([_, enabled]) => enabled)
                      .map(([section]) => (
                        <span key={section} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </span>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6 space-y-6">
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">My Projects</h3>
                        <p className="text-xs text-muted-foreground">Showcase your work with images and links</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setProjects([...projects, {
                        id: Date.now().toString(),
                        name: '',
                        description: '',
                        image: '',
                        link: '',
                        github: ''
                      }])}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </Button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No projects yet. Click "Add Project" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project, index) => (
                        <div key={project.id} className="p-4 border border-border/50 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Project {index + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Project Name</Label>
                              <Input
                                value={project.name}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[index].name = e.target.value;
                                  setProjects(updated);
                                }}
                                placeholder="My Awesome Project"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Live URL</Label>
                              <Input
                                value={project.link}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[index].link = e.target.value;
                                  setProjects(updated);
                                }}
                                placeholder="https://myproject.com"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={project.description}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[index].description = e.target.value;
                                setProjects(updated);
                              }}
                              placeholder="Brief description of your project"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>GitHub URL</Label>
                              <Input
                                value={project.github}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[index].github = e.target.value;
                                  setProjects(updated);
                                }}
                                placeholder="https://github.com/..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Project Image</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={project.image}
                                  onChange={(e) => {
                                    const updated = [...projects];
                                    updated[index].image = e.target.value;
                                    setProjects(updated);
                                  }}
                                  placeholder="Image URL or upload"
                                  className="flex-1"
                                />
                                <label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => document.getElementById(`project-image-${index}`)?.click()}
                                  >
                                    <Upload className="w-4 h-4" />
                                  </Button>
                                  <input
                                    id={`project-image-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (evt) => {
                                          const updated = [...projects];
                                          updated[index].image = evt.target?.result as string;
                                          setProjects(updated);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {project.image && (
                            <div className="mt-2">
                              <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <AnalyticsDashboard />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl bg-card/50 border border-border/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                <h2 className="font-semibold">Live Preview</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div
                className={`portfolio-preview font-${font} layout-${layout} animate-${animation} max-h-[700px] overflow-auto`}
                style={{
                  '--primary': hexToHSL(colors.primary),
                  '--accent': hexToHSL(colors.accent),
                  '--background': hexToHSL(colors.background),
                  '--primary-glow': hexToHSL(colors.primary),
                } as React.CSSProperties}
              >
                <Hero contact={resumeData.contact} profileImage={profileImage} />
                {sections.summary && <About summary={resumeData.summary} />}
                {sections.experience && <Experience experiences={resumeData.experience} />}
                {sections.skills && <Skills skills={resumeData.skills} />}
                {sections.projects && <Projects projects={resumeData.projects} />}
                {(sections.education || sections.languages) && (
                  <EducationAndLanguages
                    education={resumeData.education}
                    languages={resumeData.languages}
                    softSkills={resumeData.softSkills}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
