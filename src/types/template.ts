export type TemplateType = "classic" | "modern" | "professional" | "minimal";

export interface ResumeTemplate {
  id: TemplateType;
  name: string;
  description: string;
  atsScore: number;
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
  background: string;
  atsScore: number;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format, highly ATS-compatible",
    atsScore: 98,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    atsScore: 95,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Business-focused layout",
    atsScore: 97,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    atsScore: 96,
  },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "traditional",
    name: "Traditional Black",
    primary: "#000000",
    secondary: "#333333",
    text: "#000000",
    background: "#ffffff",
    atsScore: 100,
  },
  {
    id: "professional-blue",
    name: "Professional Blue",
    primary: "#1a365d",
    secondary: "#2c5282",
    text: "#000000",
    background: "#ffffff",
    atsScore: 98,
  },
  {
    id: "navy",
    name: "Navy",
    primary: "#0f172a",
    secondary: "#334155",
    text: "#000000",
    background: "#ffffff",
    atsScore: 97,
  },
  {
    id: "charcoal",
    name: "Charcoal Gray",
    primary: "#1f2937",
    secondary: "#4b5563",
    text: "#000000",
    background: "#ffffff",
    atsScore: 99,
  },
];
