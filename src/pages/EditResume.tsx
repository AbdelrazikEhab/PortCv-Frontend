import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PricingModal } from "@/components/payment/PricingModal";
import { ArrowLeft, Save, Download, Upload, Palette, Sparkles, Eye, Briefcase, TrendingUp } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ContactForm } from "@/components/edit/ContactForm";
import { SummaryForm } from "@/components/edit/SummaryForm";
import { ExperienceForm } from "@/components/edit/ExperienceForm";
import { SkillsForm } from "@/components/edit/SkillsForm";
import { ProjectsForm } from "@/components/edit/ProjectsForm";
import { EducationForm } from "@/components/edit/EducationForm";
import { LanguagesForm } from "@/components/edit/LanguagesForm";
import { SoftSkillsForm } from "@/components/edit/SoftSkillsForm";
import { TemplateSelector } from "@/components/edit/TemplateSelector";
import { ColorSchemeSelector } from "@/components/edit/ColorSchemeSelector";
import { SectionManager } from "@/components/edit/SectionManager";
import { COLOR_SCHEMES } from "@/types/template";
import { ClassicTemplate } from "@/components/resume-templates/ClassicTemplate";
import { ModernTemplate } from "@/components/resume-templates/ModernTemplate";
import { ProfessionalTemplate } from "@/components/resume-templates/ProfessionalTemplate";
import { MinimalTemplate } from "@/components/resume-templates/MinimalTemplate";
import { ResumeData } from "@/types/resume";
import { initialResumeData } from "@/data/resumeData";
import { ParsingOverlay } from "@/components/ui/ParsingOverlay";

