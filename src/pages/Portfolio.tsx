import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { EducationAndLanguages } from "@/components/EducationAndLanguages";
import { ResumeData } from "@/types/resume";
import { initialResumeData } from "@/data/resumeData";
import { hexToHSL } from "@/lib/utils";

const Portfolio = () => {
  const { username: urlUsername } = useParams();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [font, setFont] = useState("inter");
  const [layout, setLayout] = useState("modern");
  const [animation, setAnimation] = useState("none");
  const [profileImage, setProfileImage] = useState<string>("");
  const [customLogo, setCustomLogo] = useState<string>("");
  const [colors, setColors] = useState({
    primary: "#9b87f5",
    accent: "#0EA5E9",
    background: "#1A1F2C",
  });
  const [sections, setSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    softSkills: true,
    projects: true,
    languages: true,
  });

  // Detect username from subdomain or URL parameter
  const getUsername = () => {
    const hostname = window.location.hostname;

    // Ignore Vercel preview URLs
    if (hostname.endsWith('.vercel.app')) {
      return urlUsername;
    }

    // Ignore IPs
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) {
      return urlUsername;
    }

    const parts = hostname.split('.');

    // Handle localhost subdomain
    if (hostname.includes('localhost') && parts.length === 2 && parts[0] !== 'localhost') {
      return parts[0];
    }

    // Handle Custom Domains
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

    return urlUsername;
  };

  const username = getUsername();

  // Update favicon when custom logo is available
  // Update favicon when custom logo is available
  useEffect(() => {
    if (customLogo) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = customLogo;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = customLogo;
        document.head.appendChild(newLink);
      }

      // Cleanup: Reset favicon when component unmounts
      return () => {
        if (link) {
          link.href = "/logo.svg";
        }
      };
    }
  }, [customLogo]);

  useEffect(() => {
    fetchPortfolioData();
  }, [username]);

  const fetchPortfolioData = async () => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      // Fetch public portfolio data
      const { data } = await api.get(`/portfolios/public/${username}`);

      if (data.portfolio) {
        if (data.portfolio.theme) {
          setColors({
            primary: data.portfolio.theme.primary || colors.primary,
            accent: data.portfolio.theme.accent || colors.accent,
            background: data.portfolio.theme.background || colors.background,
          });
          setAnimation(data.portfolio.theme.animation || 'none');
        }
        setSections(data.portfolio.sections);
        setFont(data.portfolio.font || 'inter');
        setLayout(data.portfolio.layout || 'modern');
        setProfileImage(data.portfolio.profileImage || '');
        setCustomLogo(data.portfolio.customLogo || '');
      }

      if (data.resume) {
        const resume = data.resume.data;
        const profile = data.user;

        setResumeData({
          ...resume,
          contact: {
            ...resume.contact,
            // Prioritize resume data, fallback to profile data only if missing
            name: resume.contact?.name || profile.fullName || username,
            title: resume.contact?.title || profile.title || "",
            location: resume.contact?.location || profile.location || "",
            phone: resume.contact?.phone || profile.phone || "",
            email: resume.contact?.email || profile.email || "",
            github: resume.contact?.github || profile.github || "",
            linkedin: resume.contact?.linkedin || profile.linkedin || "",
            website: resume.contact?.website || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The portfolio you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-${font} layout-${layout} animate-${animation}`}
      style={{
        '--primary': hexToHSL(colors.primary),
        '--accent': hexToHSL(colors.accent),
        '--background': hexToHSL(colors.background),
        '--primary-glow': hexToHSL(colors.primary),
      } as React.CSSProperties}
    >
      <Hero contact={resumeData.contact} profileImage={profileImage} />
      {sections.summary && <About summary={resumeData.summary} />}
      {sections.experience && <Experience experiences={resumeData.experience} />}
      {sections.skills && <Skills skills={resumeData.skills} />}
      {sections.projects && <Projects projects={resumeData.projects} />}
      {(sections.education || sections.languages) && (
        <EducationAndLanguages
          education={resumeData.education}
          languages={resumeData.languages}
          softSkills={resumeData.softSkills}
        />
      )}
    </div>
  );
};

export default Portfolio;
