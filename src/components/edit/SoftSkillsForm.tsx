import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SoftSkillsFormProps {
  softSkills: string[];
  onChange: (softSkills: string[]) => void;
}

export const SoftSkillsForm = ({ softSkills, onChange }: SoftSkillsFormProps) => {
  return (
    <div>
      <Label>Soft Skills (comma separated)</Label>
      <Input
        value={softSkills.join(", ")}
        onChange={(e) =>
          onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
        }
        placeholder="e.g., Problem-Solving, Communication, Teamwork"
        className="mt-2"
      />
    </div>
  );
};
