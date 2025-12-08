import { Experience as ExperienceType } from "@/types/resume";
import { Briefcase, Calendar } from "lucide-react";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience = ({ experiences }: ExperienceProps) => {
  return (
    <section id="experience" className="section-container">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 gradient-text text-center">
        Professional Experience
      </h2>
      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card hover:shadow-glow transition-all duration-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {exp.position}
                </h3>
                <p className="text-accent font-semibold text-lg">{exp.company}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>{exp.period}</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-4">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex gap-3 text-foreground/80">
                  <span className="text-accent mt-1.5">▹</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="text-accent font-semibold">Technologies: </span>
                {exp.technologies}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
