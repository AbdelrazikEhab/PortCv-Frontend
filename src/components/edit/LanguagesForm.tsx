import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

type Language = { language: string; proficiency: string };

interface LanguagesFormProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export const LanguagesForm = ({ languages, onChange }: LanguagesFormProps) => {
  const addLanguage = () => {
    onChange([...languages, { language: "", proficiency: "" }]);
  };

  const removeLanguage = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    onChange(languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)));
  };

  return (
    <div className="space-y-4">
      {languages.map((lang, idx) => (
        <div key={idx} className="p-4 border border-border rounded-lg space-y-3 bg-secondary/20">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground">Language {idx + 1}</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLanguage(idx)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Language</Label>
              <Input
                value={lang.language}
                onChange={(e) => updateLanguage(idx, "language", e.target.value)}
                placeholder="e.g., English"
              />
            </div>
            <div>
              <Label>Proficiency</Label>
              <Input
                value={lang.proficiency}
                onChange={(e) => updateLanguage(idx, "proficiency", e.target.value)}
                placeholder="e.g., Native"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addLanguage} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Language
      </Button>
    </div>
  );
};
