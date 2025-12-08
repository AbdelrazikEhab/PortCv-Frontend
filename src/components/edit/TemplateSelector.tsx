import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { RESUME_TEMPLATES, TemplateType } from "@/types/template";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: TemplateType) => void;
}

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Template</h3>
      <div className="grid grid-cols-2 gap-4">
        {RESUME_TEMPLATES.slice(0, 3).map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id
                ? "ring-2 ring-primary border-primary"
                : "border-border"
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="p-4 space-y-3">
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2 p-4">
                  <div className="font-bold text-lg">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">{template.name}</span>
                <Badge variant="secondary" className="text-xs">
                  ATS {template.atsScore}%
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
