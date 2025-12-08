import { ResumeData, Education } from "@/types/resume";
import { ColorScheme } from "@/types/template";

interface ProfessionalTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
}

// Helper to normalize education data - handles both array and single object
const normalizeEducation = (education: Education | Education[] | undefined): Education[] => {
  if (!education) return [];
  if (Array.isArray(education)) return education;
  return [education];
};

export const ProfessionalTemplate = ({ data, colorScheme }: ProfessionalTemplateProps) => {
  const educationList = normalizeEducation(data.education as Education | Education[]);

  return (
    <div className="bg-white p-8 rounded-lg text-sm text-black">
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-1 text-black">
          {data.contact?.name || ""}
        </h1>
        <p className="text-base font-semibold mb-2 text-black">
          {data.contact?.title || ""}
        </p>
        <div className="text-xs flex justify-center flex-wrap gap-x-3">
          <span>{data.contact?.location || ""}</span>
          <span>•</span>
          <span>{data.contact?.email || ""}</span>
          <span>•</span>
          <span>{data.contact?.phone?.[0] || ""}</span>
        </div>
        <div className="text-xs flex justify-center flex-wrap gap-x-3 mt-1">
          <span>{data.contact?.github || ""}</span>
          <span>•</span>
          <span>{data.contact?.linkedin || ""}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 pb-1 border-b border-gray-300 text-black"
        >
          Executive Summary
        </h2>
        <p className="text-xs leading-relaxed text-justify">{data.summary}</p>
      </div>

      {/* Professional Experience */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 pb-1 border-b border-gray-300 text-black"
        >
          Professional Experience
        </h2>
        {data.experience?.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <h3 className="font-bold text-sm">{exp.position}</h3>
                <p className="text-xs text-gray-600">
                  {exp.company}
                </p>
              </div>
              <span className="text-xs">{exp.period}</span>
            </div>
            <ul className="list-disc ml-5 space-y-0.5">
              {exp.responsibilities?.map((resp, idx) => (
                <li key={idx} className="text-xs leading-relaxed">
                  {resp}
                </li>
              ))}
            </ul>
            {exp.technologies && (
              <p className="text-xs mt-1">
                <span className="font-semibold">Technologies:</span> {exp.technologies}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Core Competencies */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 pb-1 border-b border-gray-300 text-black"
        >
          Core Competencies
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {data.skills?.programmingLanguages && data.skills.programmingLanguages.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Languages:</span>{" "}
              {data.skills.programmingLanguages.join(", ")}
            </p>
          )}
          {data.skills?.frameworks && data.skills.frameworks.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Frameworks:</span> {data.skills.frameworks.join(", ")}
            </p>
          )}
          {data.skills?.databases && data.skills.databases.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Databases:</span> {data.skills.databases.join(", ")}
            </p>
          )}
          {data.skills?.tools && data.skills.tools.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Tools:</span> {data.skills.tools.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 pb-1 border-b border-gray-300 text-black"
        >
          Education
        </h2>
        {educationList.map((edu, index) => (
          <div key={index} className="flex justify-between mb-2">
            <div>
              <h3 className="font-bold text-xs">{edu.degree || ""}</h3>
              <p className="text-xs">{edu.institution || ""}</p>
              {edu.note && <p className="text-xs italic">{edu.note}</p>}
            </div>
            <span className="text-xs">{edu.period || ""}</span>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-2 gap-4">
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2
              className="text-sm font-bold uppercase mb-1 text-black"
            >
              Key Projects
            </h2>
            <ul className="list-disc ml-4 space-y-0.5">
              {data.projects.slice(0, 4).map((proj, idx) => (
                <li key={idx} className="text-xs">
                  {proj.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div>
            <h2
              className="text-sm font-bold uppercase mb-1 text-black"
            >
              Languages
            </h2>
            {data.languages.map((lang, idx) => (
              <p key={idx} className="text-xs">
                {lang.language} - {lang.proficiency}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
