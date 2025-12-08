import { Project } from "@/types/resume";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsProps {
  projects: Project[];
}

export const Projects = ({ projects }: ProjectsProps) => {
  return (
    <section id="projects" className="section-container">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 gradient-text text-center">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-glow transition-all duration-500 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:text-accent"
              >
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};
