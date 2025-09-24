// Temporary portfolio data until Firebase integration is complete
export const profileData = {
  name: "James Nicholas",
  title: "Senior Frontend Engineer",
  summary: "Dynamic Frontend Engineer with 6+ years of experience specializing in React and modern front-end technologies. Proven in building reusable UI components and integrating with back-end services, enhancing deployment efficiency and reducing operational costs. Skilled in translating user requirements into efficient code while collaborating closely with designers to ensure a responsive user experience.",
  location: "Portland, OR",
  email: "james@01webdevelopment.com",
  phone: "503-810-7738",
  resumeUrl: "/resume.pdf",
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/wastrilith2k",
      icon: "github"
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/james-nicholas-1a81534/",
      icon: "linkedin"
    }
  ],
  skills: [
    // Programming Languages
    { name: "JavaScript", category: "Language", level: "Advanced" },
    { name: "TypeScript", category: "Language", level: "Advanced" },
    { name: "Python", category: "Language", level: "Advanced" },
    { name: "Java", category: "Language", level: "Intermediate" },
    { name: "PHP", category: "Language", level: "Intermediate" },

    // Frontend Development
    { name: "React", category: "Frontend", level: "Advanced" },
    { name: "Next.js", category: "Frontend", level: "Advanced" },
    { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
    { name: "CSS", category: "Frontend", level: "Advanced" },
    { name: "React Query", category: "Frontend", level: "Advanced" },

    // Backend & Databases
    { name: "Node.js", category: "Backend", level: "Advanced" },
    { name: "PostgreSQL", category: "Backend", level: "Intermediate" },
    { name: "MySQL", category: "Backend", level: "Intermediate" },
    { name: "REST APIs", category: "Backend", level: "Advanced" },
    { name: "GraphQL", category: "Backend", level: "Intermediate" },

    // DevOps & Tools
    { name: "Docker", category: "DevOps", level: "Advanced" },
    { name: "Git", category: "DevOps", level: "Advanced" },
    { name: "CI/CD", category: "DevOps", level: "Advanced" },
    { name: "Jenkins", category: "DevOps", level: "Intermediate" },
    { name: "Webpack", category: "DevOps", level: "Intermediate" },

    // Cloud & Architecture
    { name: "AWS", category: "Cloud", level: "Advanced" },
    { name: "Microsoft Azure", category: "Cloud", level: "Intermediate" },
    { name: "Firebase", category: "Cloud", level: "Advanced" },
    { name: "Microservices", category: "Architecture", level: "Advanced" }
  ]
}

export const projectsData = [
  {
    id: "1",
    title: "Solo Adventuring with AI",
    description: "AI-powered D&D Game Master application that helps players create and manage roleplaying game campaigns with intelligent storytelling.",
    technologies: ["React", "Firebase", "Google Gemini Pro", "Python", "TypeScript"],
    category: "web",
    status: "completed" as const,
    highlights: [
      "AI-driven storytelling and game management",
      "World and campaign creation tools",
      "Character management system",
      "Real-time chat with AI game master"
    ],
    links: {
      repository: "https://github.com/wastrilith2k/solo-adventuring-with-ai"
    }
  },
  {
    id: "2",
    title: "Solo Adventuring Mobile",
    description: "React Native mobile companion app for AI-powered D&D adventures with offline support and cross-platform compatibility.",
    technologies: ["React Native", "TypeScript", "Firebase", "Java"],
    category: "mobile",
    status: "ongoing" as const,
    highlights: [
      "Cross-platform mobile development",
      "Firebase integration for data sync",
      "TypeScript for type safety",
      "Android and iOS compatibility"
    ],
    links: {
      repository: "https://github.com/wastrilith2k/solo-adventuring-with-ai-mobile"
    }
  },
  {
    id: "3",
    title: "Conway's Game of Life",
    description: "Interactive web-based implementation of Conway's Game of Life cellular automaton with React and modern JavaScript.",
    technologies: ["React", "JavaScript", "Webpack", "HTML", "CSS"],
    category: "web",
    status: "completed" as const,
    highlights: [
      "Cellular automaton simulation",
      "Interactive web interface",
      "Webpack build optimization",
      "Mathematical algorithm visualization"
    ],
    links: {
      repository: "https://github.com/wastrilith2k/gameoflife"
    }
  }
]