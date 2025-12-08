import { Skills as SkillsType } from "@/types/resume";
import { Code2, Database, Layers, Shield, Wrench, Paintbrush, Cpu, GitBranch } from "lucide-react";

interface SkillsProps {
  skills: SkillsType;
}

const skillCategories = [
  { key: "programmingLanguages", label: "Programming Languages", icon: Code2 },
  { key: "fundamentals", label: "Programming Fundamentals", icon: Cpu },
  { key: "frameworks", label: "Frameworks", icon: Layers },
  { key: "databases", label: "Databases", icon: Database },
  { key: "apiDesign", label: "API Design", icon: GitBranch },
  { key: "authentication", label: "Authentication & Authorization", icon: Shield },
  { key: "tools", label: "Tools & Technologies", icon: Wrench },
  { key: "designPatterns", label: "Design Patterns & Clean Code", icon: Cpu },
  { key: "frontend", label: "Front-End Systems", icon: Paintbrush },
  { key: "devops", label: "DevOps & Practices", icon: GitBranch },
];

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <section id="skills" className="section-container">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 gradient-text text-center">
        Technical Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {skillCategories.map(({ key, label, icon: Icon }) => {
          const skillList = skills[key as keyof SkillsType];
          if (!skillList || skillList.length === 0) return null;
          
          return (
            <div
              key={key}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-glow transition-all duration-500 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(skillList as string[]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground/90 hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
