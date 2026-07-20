// Central content source for the site. Keeping copy here means every
// section, page, and agent-authored component pulls from one place.

export const site = {
  name: "St.School",
  parentBrand: "Student Tribe",
  tagline: "Turn ambition into employable skill.",
  description:
    "St.School is Student Tribe's career-launchpad for Python Full-Stack + AI and UI/UX Design — real projects, industry mentors, and placement support for a hand-picked cohort of 33.",
  city: "Hyderabad",
  url: "https://st.school",
};

export const navLinks = [
  { label: "Programs", href: "/courses" },
  { label: "Why St.School", href: "/#why-us" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const heroStats = [
  { value: 1000, suffix: "+", label: "applications per cohort" },
  { value: 33, suffix: "", label: "seats offered, no more" },
  { value: 95, suffix: "%", label: "placement track record" },
];

export const trustLogos = [
  "Student Tribe",
  "T-Hub",
  "Hamzek",
  "Forbes 30u30 Asia",
  "500+ Campuses",
  "1M+ Student Network",
];

export const stats = [
  {
    value: 1000,
    suffix: "+",
    label: "Applications every batch",
    detail: "Demand for a St.School seat outstrips supply nearly 30 to 1.",
  },
  {
    value: 33,
    suffix: "",
    label: "Students selected, per cohort",
    detail: "Small by design — mentors know every learner by name.",
  },
  {
    value: 95,
    suffix: "%",
    label: "Placement track record",
    detail: "Across partner companies hiring for real, five-figure roles.",
  },
  {
    value: 10,
    prefix: "₹",
    suffix: "K",
    label: "Merit scholarships available",
    detail: "For learners who show up serious about the craft.",
  },
];

export type Course = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  duration: string;
  mode: string;
  level: string;
  summary: string;
  color: "violet" | "coral";
  stack: string[];
  outcomes: string[];
  curriculum: { phase: string; title: string; description: string; topics: string[] }[];
  highlights: { title: string; description: string }[];
};

export const courses: Course[] = [
  {
    slug: "python-fullstack-ai",
    name: "Python Full-Stack + AI Program",
    shortName: "Python Full-Stack + AI",
    tagline: "Ship production software with FastAPI, React, and AI in the loop.",
    duration: "14 weeks",
    mode: "Online & offline cohorts",
    level: "Beginner to job-ready",
    summary:
      "Go from Python fundamentals to shipping full-stack, AI-integrated products — FastAPI on the backend, React on the front, and real deployment on real infra, guided by mentors who work in the industry.",
    color: "violet",
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "AI / LLM APIs", "Git & CI/CD"],
    outcomes: [
      "Ship 3+ full-stack products to a public portfolio",
      "Design and consume REST APIs with FastAPI",
      "Build production React interfaces with modern tooling",
      "Integrate AI/LLM features into real applications",
      "Clear technical interviews with a rehearsed DSA + system design base",
    ],
    curriculum: [
      {
        phase: "Weeks 1–3",
        title: "Foundations",
        description: "Python core, data structures, and the developer workflow.",
        topics: ["Python syntax & OOP", "Data structures & algorithms", "Git, terminal, and tooling", "Problem-solving sprints"],
      },
      {
        phase: "Weeks 4–7",
        title: "Backend with FastAPI",
        description: "Build and ship real APIs backed by a real database.",
        topics: ["FastAPI routing & validation", "PostgreSQL & ORM design", "Authentication & authorization", "Testing & deployment"],
      },
      {
        phase: "Weeks 8–11",
        title: "Frontend with React",
        description: "Turn APIs into interfaces people actually want to use.",
        topics: ["React components & state", "API integration", "Responsive, accessible UI", "Performance basics"],
      },
      {
        phase: "Weeks 12–14",
        title: "AI Integration & Capstone",
        description: "Wire AI into your stack, then ship a capstone under mentor review.",
        topics: ["LLM APIs & prompt design", "AI-assisted product features", "Capstone build week", "Demo day & portfolio polish"],
      },
    ],
    highlights: [
      { title: "Live, mentor-led sessions", description: "Not pre-recorded. Real instructors, real Q&A, every week." },
      { title: "Industry case studies", description: "Work the same problems product teams ship this quarter." },
      { title: "Hackathons", description: "Compete in timed builds that mirror real sprint pressure." },
      { title: "Interview prep", description: "Technical + HR mock rounds until you stop dreading them." },
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design Program",
    shortName: "UI/UX Design",
    tagline: "Design real products, defend real decisions, ship a real portfolio.",
    duration: "12 weeks",
    mode: "Online & offline cohorts",
    level: "Beginner-friendly",
    summary:
      "A hands-on design program built around real projects, not theory decks — research, wireframes, high-fidelity UI, and prototypes, with continuous feedback from mentors who review your work like a manager would.",
    color: "coral",
    stack: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping", "Portfolio Craft"],
    outcomes: [
      "Ship a portfolio of 4+ end-to-end case studies",
      "Run user research and translate insight into design decisions",
      "Build and maintain a component-based design system",
      "Prototype and test high-fidelity interfaces in Figma",
      "Present and defend design decisions like a working designer",
    ],
    curriculum: [
      {
        phase: "Weeks 1–3",
        title: "Design Foundations",
        description: "Visual, interaction, and UX fundamentals from the ground up.",
        topics: ["Design principles & theory", "Typography, color, layout", "Figma fluency", "UX research basics"],
      },
      {
        phase: "Weeks 4–6",
        title: "Research & UX",
        description: "Learn to design from evidence, not assumption.",
        topics: ["User interviews & personas", "Information architecture", "Wireframing & user flows", "Usability testing"],
      },
      {
        phase: "Weeks 7–9",
        title: "UI & Design Systems",
        description: "Turn wireframes into polished, consistent interfaces.",
        topics: ["High-fidelity UI design", "Component & design systems", "Responsive & accessible design", "Micro-interactions"],
      },
      {
        phase: "Weeks 10–12",
        title: "Capstone & Portfolio",
        description: "Ship a case study strong enough to lead an interview with.",
        topics: ["End-to-end capstone project", "Prototyping & handoff", "Portfolio storytelling", "Demo day & mentor review"],
      },
    ],
    highlights: [
      { title: "Real client-style briefs", description: "Ambiguous problems, not tutorials — the way real design work arrives." },
      { title: "1:1 mentor critique", description: "Continuous feedback loops instead of a single end-of-course review." },
      { title: "Guest lectures", description: "Working designers walk through how they actually make decisions." },
      { title: "Portfolio-first", description: "Every project is built to go straight into your case study deck." },
    ],
  },
];

export const process = [
  {
    step: "01",
    title: "Apply",
    description: "Tell us where you're starting from and where you want to go. Takes minutes, no fluff.",
  },
  {
    step: "02",
    title: "Get selected",
    description: "We review 1000+ applications and hand-pick 33 — chosen for seriousness, not pedigree.",
  },
  {
    step: "03",
    title: "Build, live",
    description: "Weekly live sessions, real projects, and mentors who review your work like a manager would.",
  },
  {
    step: "04",
    title: "Interview-ready",
    description: "Mock technical rounds, case-study defenses, and HR prep until it's second nature.",
  },
  {
    step: "05",
    title: "Get placed",
    description: "Warm intros into our hiring network — a 95% track record of landing real, paying roles.",
  },
];

export const whyUs = [
  {
    title: "33 seats, not 3,000",
    description: "We turn away far more applicants than we accept, so every cohort gets real mentor attention.",
  },
  {
    title: "Built on real projects",
    description: "No toy exercises. You ship the same kind of work product teams ship this quarter.",
  },
  {
    title: "Backed by Student Tribe",
    description: "1M+ student community, 500+ campuses, and a hiring network built over a decade in Hyderabad.",
  },
  {
    title: "Mentors who show up",
    description: "Working engineers and designers running live sessions — not pre-recorded playlists.",
  },
];

export const testimonials = [
  {
    quote:
      "The cohort was tiny on purpose — 33 of us — and it showed. Every project got real feedback, not a rubric.",
    name: "Aarav K.",
    role: "Python Full-Stack + AI, Batch 09",
  },
  {
    quote:
      "I came in knowing Figma and left with a portfolio that actually got callbacks. The critiques were brutal in the best way.",
    name: "Meher S.",
    role: "UI/UX Design, Batch 07",
  },
  {
    quote:
      "Mock interviews every week until they stopped being scary. That's the part nobody else does properly.",
    name: "Rohit V.",
    role: "Python Full-Stack + AI, Batch 08",
  },
  {
    quote:
      "1000+ people applied for my batch. Knowing only 33 got in made the whole thing feel worth showing up for, every session.",
    name: "Divya N.",
    role: "UI/UX Design, Batch 06",
  },
];

export const faqs = [
  {
    question: "Who is St.School actually for?",
    answer:
      "Students and early-career learners in Hyderabad (and online, anywhere) who want a structured, mentor-led path into Python full-stack + AI engineering or UI/UX design — and are willing to do the work for it.",
  },
  {
    question: "Why only 33 seats per batch?",
    answer:
      "Because mentorship doesn't scale past a certain point without becoming shallow. We'd rather turn away qualified applicants than dilute the attention every learner gets.",
  },
  {
    question: "Is the program online or offline?",
    answer:
      "Both. Choose an online cohort or an in-person, offline batch in Hyderabad — the curriculum, mentors, and outcomes are the same either way.",
  },
  {
    question: "Do you guarantee placement?",
    answer:
      "No program can ethically guarantee a job. What we offer is placement assistance — mock interviews, referrals, and a hiring network with a 95% track record for learners who complete the program.",
  },
  {
    question: "What do I walk away with?",
    answer:
      "A portfolio of real, shipped projects, a certification, interview-tested skills, and direct access to Student Tribe's hiring network of partner companies.",
  },
  {
    question: "Are scholarships available?",
    answer:
      "Yes — merit-based scholarships worth up to ₹10,000 are available for applicants who show up serious about the craft during selection.",
  },
];

export const parentBrand = {
  founded: 2015,
  founder: "Sri Lakkaraju",
  hq: "Hyderabad, India",
  stats: [
    { value: "1M+", label: "students in the network" },
    { value: "500+", label: "partner campuses" },
    { value: "10+", label: "years building for Gen Z" },
    { value: "Forbes", label: "30 Under 30 Asia" },
  ],
  description:
    "St.School is built on top of Student Tribe — India's largest Gen Z student community, founded in Hyderabad in 2015 to close the gap between tier 2/3 college students and real career opportunity. Backed by T-Hub and Hamzek, and recognized on Forbes' 30 Under 30 Asia list, Student Tribe has spent a decade building the campus network, mentor relationships, and hiring pipeline that St.School students walk straight into.",
};

export const contact = {
  email: "hello@st.school",
  phone: "+91 90000 00000",
  address: "Hyderabad, Telangana, India",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/studenttribe.st/" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCLMHUneYEQYxLSU4_rmT_pA" },
  ],
};
