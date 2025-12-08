import { ResumeData } from "@/types/resume";

export const initialResumeData: ResumeData = {
  contact: {
    name: "Abdelrazik Ehab",
    title: "Full-Stack Developer",
    location: "Golden Gates, Mokattam, Cairo, Egypt",
    phone: ["+20 1156827483", "+20 1551893709"],
    email: "abdelrazikehab7@gmail.com",
    github: "AbdelrazikEhab",
    linkedin: "www.linkedin.com/in/abdelrazik-ehab-b5b678240",
  },
  summary:
    "Results-driven Computer Science graduate with two years of experience in web as full-stack development, specializing in Node.js, NestJS, Express.js, and MongoDB. Proven ability to design and implement scalable, high-performance applications. Successfully developed and optimized RESTful APIs for product management, user authentication, and payment processing, ensuring seamless communication across systems. Resolved over 20 critical integration issues, significantly enhancing system stability. Skilled in debugging, software development, deployment, and monitoring to deliver robust and efficient solutions. Strong collaborator with a track record of working effectively with stakeholders to deliver technical documentation and best practices. Adept at solving complex issues and delivering innovative solutions in Information Technology.",
  experience: [
    {
      id: "1",
      company: "SmartUp",
      position: "Full-Stack Developer",
      period: "March 2025–Present",
      responsibilities: [
        "Developed and maintained RESTful APIs using Node.js (Express/NestJS) to support frontend applications and third-party integrations.",
        "Designed, optimized, Coding, and managed SQL databases (Microsoft SQL Server, MySQL, & Supabase), writing complex queries, stored procedures, and ensuring data integrity.",
        "Integrated Supabase for real-time database functionality, authentication, and scalable backend solutions.",
        "Collaborated with frontend developers to ensure seamless API consumption and efficient data flow.",
        "Improved backend performance by optimizing database queries, indexing strategies, and implementing caching mechanisms.",
        "Assisted in CI/CD pipeline setup for automated testing and deployment using GitHub Actions/Docker.",
        "Troubleshot and debugged backend issues, ensuring high availability and minimal downtime.",
        "Followed Agile/Scrum methodologies, participating in sprint planning, code reviews, and daily stand-ups.",
      ],
      technologies:
        "Node.js, Express.js, SQL Server, MySQL, Supabase, REST APIs, Git, Docker, PostgreSQL, JWT, React, Vit, Prisma",
    },
  ],
  education: [
    {
      institution: "Modern Academy",
      period: "June 2019 – June 2023",
      degree: "Bachelor of Computer Science",
      note: "Graduation Project: A+",
    },
  ],
  skills: {
    programmingLanguages: ["JavaScript (ES6+)", "Python", "C++", "JAVA", "C# (.NET)"],
    fundamentals: ["Object-Oriented Programming (OOP)", "Data Structures & Algorithms"],
    frameworks: ["Node.js", "NestJS", "Express.js", ".NET"],
    databases: ["SQL (MySQL, PostgreSQL, Microsoft SQL Server)", "NoSQL (MongoDB, Redis)", "Supabase"],
    apiDesign: ["RESTful API", "GraphQL", "WebSockets", "Prisma", "TypeORM"],
    authentication: ["JWT"],
    tools: ["Version Control (Git, GitHub)", "Docker"],
    designPatterns: ["SOLID Principles", "MVC Architecture"],
    frontend: ["HTML", "CSS", "jQuery", "XML", "React", "Redux"],
    devops: [
      "CI/CD",
      "Automated Testing",
      "Debugging",
      "Deployment",
      "Monitoring",
      "Technical Documentation",
      "Code Reviews",
    ],
  },
  softSkills: [
    "Problem-Solving",
    "Communication Skills",
    "Collaboration",
    "Self-Learning",
    "Teamwork",
    "Creativity",
    "Decision-Making",
    "Flexibility",
    "Stress Management",
    "Scalability",
    "Analytical Skills",
    "Business Strategies",
  ],
  projects: [
    {
      name: "E-Learning Platform - Graduation Project",
      url: "https://github.com/hassanelferga/go_code.git",
    },
    {
      name: "Real-Time Chat Application",
      url: "https://github.com/AbdelrazikEhab/Chat-App.git",
    },
    {
      name: "E-Commerce Website",
      url: "https://github.com/AbdelrazikEhab/ECommerce.git",
    },
    {
      name: "Shopping App",
      url: "https://github.com/muhammedabdelkreim/shopping-app.git",
    },
    {
      name: "TodoList App",
      url: "https://github.com/AbdelrazikEhab/Todo-App.git",
    },
    {
      name: "Blog API",
      url: "https://github.com/AbdelrazikEhab/Blog-Api.git",
    },
    {
      name: "IOT",
      url: "https://github.com/Omar-shaqra/IOT-platform.git",
    },
  ],
  languages: [
    { language: "Arabic", proficiency: "Native" },
    { language: "English", proficiency: "Professional Working Proficiency" },
  ],
};
