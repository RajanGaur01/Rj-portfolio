export const portfolioData = {
  personal: {
    name: "RAJAN GAUR",
    initials: "RG",
    role: "BCA Student | Full Stack Developer | Flutter Developer | Cloud Computing Learner | Product Builder",
    shortRole: "Full Stack & Flutter Developer • Product Builder",
    status: "Open to Collaborations & Internships",
    location: "India • Global Remote",
    tagline: "Action over theory. Building real-world software products, full-stack architectures, Flutter mobile apps, and cloud-integrated AI workflows.",
    email: "rajangaur.dev@gmail.com",
    bio: "I am a Bachelor of Computer Applications (BCA) student passionate about building software products that solve real-world problems. I prefer building actual applications, experimenting with ideas, solving practical challenges, and turning concepts into usable products rather than learning isolated technologies.",
    socials: [
      { name: "GitHub", url: "https://github.com/RajanGaur01", handle: "github.com/RajanGaur01" },
      { name: "LinkedIn", url: "https://linkedin.com", handle: "linkedin.com/in/rajan-gaur" },
      { name: "Twitter / X", url: "https://x.com", handle: "@rajan_gaur" },
      { name: "Email", url: "mailto:rajangaur.dev@gmail.com", handle: "rajangaur.dev@gmail.com" }
    ]
  },

  hero: {
    initial: {
      left: {
        tag: "Vision & Architecture",
        heading: "TURNING IDEAS INTO REAL PRODUCTS",
        description: "BCA Student, Full-Stack Developer, and Flutter Builder dedicated to creating complete, production-grade applications that solve practical real-world problems."
      },
      right: {
        tag: "Execution & Reality",
        heading: "SYSTEMS OF COMPLETE VALUE",
        description: "Focusing on full architectures: authentication, cloud databases, business workflows, AI integration, and polished user experiences."
      }
    },

    left: {
      tag: "Vision & Architecture",
      heading: "TURNING IDEAS INTO REAL PRODUCTS",
      description: "BCA Student, Full-Stack Developer, and Flutter Builder dedicated to creating complete, production-grade applications that solve practical real-world problems."
    },
    right: {
      tag: "Execution & Reality",
      heading: "SYSTEMS OF COMPLETE VALUE",
      description: "Focusing on full architectures: authentication, cloud databases, business workflows, AI integration, and polished user experiences."
    },

    chapters: [
      {
        id: "who-am-i",
        step: "Identity & Philosophy",
        left: {
          tag: "IDENTITY & ORIGIN",
          heading: "ACTION-DRIVEN PRODUCT BUILDER",
          description: "I am Rajan Gaur. While many focus solely on collecting certificates, I dedicate my energy to engineering full-scale applications with authentication, real databases, and business logic."
        },
        right: {
          tag: "ETHOS & PHILOSOPHY",
          heading: "SOLVING REAL PRACTICAL PROBLEMS",
          description: "Valuing logic, accuracy, and direct feedback. I believe the only true way to master technology is by building applications that people can actively use."
        }
      },
      {
        id: "what-i-can-do",
        step: "Capabilities & Engineering",
        left: {
          tag: "FULL STACK & MOBILE",
          heading: "REACT, TYPESCRIPT & FLUTTER APPS",
          description: "Crafting modern web interfaces with React, TypeScript & Tailwind, combined with cross-platform Android mobile applications using Flutter and GPS tracking."
        },
        right: {
          tag: "CLOUD & AI INTEGRATION",
          heading: "FIREBASE, AWS & GEMINI AI",
          description: "Architecting cloud infrastructure, Firebase authentication workflows, and integrating Gemini API for automated content verification and smart systems."
        }
      },
      {
        id: "what-i-work-on",
        step: "Selected Innovations",
        left: {
          tag: "FLAGSHIP INVENTIONS",
          heading: "RESQ MEAL, EV PLATFORM & TRACKER",
          description: "Engineered ResQ Meal for food waste redistribution, EV Platform with AI approval pipelines, and a complete Flutter Employee Tracking system."
        },
        right: {
          tag: "GROWTH TRAJECTORY",
          heading: "SCALING TOWARD SYSTEM DESIGN & AWS",
          description: "Actively mastering AWS cloud architecture through AWS Academy and building scalable products ready for real users."
        }
      }
    ],

    finale: {
      intro: "Hey, this is",
      name: "Rajan Gaur",
      action: "lets dive together",
      tagline: "BCA Student | Full Stack & Flutter Developer | Cloud & AI Product Builder"
    },

    metrics: [
      { label: "Core Competencies", value: "Full Stack + Flutter" },
      { label: "Cloud Ecosystem", value: "AWS & Firebase" },
      { label: "AI Integration", value: "Gemini API" },
      { label: "Product Focus", value: "Real-World Impact" }
    ],
    scrollHint: "Scroll to explore"
  },

  projects: [
    {
      id: "resq-meal",
      badge: "FLAGSHIP SOCIAL PRODUCT",
      title: "RESQ MEAL",
      subtitle: "Food Waste Reduction & Logistics Platform",
      tagline: "Food Waste Reduction & Redistribution Network",
      category: "Full Stack Platform / Social Impact",
      year: "2025",
      architecture: "React.js • Tailwind CSS • Firebase Auth & Firestore • Cloudinary CDN",
      description: "A comprehensive dual-sided platform connecting food businesses, event organizers, and households with NGOs and shelters to redistribute surplus edible food and eliminate community waste.",
      problem: "Massive amounts of edible food are wasted daily from events and commercial food centers while local shelters face constant resource scarcity due to fragmented logistics.",
      solution: "Engineered an instantaneous matching and pickup workflow with verification, real-time availability tracking, and automated donation receipts.",
      features: [
        "Hyper-local donor-to-NGO matching based on real-time distance and food expiry windows.",
        "Role-based dual dashboards for Donors (listing & history) and NGOs (claim & dispatch).",
        "Automated impact analytics calculating total kilograms of food saved and meals served.",
        "Firebase Firestore real-time listener updates for instantaneous claim notifications."
      ],
      impact: "Eliminates local food waste with structured logistics and transparent NGO tracking.",
      tech: ["React.js", "Firebase", "Firestore", "Tailwind CSS", "Cloudinary", "Vite"],
      image: "/projects/resq-meal.jpg",
      liveUrl: "https://github.com/rajangaur/resq-meal",
      githubUrl: "https://github.com/rajangaur/resq-meal",
      featured: true
    },
    {
      id: "ev-educational-platform",
      badge: "AI-POWERED PLATFORM",
      title: "EV - EXAM VAULT",
      subtitle: "AI-Powered Exam Preparation & Question Vault",
      tagline: "AI-Assisted Exam Preparation & Knowledge Vault",
      category: "Full Stack Web & AI Workflow",
      year: "2024",
      architecture: "React.js • Google Gemini API • Firebase Firestore • Cloudinary",
      description: "An AI-powered academic exam preparation platform and question vault that leverages the Google Gemini API to analyze, review, and evaluate exam practice modules.",
      problem: "Students and educators struggle with unstructured exam archives, manual question validation, and lack of real-time AI feedback.",
      solution: "Integrated an automated AI assessment pipeline with Gemini API for dynamic question generation, solution validation, and mock exam grading.",
      features: [
        "Google Gemini API integration for automated question validation and solution hints.",
        "Tiered user workflows: Students, Educators, and Content Reviewers.",
        "Cloudinary CDN integration for high-clarity diagrams, formulas, and mock papers.",
        "Interactive exam timers and performance analytics dashboard."
      ],
      impact: "Accelerates study preparation with instant AI evaluation and comprehensive question archives.",
      tech: ["React.js", "Gemini API", "Firebase", "Tailwind CSS", "Cloudinary", "JavaScript"],
      image: "/projects/ev-platform.jpg",
      liveUrl: "https://github.com/rajangaur/ev-platform",
      githubUrl: "https://github.com/rajangaur/ev-platform",
      featured: true
    },
    {
      id: "employee-tracker",
      badge: "PRODUCTION MOBILE APP",
      title: "EMPLOYEE TRACKER",
      subtitle: "GPS Geofenced Attendance & Automated Payroll",
      tagline: "GPS Geofenced Attendance & Automated Payroll",
      category: "Flutter Android Mobile App",
      year: "2024",
      architecture: "Flutter (Dart) • Geolocator API • SQLite / Local State • Custom Algorithms",
      description: "A mobile application designed for distributed and field teams to track geofenced work hours, automate shift check-ins, and calculate dynamic payroll with leave deductions.",
      problem: "Manual attendance systems and generic punch clocks lead to time-theft, inaccurate overtime logging, and hours of manual payroll calculation errors.",
      solution: "Developed an Android Flutter application that calculates exact working durations through location-verified checkouts and dynamic salary calculation formulas.",
      features: [
        "Precise geofencing and GPS radius validation to prevent remote false check-ins.",
        "Automated check-out logic and overtime computation with dynamic day/night shift rates.",
        "Transparent payroll engine accounting for unapproved leaves and half-day penalties.",
        "Responsive, high-clarity Material 3 mobile UI with daily attendance heatmaps."
      ],
      impact: "Streamlines attendance verification and delivers automated, dispute-free salary computation.",
      tech: ["Flutter", "Dart", "Android SDK", "Geolocator", "Local DB", "State Management"],
      image: "/projects/employee-tracker.jpg",
      liveUrl: "https://github.com/rajangaur/employee-tracker",
      githubUrl: "https://github.com/rajangaur/employee-tracker",
      featured: true
    }
  ],

  technicalSkills: [
    {
      category: "Frontend Engineering",
      highlight: "Modern, Reactive & Fluid Web Applications",
      description: "Building fast, high-performance web frontends with clean component architecture, responsive mobile-first layouts, and smooth micro-interactions.",
      skills: ["React.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 Canvas", "Vite"]
    },
    {
      category: "Backend & Database",
      highlight: "Scalable Logic, Secure Authentication & Storage",
      description: "Designing structured database schemas, handling role-based user authentication, and integrating cloud services for real-time synchronization.",
      skills: ["Firebase Auth", "Cloud Firestore", "Cloudinary CDN", "REST APIs", "Node.js Basics", "JSON Schemas"]
    },
    {
      category: "Mobile App Development",
      highlight: "Cross-Platform Android Applications (Flutter)",
      description: "Creating native-performance mobile applications using Flutter and Dart with device hardware integration like GPS location and local persistence.",
      skills: ["Flutter", "Dart", "Android Development", "Geolocator API", "Local Storage", "State Management"]
    },
    {
      category: "Cloud Computing",
      highlight: "Scalable Cloud Architecture & AWS Learner",
      description: "Actively studying and applying core AWS infrastructure services through AWS Academy to understand cloud deployment, compute instances, and storage.",
      skills: ["AWS EC2", "AWS S3", "AWS Lambda Basics", "Cloud Architecture", "Linux Basics", "DNS & Domains"]
    },
    {
      category: "AI Integration & Workflows",
      highlight: "Applying LLMs to Solve Practical Bottlenecks",
      description: "Leveraging foundational AI models like Google Gemini API to build content pipelines, smart validation systems, and intelligent user assistance.",
      skills: ["Gemini API", "LLM Integration", "Structured Output Parsing", "AI Workflows", "Automated Review Systems"]
    }
  ],

  capabilities: [
    {
      category: "Frontend Engineering",
      highlight: "Modern, Reactive & Fluid Web Applications",
      description: "Building fast, high-performance web frontends with clean component architecture, responsive mobile-first layouts, and smooth micro-interactions.",
      skills: ["React.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 Canvas", "Vite"]
    },
    {
      category: "Backend & Database",
      highlight: "Scalable Logic, Secure Authentication & Storage",
      description: "Designing structured database schemas, handling role-based user authentication, and integrating cloud services for real-time synchronization.",
      skills: ["Firebase Auth", "Cloud Firestore", "Cloudinary CDN", "REST APIs", "Node.js Basics", "JSON Schemas"]
    },
    {
      category: "Mobile App Development",
      highlight: "Cross-Platform Android Applications (Flutter)",
      description: "Creating native-performance mobile applications using Flutter and Dart with device hardware integration like GPS location and local persistence.",
      skills: ["Flutter", "Dart", "Android Development", "Geolocator API", "Local Storage", "State Management"]
    },
    {
      category: "Cloud Computing",
      highlight: "Scalable Cloud Architecture & AWS Learner",
      description: "Actively studying and applying core AWS infrastructure services through AWS Academy to understand cloud deployment, compute instances, and storage.",
      skills: ["AWS EC2", "AWS S3", "AWS Lambda Basics", "Cloud Architecture", "Linux Basics", "DNS & Domains"]
    },
    {
      category: "AI Integration & Workflows",
      highlight: "Applying LLMs to Solve Practical Bottlenecks",
      description: "Leveraging foundational AI models like Google Gemini API to build content pipelines, smart validation systems, and intelligent user assistance.",
      skills: ["Gemini API", "LLM Integration", "Structured Output Parsing", "AI Workflows", "Automated Review Systems"]
    }
  ],

  philosophy: [
    {
      title: "Action Over Theory",
      detail: "Building actual applications teaches more than passive tutorial watching. Every concept learned is immediately applied into a working project with real authentication, real database structures, and usable interfaces."
    },
    {
      title: "Products Over Certificates",
      detail: "Real-world utility is the ultimate proof of engineering competence. Focusing on complete products that solve real problems (like food waste in ResQ Meal or workforce tracking in Employee Tracker)."
    },
    {
      title: "Feedback Over Praise",
      detail: "Constructive feedback and honest review drive rapid technical mastery. Prioritizing code correctness, logic accuracy, and architectural soundness over superficial design vanity."
    },
    {
      title: "System Thinking Over Isolated Code",
      detail: "Software is an ecosystem of UI, logic, storage, and real users. Always planning the complete picture: who uses the app, how data flows, where errors might occur, and how to keep it fast."
    }
  ],

  goals: [
    { area: "Mastering Advanced Flutter Architecture", objective: "Deepening state management, custom painters, and cross-platform native plugins." },
    { area: "AWS Academy Cloud Architecture Mastery", objective: "Building production cloud backends utilizing serverless functions and containerized services." },
    { area: "Mastering Scalable System Design", objective: "Studying high-scale distributed systems, caching strategies, and microservice architectures." },
    { area: "Building Problem-Solving Startups", objective: "Creating production-grade SaaS and community platforms with measurable user impact." }
  ],

  differentiators: [
    "Not a passive learner — builds end-to-end applications from scratch.",
    "Combines full-stack web development with native Flutter mobile skills.",
    "Actively integrates modern AI APIs (Gemini) into practical user workflows.",
    "Understands complete product lifecycle: from UI design to backend and cloud deployment."
  ],

  creed: {
    quote: "I believe the best way to master technology is to build things that matter. Action, persistence, and continuous iteration create software that lasts.",
    author: "Rajan Gaur",
    role: "BCA Student & Product Builder"
  },

  timeline: [
    {
      year: "2024 — PRESENT",
      role: "Full Stack & Flutter Product Builder",
      company: "Independent Inventions",
      description: "Engineered ResQ Meal, EV Educational Platform with Gemini AI, and Flutter Employee Tracker."
    },
    {
      year: "2023 — 2024",
      role: "BCA Student & Core Developer",
      company: "Bachelor of Computer Applications",
      description: "Focused on Full-Stack JavaScript, Flutter Android SDK, Database Systems, and Cloud Foundations."
    }
  ],

  honors: [
    { title: "AWS Academy Graduate", issuer: "AWS Training & Certification", year: "2025" },
    { title: "Full Stack Product Inventions", issuer: "Independent Portfolio", year: "2024" }
  ],

  testimonials: [
    {
      quote: "Rajan builds real-world applications with authentic logic and attention to detail. His focus on action over theory is rare and impressive.",
      author: "Academic Mentor",
      title: "Faculty of Computer Applications"
    }
  ]
};
