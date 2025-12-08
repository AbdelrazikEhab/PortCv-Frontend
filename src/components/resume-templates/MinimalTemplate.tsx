import { ResumeData, Education } from "@/types/resume";
import { ColorScheme } from "@/types/template";

interface MinimalTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
}

// Helper to normalize education data - handles both array and single object
const normalizeEducation = (education: Education | Education[] | undefined): Education[] => {
  if (!education) return [];
  if (Array.isArray(education)) return education;
  return [education];
};

export const MinimalTemplate = ({ data, colorScheme }: MinimalTemplateProps) => {
  const educationList = normalizeEducation(data.education as Education | Education[]);

  return (
    <div className="bg-white p-8 rounded-lg text-sm text-black">
      {/* Header - Minimal */}
      <div className="mb-6">
        <h1 className="text-4xl font-light mb-1 text-black">
          {data.contact?.name || ""}
        </h1>
        <p className="text-base mb-3 text-black">{data.contact?.title || ""}</p>
        <div className="text-xs space-y-0.5 text-gray-600">
          <p>
            {data.contact?.email || ""} • {data.contact?.phone?.[0] || ""}
          </p>
          <p>
            {data.contact?.github || ""} • {data.contact?.linkedin || ""}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5">
        <p className="text-xs leading-relaxed">{data.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-black">
          Experience
        </h2>
        {data.experience?.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <div>
                <h3 className="font-semibold text-sm">{exp.position}</h3>
                <p className="text-xs text-gray-600">{exp.company}</p>
              </div>
              <span className="text-xs text-gray-500">{exp.period}</span>
            </div>
            <ul className="space-y-1 mt-2">
              {exp.responsibilities?.map((resp, idx) => (
                <li key={idx} className="text-xs leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills - Minimal Grid */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-black">
          Skills
        </h2>
        <div className="space-y-2">
          {data.skills?.programmingLanguages && data.skills.programmingLanguages.length > 0 && (
            <div className="flex">
              <span className="text-xs font-semibold w-24">Languages</span>
              <span className="text-xs flex-1">{data.skills.programmingLanguages.join(", ")}</span>
            </div>
          )}
          {data.skills?.frameworks && data.skills.frameworks.length > 0 && (
            <div className="flex">
              <span className="text-xs font-semibold w-24">Frameworks</span>
              <span className="text-xs flex-1">{data.skills.frameworks.join(", ")}</span>
            </div>
          )}
          {data.skills?.databases && data.skills.databases.length > 0 && (
            <div className="flex">
              <span className="text-xs font-semibold w-24">Databases</span>
              <span className="text-xs flex-1">{data.skills.databases.join(", ")}</span>
            </div>
          )}
          {data.skills?.tools && data.skills.tools.length > 0 && (
            <div className="flex">
              <span className="text-xs font-semibold w-24">Tools</span>
              <span className="text-xs flex-1">{data.skills.tools.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-black">
          Education
        </h2>
        {educationList.map((edu, index) => (
          <div key={index} className="flex justify-between mb-2">
            <div>
              <h3 className="font-semibold text-sm">{edu.degree || ""}</h3>
              <p className="text-xs text-gray-600">{edu.institution || ""}</p>
            </div>
            <span className="text-xs text-gray-500">{edu.period || ""}</span>
          </div>
        ))}
      </div>

      {/* Projects - Compact List */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-black">
            Projects
          </h2>
          <div className="space-y-1">
            {data.projects.slice(0, 5).map((proj, idx) => (
              <p key={idx} className="text-xs">
                {proj.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
