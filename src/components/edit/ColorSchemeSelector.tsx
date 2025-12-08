import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { COLOR_SCHEMES } from "@/types/template";

interface ColorSchemeSelectorProps {
  selectedColorScheme: string;
  onSelectColorScheme: (scheme: string) => void;
}

export const ColorSchemeSelector = ({ selectedColorScheme, onSelectColorScheme }: ColorSchemeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Color Scheme</h3>
      <div className="grid grid-cols-2 gap-3">
        {COLOR_SCHEMES.map((scheme) => (
          <Card
            key={scheme.id}
            className={`relative cursor-pointer transition-all hover:shadow-md ${
              selectedColorScheme === scheme.id
                ? "ring-2 ring-primary border-primary"
                : "border-border"
            }`}
            onClick={() => onSelectColorScheme(scheme.id)}
          >
            <div className="p-3 space-y-2">
              {selectedColorScheme === scheme.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: scheme.secondary }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{scheme.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {scheme.atsScore}%
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
