import { ResumeData } from "./resume";
import { TemplateType } from "./template";

export interface ResumeItem {
  id: string;
  name: string;
  template: TemplateType;
  colorScheme: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}