export default function EditResume() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [resumeName, setResumeName] = useState("");
  const [formData, setFormData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [selectedColorScheme, setSelectedColorScheme] = useState("traditional");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAtsScore, setShowAtsScore] = useState(false);
  const [atsScore, setAtsScore] = useState<any>(null);
  const [checkingAts, setCheckingAts] = useState(false);
  const { toast } = useToast();
  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    softSkills: true,
    projects: true,
    languages: true,
  });
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchResume();
    }
  }, [user, id]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/resumes/${id}`);
      setResumeName(data.name);

      // Handle legacy data where education might be a single object
      let resumeData = data.data;
      if (resumeData.education && !Array.isArray(resumeData.education)) {
        resumeData.education = [resumeData.education];
      }

      setFormData({ ...initialResumeData, ...resumeData } as unknown as ResumeData);
      setSelectedTemplate(data.template);
      setSelectedColorScheme(data.colorScheme || "traditional");
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resume not found",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/resumes/${id}`, {
        data: formData,
        template: selectedTemplate,
        colorScheme: selectedColorScheme,
        visibleSections: visibleSections,
      });
      toast({
        title: "Success",
        description: "Resume updated successfully!",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save resume",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCheckAtsScore = async () => {
    setCheckingAts(true);
    try {
      const { data } = await api.post('/ai/ats-score', {
        resume: formData,
        language: i18n.language
      });
      setAtsScore(data);
      setShowAtsScore(true);
      toast({
        title: "Success",
        description: "ATS analysis complete!",
      });
    } catch (error: any) {
      console.error('Error checking ATS score:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to check ATS score",
      });
    } finally {
      setCheckingAts(false);
    }
  };

  const handleFixResume = async () => {
    if (!atsScore) return;

    setIsFixing(true);
    try {
      const { data } = await api.post('/ai/fix-resume', {
        resume: formData,
        atsFeedback: atsScore,
        language: i18n.language
      });

      if (data.success && data.data) {
        setFormData(data.data);
        toast({
          title: "Success",
          description: "Resume improved with AI suggestions!",
        });
        setShowAtsScore(false);
        // Trigger save
        await api.put(`/resumes/${id}`, {
          data: data.data,
          template: selectedTemplate,
          colorScheme: selectedColorScheme,
          visibleSections: visibleSections,
        });
      }
    } catch (error: any) {
      console.error('Error fixing resume:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to fix resume",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleToggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a PDF, TXT, or DOCX file",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const { data: result } = await api.post('/resumes/parse', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.success && result.data) {
        // Helper to normalize array data
        const normalizeArray = (data: any) => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          return [data];
        };

        // Properly map extracted data - OVERWRITE existing data
        const updatedFormData: ResumeData = {
          contact: {
            name: result.data.contact?.name || "",
            title: result.data.contact?.title || "",
            location: result.data.contact?.location || "",
            phone: normalizeArray(result.data.contact?.phone),
            email: result.data.contact?.email || "",
            github: result.data.contact?.github || "",
            linkedin: result.data.contact?.linkedin || "",
          },
          summary: result.data.summary || "",
          experience: normalizeArray(result.data.experience).map((exp: any, index: number) => ({
            id: `exp-${Date.now()}-${index}`,
            company: exp.company || "",
            position: exp.position || "",
            period: exp.period || "",
            responsibilities: normalizeArray(exp.responsibilities),
            technologies: exp.technologies || "",
          })),
          education: normalizeArray(result.data.education).map((edu: any) => ({
            institution: edu.institution || "",
            period: edu.period || "",
            degree: edu.degree || "",
            note: edu.note || "",
          })),
          skills: {
            programmingLanguages: normalizeArray(result.data.skills?.programmingLanguages),
            fundamentals: normalizeArray(result.data.skills?.fundamentals),
            frameworks: normalizeArray(result.data.skills?.frameworks),
            databases: normalizeArray(result.data.skills?.databases),
            apiDesign: normalizeArray(result.data.skills?.apiDesign),
            authentication: normalizeArray(result.data.skills?.authentication),
            tools: normalizeArray(result.data.skills?.tools),
            designPatterns: normalizeArray(result.data.skills?.designPatterns),
            frontend: normalizeArray(result.data.skills?.frontend),
            devops: normalizeArray(result.data.skills?.devops),
          },
          softSkills: normalizeArray(result.data.softSkills),
          projects: normalizeArray(result.data.projects),
          languages: normalizeArray(result.data.languages),
        };

        // Update local state
        setFormData(updatedFormData);

        // Automatically save to database
        try {
          await api.put(`/resumes/${id}`, {
            data: updatedFormData,
          });
          toast({
            title: "Success",
            description: "Resume parsed and saved successfully!",
          });
        } catch (saveError) {
          console.error('Error saving parsed resume:', saveError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Resume parsed but failed to save. Please click Save Changes manually.",
          });
        }
      } else {
        throw new Error('Invalid response from parser');
      }
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      if (error.response?.status === 402) {
        toast({
          variant: "destructive",
          title: "Credits Exhausted",
          description: "You need more AI credits to parse resumes. Please upgrade your plan.",
          action: (
            <Button variant="outline" size="sm" onClick={() => document.getElementById('pricing-trigger')?.click()}>
              View Plans
            </Button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Failed to parse resume",
        });
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("pdf-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = formData.contact?.name
        ? `${formData.contact.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";
      pdf.save(fileName);
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF",
      });
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading resume editor...</p>
        </div>
      </div>
    );
  }

  const colorScheme = COLOR_SCHEMES.find((cs) => cs.id === selectedColorScheme) || COLOR_SCHEMES[0];

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate data={formData} colorScheme={colorScheme} />;
      case "professional":
        return <ProfessionalTemplate data={formData} colorScheme={colorScheme} />;
      case "minimal":
        return <MinimalTemplate data={formData} colorScheme={colorScheme} />;
      default:
        return <ClassicTemplate data={formData} colorScheme={colorScheme} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParsingOverlay isVisible={isUploading} />
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
                Resume Editor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Navigation Buttons */}
            <Button
              onClick={() => navigate("/edit-portfolio")}
              variant="outline"
              size="sm"
              className="gap-2 border-purple-500/50 text-purple-500 hover:bg-purple-500 hover:text-white"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden lg:inline">Edit Portfolio</span>
            </Button>
            <Button
              onClick={() => navigate("/develop-skills")}
              variant="outline"
              size="sm"
              className="gap-2 border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden lg:inline">Develop Skills</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="hidden">
              <PricingModal triggerId="pricing-trigger" />
            </div>
            <Button
              onClick={handleCheckAtsScore}
              disabled={checkingAts}
              variant="outline"
              size="sm"
              className="gap-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{checkingAts ? "Analyzing..." : "ATS Score"}</span>
            </Button>
            <label htmlFor="resume-upload">
              <Button
                type="button"
                disabled={isUploading}
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{isUploading ? "Parsing..." : "Upload"}</span>
              </Button>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              variant="outline"
              size="sm"
              className="gap-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isGeneratingPDF ? "Generating..." : "PDF"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form with Tabs */}
          <div className="bg-card/50 p-6 rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">{resumeName}</h2>

            {/* Template & Color Selection */}
            <div className="space-y-6 mb-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />


              <ColorSchemeSelector
                selectedColorScheme={selectedColorScheme}
                onSelectColorScheme={setSelectedColorScheme}
              />

              <SectionManager
                sections={visibleSections}
                onToggleSection={handleToggleSection}
              />
            </div>

            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="experience">Work</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="contact" className="space-y-6">
                <ContactForm
                  contact={formData.contact}
                  onChange={(contact) => setFormData({ ...formData, contact })}
                />
                {visibleSections.summary && (
                  <SummaryForm
                    summary={formData.summary}
                    onChange={(summary) => setFormData({ ...formData, summary })}
                  />
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {visibleSections.experience && (
                  <ExperienceForm
                    experiences={formData.experience}
                    onChange={(experience) => setFormData({ ...formData, experience })}
                  />
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                {visibleSections.skills && (
                  <SkillsForm
                    skills={formData.skills}
                    onChange={(skills) => setFormData({ ...formData, skills })}
                  />
                )}
                {visibleSections.softSkills && (
                  <SoftSkillsForm
                    softSkills={formData.softSkills}
                    onChange={(softSkills) => setFormData({ ...formData, softSkills })}
                  />
                )}
              </TabsContent>

              <TabsContent value="other" className="space-y-6">
                {visibleSections.projects && (
                  <ProjectsForm
                    projects={formData.projects}
                    onChange={(projects) => setFormData({ ...formData, projects })}
                  />
                )}
                {visibleSections.education && (
                  <EducationForm
                    education={formData.education}
                    onChange={(education) => setFormData({ ...formData, education })}
                  />
                )}
                {visibleSections.languages && (
                  <LanguagesForm
                    languages={formData.languages}
                    onChange={(languages) => setFormData({ ...formData, languages })}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* PDF Preview */}
          <div className="bg-card p-6 rounded-2xl border border-border overflow-auto max-h-[800px] sticky top-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">PDF Preview</h2>
            <div id="pdf-content">{renderTemplate()}</div>
          </div>
        </div>
      </div>

      {/* ATS Score Dialog */}
      {showAtsScore && atsScore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">ATS Score Analysis</h2>
              <Button variant="ghost" onClick={() => setShowAtsScore(false)}>✕</Button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold gradient-text mb-2">{atsScore.score}</div>
                <div className="text-muted-foreground">out of 100</div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{atsScore.summary}</p>
              </div>

              {atsScore.strengths && atsScore.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-green-500">✓ Strengths</h3>
                  <ul className="space-y-2">
                    {atsScore.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {atsScore.improvements && atsScore.improvements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-yellow-500">⚠ Areas to Improve</h3>
                  <ul className="space-y-2">
                    {atsScore.improvements.map((improvement: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {atsScore.keywords && atsScore.keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">🔑 Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {atsScore.keywords.map((keyword: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowAtsScore(false)}>Close</Button>
                <Button
                  onClick={handleFixResume}
                  disabled={isFixing}
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  {isFixing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Fix with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
