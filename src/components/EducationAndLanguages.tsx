import { Education } from "@/types/resume";
import { GraduationCap, Globe } from "lucide-react";

type Languages = { language: string; proficiency: string };

interface EducationAndLanguagesProps {
  education: Education[];
  languages: Languages[];
  softSkills: string[];
}

export const EducationAndLanguages = ({ education, languages, softSkills }: EducationAndLanguagesProps) => {
  return (
    <section id="education" className="section-container">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card hover:shadow-glow transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className={index !== 0 ? "pt-6 border-t border-border/50" : ""}>
                  <h3 className="text-xl font-bold text-foreground mb-1">{edu.degree}</h3>
                  <p className="text-accent font-semibold mb-2">{edu.institution}</p>
                  <p className="text-muted-foreground text-sm mb-2">{edu.period}</p>
                  {edu.note && (
                    <p className="text-primary font-semibold">{edu.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card hover:shadow-glow transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Languages</h2>
            </div>
            <div className="space-y-3">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{lang.language}</span>
                  <span className="text-muted-foreground">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card hover:shadow-glow transition-all duration-500">
          <h2 className="text-2xl font-bold gradient-text mb-6">Soft Skills</h2>
          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-secondary rounded-xl text-foreground/90 hover:bg-accent hover:text-accent-foreground transition-colors cursor-default font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
