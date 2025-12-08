import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectsForm = ({ projects, onChange }: ProjectsFormProps) => {
  const addProject = () => {
    onChange([...projects, { name: "", url: "" }]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    onChange(projects.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)));
  };

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => (
        <div key={idx} className="p-4 border border-border rounded-lg space-y-3 bg-secondary/20">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground">Project {idx + 1}</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProject(idx)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <Label>Project Name</Label>
            <Input
              value={project.name}
              onChange={(e) => updateProject(idx, "name", e.target.value)}
            />
          </div>

          <div>
            <Label>GitHub URL</Label>
            <Input
              value={project.url}
              onChange={(e) => updateProject(idx, "url", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      ))}

      <Button onClick={addProject} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
};
