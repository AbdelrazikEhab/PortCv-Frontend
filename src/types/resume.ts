export interface ContactInfo {
  name: string;
  title: string;
  location: string;
  phone: string[];
  email: string;
  github: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  responsibilities: string[];
  technologies: string;
}

export interface Education {
  institution: string;
  period: string;
  degree: string;
  note?: string;
}

export interface Project {
  name: string;
  url: string;
}

export interface Skills {
  programmingLanguages: string[];
  fundamentals: string[];
  frameworks: string[];
  databases: string[];
  apiDesign: string[];
  authentication: string[];
  tools: string[];
  designPatterns: string[];
  frontend: string[];
  devops: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  softSkills: string[];
  projects: Project[];
  languages: { language: string; proficiency: string }[];
}
