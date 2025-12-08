import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ResumeData } from "@/types/resume";
import { initialResumeData } from "@/data/resumeData";

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("resumeData");
    return saved ? JSON.parse(saved) : initialResumeData;
  });

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  const updateResumeData = (data: ResumeData) => {
    setResumeData(data);
  };

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
