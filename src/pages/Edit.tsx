import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Download } from "lucide-react";
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

export default function Edit() {
  const { resumeData, updateResumeData } = useResume();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(resumeData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSave = () => {
    updateResumeData(formData);
    toast.success("Resume updated successfully!");
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

      pdf.save(`${formData.contact.name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary-glow">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              variant="outline"
              className="gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form with Tabs */}
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold gradient-text mb-6">Edit Resume</h2>

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
                <SummaryForm
                  summary={formData.summary}
                  onChange={(summary) => setFormData({ ...formData, summary })}
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <ExperienceForm
                  experiences={formData.experience}
                  onChange={(experience) => setFormData({ ...formData, experience })}
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <SkillsForm
                  skills={formData.skills}
                  onChange={(skills) => setFormData({ ...formData, skills })}
                />
                <SoftSkillsForm
                  softSkills={formData.softSkills}
                  onChange={(softSkills) => setFormData({ ...formData, softSkills })}
                />
              </TabsContent>

              <TabsContent value="other" className="space-y-6">
                <ProjectsForm
                  projects={formData.projects}
                  onChange={(projects) => setFormData({ ...formData, projects })}
                />
                <EducationForm
                  education={formData.education}
                  onChange={(education) => setFormData({ ...formData, education })}
                />
                <LanguagesForm
                  languages={formData.languages}
                  onChange={(languages) => setFormData({ ...formData, languages })}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* PDF Preview */}
          <div className="bg-card p-6 rounded-2xl border border-border overflow-auto max-h-[800px] sticky top-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">PDF Preview</h2>
            <div id="pdf-content" className="bg-white p-8 rounded-lg space-y-5 text-sm text-black">
              {/* Header */}
              <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold text-black">{formData.contact.name}</h1>
                <p className="text-lg font-semibold mt-1">{formData.contact.title}</p>
                <div className="text-sm mt-2 space-y-0.5">
                  <p>{formData.contact.location}</p>
                  <p>{formData.contact.phone.join(" | ")}</p>
                  <p>
                    {formData.contact.email} | {formData.contact.github} | {formData.contact.linkedin}
                  </p>
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <p className="text-xs leading-relaxed text-justify">{formData.summary}</p>
              </div>

              {/* Professional Experience */}
              <div>
                <h2 className="text-base font-bold text-black mb-2 uppercase">Professional Experience</h2>
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-sm">{exp.position}, {exp.company}</h3>
                      <span className="text-xs">{exp.period}</span>
                    </div>
                    <ul className="list-disc ml-5 space-y-0.5">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-xs leading-relaxed">
                          {resp}
                        </li>
                      ))}
                    </ul>
                    {exp.technologies && (
                      <p className="text-xs mt-1">
                        <span className="font-semibold">Technologies:</span> {exp.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Education */}
              <div>
                <h2 className="text-base font-bold text-black mb-2 uppercase">Education</h2>
                <div>
                  <h3 className="font-bold text-sm">{formData.education.institution}</h3>
                  <p className="text-xs">{formData.education.period}</p>
                  <p className="text-xs">{formData.education.degree}</p>
                  {formData.education.note && (
                    <p className="text-xs">{formData.education.note}</p>
                  )}
                </div>
              </div>

              {/* Soft Skills */}
              {formData.softSkills && formData.softSkills.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-black mb-2 uppercase">Soft Skills</h2>
                  <p className="text-xs">{formData.softSkills.join(", ")}</p>
                </div>
              )}

              {/* Page Break Indicator */}
              <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

              {/* Technical Skills */}
              <div>
                <h2 className="text-base font-bold text-black mb-2 uppercase">Technical Skills</h2>
                <div className="space-y-1">
                  {formData.skills.programmingLanguages.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Programming Languages:</span>{" "}
                      {formData.skills.programmingLanguages.join(", ")}
                    </p>
                  )}
                  {formData.skills.fundamentals && formData.skills.fundamentals.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Programming Fundamentals:</span>{" "}
                      {formData.skills.fundamentals.join(", ")}
                    </p>
                  )}
                  {formData.skills.frameworks.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Frameworks:</span>{" "}
                      {formData.skills.frameworks.join(", ")}
                    </p>
                  )}
                  {formData.skills.databases.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Database:</span>{" "}
                      {formData.skills.databases.join(", ")}
                    </p>
                  )}
                  {formData.skills.apiDesign && formData.skills.apiDesign.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">API Design:</span>{" "}
                      {formData.skills.apiDesign.join(", ")}
                    </p>
                  )}
                  {formData.skills.authentication && formData.skills.authentication.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Authentication & Authorization:</span>{" "}
                      {formData.skills.authentication.join(", ")}
                    </p>
                  )}
                  {formData.skills.tools.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Tools & Technologies:</span>{" "}
                      {formData.skills.tools.join(", ")}
                    </p>
                  )}
                  {formData.skills.designPatterns && formData.skills.designPatterns.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Design Patterns & Clean Code:</span>{" "}
                      {formData.skills.designPatterns.join(", ")}
                    </p>
                  )}
                  {formData.skills.frontend && formData.skills.frontend.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">Front-End Systems:</span>{" "}
                      {formData.skills.frontend.join(", ")}
                    </p>
                  )}
                  {formData.skills.devops.length > 0 && (
                    <p className="text-xs">
                      <span className="font-semibold">DevOps & Practices:</span>{" "}
                      {formData.skills.devops.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Projects */}
              {formData.projects && formData.projects.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-black mb-2 uppercase">Projects</h2>
                  <ul className="list-disc ml-5 space-y-1">
                    {formData.projects.map((proj, idx) => (
                      <li key={idx} className="text-xs">
                        <span className="font-semibold">{proj.name}</span>
                        {proj.url && (
                          <>: {proj.url}</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {formData.languages && formData.languages.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-black mb-2 uppercase">Languages</h2>
                  <ul className="list-disc ml-5 space-y-0.5">
                    {formData.languages.map((lang, idx) => (
                      <li key={idx} className="text-xs">
                        {lang.language}: {lang.proficiency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
