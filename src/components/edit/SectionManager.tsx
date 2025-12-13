import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SectionManagerProps {
  sections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    softSkills: boolean;
    projects: boolean;
    languages: boolean;
  };
  onToggleSection: (section: keyof SectionManagerProps['sections']) => void;
}

export const SectionManager = ({ sections, onToggleSection }: SectionManagerProps) => {
  const { t } = useTranslation();

  const sectionList = [
    { id: 'summary' as const, label: t('Section_Summary') || 'Professional Summary' },
    { id: 'experience' as const, label: t('Section_Experience') || 'Work Experience' },
    { id: 'education' as const, label: t('Section_Education') || 'Education' },
    { id: 'skills' as const, label: t('Section_Skills') || 'Technical Skills' },
    { id: 'softSkills' as const, label: t('Section_SoftSkills') || 'Soft Skills' },
    { id: 'projects' as const, label: t('Section_Projects') || 'Projects' },
    { id: 'languages' as const, label: t('Section_Languages') || 'Languages' },
  ];

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Eye className="w-5 h-5 text-primary" />
        {t('Manage_Sections') || 'Manage Sections'}
      </h3>
      <p className="text-sm text-muted-foreground">{t('Manage_Sections_Desc') || 'Toggle sections to show/hide them in your resume'}</p>
      <div className="space-y-3 pt-2">
        {sectionList.map((section) => (
          <div key={section.id} className="flex items-center justify-between">
            <Label htmlFor={section.id} className="cursor-pointer flex-1">
              {section.label}
            </Label>
            <Switch
              id={section.id}
              checked={sections[section.id]}
              onCheckedChange={() => onToggleSection(section.id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
