// Comprehensive context data for AI chatbot about James Nicholas
export const chatbotContext = {
  personal: {
    name: "James Nicholas",
    title: "Senior Frontend Engineer",
    location: "Portland, Oregon",
    phone: "503-810-7738",
    email: "james@01webdevelopment.com",
    experience: "6+ years specialized in React and modern frontend technologies, 15+ years total professional experience"
  },

  currentRole: {
    company: "Cavallo",
    position: "Senior Frontend Engineer",
    duration: "Sep 2022 - Present",
    location: "Remote",
    responsibilities: [
      "Collaborated with designers to optimize UI/UX for Analytics Cloud product using React/Redux",
      "Launched sophisticated analytics solution utilizing Zustand state management and Statsig",
      "Developed reusable micro-frontend architecture using GitHub Actions and AWS",
      "Integrated backend APIs in Python with comprehensive monitoring solutions using Grafana",
      "Streamlined development workflows with NodeJS, JavaScript, TypeScript, Docker, Git, CI/CD"
    ]
  },

  workExperience: [
    {
      company: "Cavallo",
      position: "Senior Frontend Engineer",
      duration: "Sep 2022 - Present",
      key_achievements: ["Micro-frontend architecture", "Analytics Cloud optimization", "Deployment efficiency improvements"]
    },
    {
      company: "Oracle America, Inc.",
      position: "Scrum Master",
      duration: "May 2022 - Aug 2022",
      key_achievements: ["Enhanced operational agility", "Strategic product roadmaps", "Cross-functional team collaboration"]
    },
    {
      company: "Oracle America, Inc.",
      position: "Tech Lead",
      duration: "Nov 2021 - May 2022",
      key_achievements: ["Microservice REST APIs development", "Test-Driven Development integration", "CI/CD automation"]
    },
    {
      company: "Oracle America, Inc.",
      position: "Software Engineer",
      duration: "May 2017 - Aug 2022",
      key_achievements: ["React applications maintenance", "Cross-platform development", "Docker and Redis support"]
    },
    {
      company: "Webtrends, Inc.",
      position: "Lead Technical Support Engineer",
      duration: "May 2012 - Mar 2017",
      key_achievements: ["SharePoint certifications", "Custom coding solutions", "Office 365 deployment"]
    },
    {
      company: "01 Web Development",
      position: "Owner/Developer",
      duration: "May 2008 - Mar 2017",
      key_achievements: ["Web applications architecture", "Drupal CMS solutions", "Data science methodologies"]
    }
  ],

  technicalSkills: {
    languages: ["JavaScript (Advanced)", "TypeScript (Advanced)", "Python (Advanced)", "Java (Intermediate)", "PHP (Intermediate)"],
    frontend: ["React (Advanced)", "Next.js (Advanced)", "Tailwind CSS (Advanced)", "CSS (Advanced)", "React Query (Advanced)"],
    backend: ["Node.js (Advanced)", "PostgreSQL (Intermediate)", "MySQL (Intermediate)", "REST APIs (Advanced)", "GraphQL (Intermediate)"],
    devops: ["Docker (Advanced)", "Git (Advanced)", "CI/CD (Advanced)", "Jenkins (Intermediate)", "Webpack (Intermediate)"],
    cloud: ["AWS (Advanced)", "Microsoft Azure (Intermediate)", "Firebase (Advanced)", "Oracle Cloud Infrastructure"],
    architecture: ["Microservices (Advanced)", "Service Oriented Architecture", "Software Architecture"]
  },

  projects: [
    {
      name: "Solo Adventuring with AI",
      description: "AI-powered D&D Game Master application using React, Firebase, and Google Gemini Pro for intelligent storytelling and campaign management",
      technologies: ["React", "Firebase", "Google Gemini Pro", "Python", "TypeScript"],
      highlights: ["AI-driven storytelling", "Real-time chat with AI", "Campaign creation tools"]
    },
    {
      name: "Solo Adventuring Mobile",
      description: "React Native mobile companion app for AI-powered D&D adventures with cross-platform compatibility",
      technologies: ["React Native", "TypeScript", "Firebase", "Java"],
      highlights: ["Cross-platform development", "Firebase integration", "Mobile optimization"]
    },
    {
      name: "Conway's Game of Life",
      description: "Interactive web-based cellular automaton simulation with modern JavaScript and React",
      technologies: ["React", "JavaScript", "Webpack", "HTML", "CSS"],
      highlights: ["Mathematical visualization", "Interactive interface", "Algorithm implementation"]
    }
  ],

  education: {
    degree: "Associates of Applied Science",
    field: "Computer Information Systems",
    school: "Portland Community College",
    duration: "Jan 2004 - Jan 2007",
    additional: ["E-commerce Certificate in Design, Development, and Administration"]
  },

  certifications: [
    "Microsoft Certified Professional (MCPS)",
    "MS: Programming in HTML5 with JavaScript and CSS3",
    "MCTS: SharePoint 2010 Configuration",
    "MCSD: SharePoint Applications"
  ],

  interests: [
    "AI-driven projects and applications",
    "Natural Language Processing",
    "Game development and interactive storytelling",
    "Open source contributions",
    "Mentoring and technical leadership"
  ],

  volunteerWork: [
    {
      organization: "Oregon Humane Society",
      duration: "2013-2016",
      role: "Animal Welfare program volunteer"
    }
  ],

  professionalApproach: {
    strengths: ["Technical expertise", "Problem-solving", "Team collaboration", "Innovation", "Mentoring"],
    specialties: ["Frontend architecture", "React ecosystem", "CI/CD implementation", "User experience optimization"],
    philosophy: "Focused on translating user requirements into efficient code while collaborating closely with designers to ensure responsive user experiences"
  }
}

// Helper function to get context for specific topics
export const getContextForTopic = (topic: string): string => {
  const lowerTopic = topic.toLowerCase()

  if (lowerTopic.includes('experience') || lowerTopic.includes('work') || lowerTopic.includes('career')) {
    return `James has ${chatbotContext.personal.experience} and is currently a ${chatbotContext.currentRole.position} at ${chatbotContext.currentRole.company}. His career includes roles at major companies like Oracle and Webtrends, plus running his own web development business.`
  }

  if (lowerTopic.includes('skill') || lowerTopic.includes('technology') || lowerTopic.includes('tech')) {
    return `James specializes in React, TypeScript, and modern frontend technologies. He's advanced in JavaScript, Python, Node.js, AWS, and has extensive experience with CI/CD, Docker, and microservices architecture.`
  }

  if (lowerTopic.includes('project') || lowerTopic.includes('portfolio')) {
    return `James has built several notable projects including an AI-powered D&D Game Master application, a React Native mobile app, and various web applications. His GitHub (wastrilith2k) showcases his React expertise.`
  }

  if (lowerTopic.includes('education') || lowerTopic.includes('learning')) {
    return `James has an Associates of Applied Science in Computer Information Systems from Portland Community College, plus Microsoft certifications in SharePoint and web technologies.`
  }

  if (lowerTopic.includes('contact') || lowerTopic.includes('hire') || lowerTopic.includes('available')) {
    return `James is based in Portland, OR and can be reached at james@01webdevelopment.com or 503-810-7738. His LinkedIn profile is linkedin.com/in/james-nicholas-1a81534/.`
  }

  return `James Nicholas is a Senior Frontend Engineer with 6+ years specialized React experience, currently at Cavallo. He's passionate about building scalable, user-friendly applications and has extensive experience with modern web technologies.`
}