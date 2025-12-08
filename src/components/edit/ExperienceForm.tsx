import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export const ExperienceForm = ({ experiences, onChange }: ExperienceFormProps) => {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        period: "",
        responsibilities: [""],
        technologies: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const addResponsibility = (id: string) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, responsibilities: [...exp.responsibilities, ""] } : exp
      )
    );
  };

  const updateResponsibility = (id: string, index: number, value: string) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((r, i) => (i === index ? value : r)),
            }
          : exp
      )
    );
  };

  const removeResponsibility = (id: string, index: number) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id
          ? { ...exp, responsibilities: exp.responsibilities.filter((_, i) => i !== index) }
          : exp
      )
    );
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="p-4 border border-border rounded-lg space-y-4 bg-secondary/20">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Experience Entry</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExperience(exp.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Position</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Period</Label>
            <Input
              value={exp.period}
              onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
              placeholder="e.g., March 2025–Present"
            />
          </div>

          <div>
            <Label>Technologies</Label>
            <Input
              value={exp.technologies}
              onChange={(e) => updateExperience(exp.id, "technologies", e.target.value)}
              placeholder="Comma separated"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Responsibilities</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addResponsibility(exp.id)}
                className="text-accent hover:text-accent"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {exp.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    value={resp}
                    onChange={(e) => updateResponsibility(exp.id, idx, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResponsibility(exp.id, idx)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};
