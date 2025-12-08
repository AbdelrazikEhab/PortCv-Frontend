import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Education } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm = ({ education, onChange }: EducationFormProps) => {
  const addEducation = () => {
    onChange([
      ...education,
      {
        institution: "",
        degree: "",
        period: "",
        note: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    onChange(
      education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="p-4 border border-border rounded-lg space-y-4 bg-secondary/20">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Education Entry {index + 1}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEducation(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                placeholder="University or School"
              />
            </div>
            <div>
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                placeholder="Degree or Certificate"
              />
            </div>
          </div>

          <div>
            <Label>Period</Label>
            <Input
              value={edu.period}
              onChange={(e) => updateEducation(index, "period", e.target.value)}
              placeholder="e.g., June 2019 – June 2023"
            />
          </div>

          <div>
            <Label>Note (Optional)</Label>
            <Textarea
              value={edu.note || ""}
              onChange={(e) => updateEducation(index, "note", e.target.value)}
              rows={2}
              placeholder="e.g., Graduation Project: A+, GPA: 3.8"
            />
          </div>
        </div>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};
