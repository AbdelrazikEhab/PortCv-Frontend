import { ResumeData, Education } from "@/types/resume";
import { ColorScheme } from "@/types/template";

interface ModernTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
}

// Helper to normalize education data - handles both array and single object
const normalizeEducation = (education: Education | Education[] | undefined): Education[] => {
  if (!education) return [];
  if (Array.isArray(education)) return education;
  return [education];
};

export const ModernTemplate = ({ data, colorScheme }: ModernTemplateProps) => {
  const educationList = normalizeEducation(data.education as Education | Education[]);

  return (
    <div className="bg-white p-8 rounded-lg text-sm text-black">
      {/* Header with side accent */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-t-lg">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">
            {data.contact?.name || ""}
          </h1>
          <p className="text-xl mb-3">{data.contact?.title || ""}</p>
          <div className="text-sm space-y-1">
            <p>{data.contact?.location || ""}</p>
            <p>{data.contact?.phone?.join(" | ") || ""}</p>
            <p>
              {data.contact?.email || ""} | {data.contact?.github || ""} | {data.contact?.linkedin || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
        >
          Professional Summary
        </h2>
        <p className="text-xs leading-relaxed">{data.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
        >
          Experience
        </h2>
        {data.experience?.map((exp) => (
          <div key={exp.id} className="mb-3 pl-3 border-l-2 border-gray-300">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-sm text-black">
                {exp.position}
              </h3>
              <span className="text-xs text-gray-600">{exp.period}</span>
            </div>
            <p className="text-xs mb-1">{exp.company}</p>
            <ul className="list-disc ml-4 space-y-0.5">
              {exp.responsibilities?.map((resp, idx) => (
                <li key={idx} className="text-xs leading-relaxed">
                  {resp}
                </li>
              ))}
            </ul>
            {exp.technologies && (
              <p className="text-xs mt-1 italic">
                {exp.technologies}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Skills */}
          <div>
            <h2
              className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
            >
              Technical Skills
            </h2>
            <div className="space-y-1.5">
              {data.skills?.programmingLanguages && data.skills.programmingLanguages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-black">
                    Languages
                  </p>
                  <p className="text-xs">{data.skills.programmingLanguages.join(", ")}</p>
                </div>
              )}
              {data.skills?.frameworks && data.skills.frameworks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-black">
                    Frameworks
                  </p>
                  <p className="text-xs">{data.skills.frameworks.join(", ")}</p>
                </div>
              )}
              {data.skills?.databases && data.skills.databases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-black">
                    Databases
                  </p>
                  <p className="text-xs">{data.skills.databases.join(", ")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2
              className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
            >
              Education
            </h2>
            {educationList.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-xs">{edu.degree || ""}</h3>
                <p className="text-xs">{edu.institution || ""}</p>
                <p className="text-xs text-gray-600">{edu.period || ""}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
              >
                Projects
              </h2>
              <ul className="space-y-1">
                {data.projects.slice(0, 5).map((proj, idx) => (
                  <li key={idx} className="text-xs">
                    <span className="font-semibold">{proj.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase mb-2 tracking-wide text-black"
              >
                Languages
              </h2>
              {data.languages.map((lang, idx) => (
                <p key={idx} className="text-xs">
                  {lang.language}: {lang.proficiency}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
