import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
}

export const SummaryForm = ({ summary, onChange }: SummaryFormProps) => {
  return (
    <div>
      <Label>Professional Summary</Label>
      <Textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="mt-2"
      />
    </div>
  );
};
