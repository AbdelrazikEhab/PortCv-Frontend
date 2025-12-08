import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";

interface PortfolioColorPickerProps {
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  onColorChange: (colorKey: keyof PortfolioColorPickerProps['colors'], value: string) => void;
}

export const PortfolioColorPicker = ({ colors, onColorChange }: PortfolioColorPickerProps) => {
  const colorOptions = [
    { id: 'primary' as const, label: 'Primary Color', description: 'Main brand color' },
    { id: 'accent' as const, label: 'Accent Color', description: 'Secondary highlights' },
    { id: 'background' as const, label: 'Background', description: 'Base background color' },
  ];

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Portfolio Colors</h3>
      </div>
      <p className="text-sm text-muted-foreground">Customize your portfolio's color scheme</p>
      
      <div className="space-y-4 pt-2">
        {colorOptions.map((option) => (
          <div key={option.id} className="space-y-2">
            <Label htmlFor={option.id}>{option.label}</Label>
            <p className="text-xs text-muted-foreground">{option.description}</p>
            <div className="flex gap-3 items-center">
              <Input
                id={option.id}
                type="color"
                value={colors[option.id]}
                onChange={(e) => onColorChange(option.id, e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={colors[option.id]}
                onChange={(e) => onColorChange(option.id, e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
