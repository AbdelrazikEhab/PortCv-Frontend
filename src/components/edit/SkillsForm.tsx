import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skills } from "@/types/resume";

interface SkillsFormProps {
  skills: Skills;
  onChange: (skills: Skills) => void;
}

export const SkillsForm = ({ skills, onChange }: SkillsFormProps) => {
  const updateSkillCategory = (category: keyof Skills, value: string) => {
    onChange({
      ...skills,
      [category]: value.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Programming Languages</Label>
        <Input
          value={skills.programmingLanguages?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("programmingLanguages", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Programming Fundamentals</Label>
        <Input
          value={skills.fundamentals?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("fundamentals", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Frameworks</Label>
        <Input
          value={skills.frameworks?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("frameworks", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Databases</Label>
        <Input
          value={skills.databases?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("databases", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>API Design</Label>
        <Input
          value={skills.apiDesign?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("apiDesign", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Authentication & Authorization</Label>
        <Input
          value={skills.authentication?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("authentication", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Tools & Technologies</Label>
        <Input
          value={skills.tools?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("tools", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Design Patterns & Clean Code</Label>
        <Input
          value={skills.designPatterns?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("designPatterns", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>Front-End Systems</Label>
        <Input
          value={skills.frontend?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("frontend", e.target.value)}
          placeholder="Comma separated"
        />
      </div>

      <div>
        <Label>DevOps & Practices</Label>
        <Input
          value={skills.devops?.join(", ") || ""}
          onChange={(e) => updateSkillCategory("devops", e.target.value)}
          placeholder="Comma separated"
        />
      </div>
    </div>
  );
};
