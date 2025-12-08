import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactInfo } from "@/types/resume";

interface ContactFormProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
}

export const ContactForm = ({ contact, onChange }: ContactFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={contact?.name || ""}
          onChange={(e) => onChange({ ...contact, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Title</Label>
        <Input
          value={contact?.title || ""}
          onChange={(e) => onChange({ ...contact, title: e.target.value })}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={contact?.email || ""}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input
          value={contact?.location || ""}
          onChange={(e) => onChange({ ...contact, location: e.target.value })}
        />
      </div>

      <div>
        <Label>Phone Numbers (comma separated)</Label>
        <Input
          value={contact?.phone?.join(", ") || ""}
          onChange={(e) =>
            onChange({ ...contact, phone: e.target.value.split(",").map((p) => p.trim()).filter(p => p) })
          }
        />
      </div>

      <div>
        <Label>GitHub Username</Label>
        <Input
          value={contact?.github || ""}
          onChange={(e) => onChange({ ...contact, github: e.target.value })}
        />
      </div>

      <div>
        <Label>LinkedIn</Label>
        <Input
          value={contact?.linkedin || ""}
          onChange={(e) => onChange({ ...contact, linkedin: e.target.value })}
        />
      </div>
    </div>
  );
};
