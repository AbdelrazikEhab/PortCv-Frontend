import { ResumeData, Education } from "@/types/resume";
import { ColorScheme } from "@/types/template";

interface ClassicTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
}

// Helper to normalize education data - handles both array and single object
const normalizeEducation = (education: Education | Education[] | undefined): Education[] => {
  if (!education) return [];
  if (Array.isArray(education)) return education;
  return [education];
};

export const ClassicTemplate = ({ data, colorScheme }: ClassicTemplateProps) => {
  const educationList = normalizeEducation(data.education as Education | Education[]);

  return (
    <div className="bg-white p-8 rounded-lg space-y-4 text-sm text-black">
      {/* Header */}
      <div className="text-center pb-3">
        <h1 className="text-3xl font-bold text-black">
          {data.contact?.name || ""}
        </h1>
        <p className="text-base font-semibold mt-1 text-black">{data.contact?.title || ""}</p>
        <div className="text-xs mt-2 space-y-0.5 text-black">
          <p>{data.contact?.location || ""}</p>
          <p>{data.contact?.phone?.join(" | ") || ""}</p>
          <p>
            {data.contact?.email || ""} | {data.contact?.github || ""} | {data.contact?.linkedin || ""}
          </p>
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <p className="text-xs leading-relaxed text-justify text-black">{data.summary}</p>
      </div>

      {/* Professional Experience */}
      <div>
        <h2 className="text-sm font-bold uppercase mb-2 text-black">
          Professional Experience
        </h2>
        {data.experience?.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-sm">
                {exp.position}, {exp.company}
              </h3>
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

      {/* Education */}
      <div>
        <h2 className="text-sm font-bold uppercase mb-2 text-black">
          Education
        </h2>
        <div>
          {educationList.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-sm">{edu.institution || ""}</h3>
              <p className="text-xs">{edu.period || ""}</p>
              <p className="text-xs">{edu.degree || ""}</p>
              {edu.note && <p className="text-xs">{edu.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase mb-2 text-black">
            Soft Skills
          </h2>
          <p className="text-xs text-black">{data.softSkills?.join(", ") || ""}</p>
        </div>
      )}

      {/* Technical Skills */}
      <div>
        <h2 className="text-sm font-bold uppercase mb-2 text-black">
          Technical Skills
        </h2>
        <div className="space-y-1">
          {data.skills?.programmingLanguages && data.skills.programmingLanguages.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Programming Languages:</span>{" "}
              {data.skills.programmingLanguages.join(", ")}
            </p>
          )}
          {data.skills?.fundamentals && data.skills.fundamentals.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Programming Fundamentals:</span>{" "}
              {data.skills.fundamentals.join(", ")}
            </p>
          )}
          {data.skills?.frameworks && data.skills.frameworks.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Frameworks:</span> {data.skills.frameworks.join(", ")}
            </p>
          )}
          {data.skills?.databases && data.skills.databases.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Database:</span> {data.skills.databases.join(", ")}
            </p>
          )}
          {data.skills?.apiDesign && data.skills.apiDesign.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">API Design:</span> {data.skills.apiDesign.join(", ")}
            </p>
          )}
          {data.skills?.authentication && data.skills.authentication.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Authentication & Authorization:</span>{" "}
              {data.skills.authentication.join(", ")}
            </p>
          )}
          {data.skills?.tools && data.skills.tools.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Tools & Technologies:</span>{" "}
              {data.skills.tools.join(", ")}
            </p>
          )}
          {data.skills?.designPatterns && data.skills.designPatterns.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Design Patterns & Clean Code:</span>{" "}
              {data.skills.designPatterns.join(", ")}
            </p>
          )}
          {data.skills?.frontend && data.skills.frontend.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Front-End Systems:</span>{" "}
              {data.skills.frontend.join(", ")}
            </p>
          )}
          {data.skills?.devops && data.skills.devops.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">DevOps & Practices:</span>{" "}
              {data.skills.devops.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase mb-2 text-black">
            Projects
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            {data.projects.map((proj, idx) => (
              <li key={idx} className="text-xs">
                <span className="font-semibold">{proj.name}</span>
                {proj.url && <>: {proj.url}</>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase mb-2 text-black">
            Languages
          </h2>
          <ul className="list-disc ml-5 space-y-0.5">
            {data.languages.map((lang, idx) => (
              <li key={idx} className="text-xs">
                {lang.language}: {lang.proficiency}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
