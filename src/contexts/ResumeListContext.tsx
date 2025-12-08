import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ResumeItem } from "@/types/resume-item";
import { initialResumeData } from "@/data/resumeData";

interface ResumeListContextType {
  resumes: ResumeItem[];
  currentResumeId: string | null;
  addResume: (name: string) => string;
  deleteResume: (id: string) => void;
  updateResume: (id: string, resume: Partial<ResumeItem>) => void;
  setCurrentResume: (id: string) => void;
  getCurrentResume: () => ResumeItem | null;
}

const ResumeListContext = createContext<ResumeListContextType | undefined>(undefined);

export const ResumeListProvider = ({ children }: { children: ReactNode }) => {
  const [resumes, setResumes] = useState<ResumeItem[]>(() => {
    const saved = localStorage.getItem("resumeList");
    if (saved) {
      return JSON.parse(saved);
    }
    // Create default resume
    const defaultResume: ResumeItem = {
      id: "default",
      name: "My Resume",
      template: "classic",
      colorScheme: "traditional",
      data: initialResumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return [defaultResume];
  });

  const [currentResumeId, setCurrentResumeId] = useState<string | null>(() => {
    const saved = localStorage.getItem("currentResumeId");
    return saved || "default";
  });

  useEffect(() => {
    localStorage.setItem("resumeList", JSON.stringify(resumes));
  }, [resumes]);

  useEffect(() => {
    if (currentResumeId) {
      localStorage.setItem("currentResumeId", currentResumeId);
    }
  }, [currentResumeId]);

  const addResume = (name: string): string => {
    const newResume: ResumeItem = {
      id: Date.now().toString(),
      name,
      template: "classic",
      colorScheme: "traditional",
      data: initialResumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResumes([...resumes, newResume]);
    return newResume.id;
  };

  const deleteResume = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id));
    if (currentResumeId === id) {
      setCurrentResumeId(resumes[0]?.id || null);
    }
  };

  const updateResume = (id: string, updates: Partial<ResumeItem>) => {
    setResumes(
      resumes.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      )
    );
  };

  const setCurrentResume = (id: string) => {
    setCurrentResumeId(id);
  };

  const getCurrentResume = (): ResumeItem | null => {
    return resumes.find((r) => r.id === currentResumeId) || null;
  };

  return (
    <ResumeListContext.Provider
      value={{
        resumes,
        currentResumeId,
        addResume,
        deleteResume,
        updateResume,
        setCurrentResume,
        getCurrentResume,
      }}
    >
      {children}
    </ResumeListContext.Provider>
  );
};

export const useResumeList = () => {
  const context = useContext(ResumeListContext);
  if (context === undefined) {
    throw new Error("useResumeList must be used within a ResumeListProvider");
  }
  return context;
};
