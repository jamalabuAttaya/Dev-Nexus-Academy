"use client";
/* eslint-disable react-hooks/set-state-in-effect -- progress is synchronized from localStorage per roadmap */

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type Roadmap = {
  id: string;
  title: string;
  category: string;
  summary: string;
  duration: string;
  level: string;
  roadmapUrl: string;
  steps: { title: string; detail: string }[];
};

const roadmaps: Roadmap[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "تطوير الويب",
    summary: "من أساسيات الويب إلى React والأداء وبناء منتجات احترافية.",
    duration: "8–12 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/frontend",
    steps: [
      { title: "HTML وCSS", detail: "الويب الدلالي، Flexbox، Grid والتجاوب" },
      {
        title: "JavaScript",
        detail: "اللغة، DOM، الشبكة والبرمجة غير المتزامنة",
      },
      { title: "Git وأدوات البناء", detail: "GitHub، npm، Vite والتصحيح" },
      {
        title: "React وTypeScript",
        detail: "المكوّنات، الحالة، التوجيه والأنواع",
      },
      { title: "الجودة والأداء", detail: "Testing، Accessibility وWeb Vitals" },
      { title: "مشاريع وPortfolio", detail: "ثلاثة منتجات منشورة قابلة للعرض" },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    category: "تطوير الويب",
    summary: "بناء خدمات موثوقة وواجهات API وقواعد بيانات قابلة للتوسع.",
    duration: "9–14 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/backend",
    steps: [
      { title: "لغة خادمية", detail: "PHP أو Node.js أو Python أو Java" },
      { title: "HTTP وAPIs", detail: "REST، المصادقة، التحقق وإدارة الأخطاء" },
      { title: "قواعد البيانات", detail: "SQL، النمذجة، الفهارس والمعاملات" },
      { title: "Framework", detail: "Laravel أو Express أو Django أو Spring" },
      {
        title: "Cache وQueues",
        detail: "Redis، المهام الخلفية ومراقبة الأداء",
      },
      { title: "النشر والتوسع", detail: "Docker، CI/CD، الأمن والمراقبة" },
    ],
  },
  {
    id: "full-stack",
    title: "Full Stack Developer",
    category: "تطوير الويب",
    summary: "مسار متوازن لبناء المنتج كاملًا من الواجهة حتى النشر.",
    duration: "12–18 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/full-stack",
    steps: [
      { title: "أساسيات الويب", detail: "HTML، CSS، JavaScript وGit" },
      { title: "واجهة حديثة", detail: "React، TypeScript وإدارة البيانات" },
      { title: "خلفية وAPI", detail: "Laravel أو Node والمصادقة" },
      { title: "البيانات", detail: "PostgreSQL، Redis وتخزين الملفات" },
      { title: "الاختبارات", detail: "Unit، Integration وE2E" },
      { title: "منتج Production", detail: "CI/CD، Cloud والمراقبة" },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "البيانات",
    summary: "من الجداول والاستعلامات إلى لوحات المؤشرات وصناعة القرار.",
    duration: "5–9 أشهر",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/data-analyst",
    steps: [
      { title: "Excel وSheets", detail: "التنظيف، الصيغ وPivot Tables" },
      { title: "SQL", detail: "Joins، CTEs، Window Functions" },
      { title: "الإحصاء", detail: "المقاييس، العينات واختبار الفرضيات" },
      {
        title: "Power BI أو Tableau",
        detail: "نمذجة البيانات ولوحات المؤشرات",
      },
      { title: "Python للتحليل", detail: "Pandas والتصور والأتمتة" },
      { title: "دراسة حالة", detail: "تحليل أعمال كامل مع توصيات" },
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    category: "البيانات",
    summary: "تصميم خطوط بيانات موثوقة ومستودعات وتحليلات واسعة النطاق.",
    duration: "10–16 شهرًا",
    level: "متوسط",
    roadmapUrl: "https://roadmap.sh/data-engineer",
    steps: [
      { title: "Python وSQL", detail: "برمجة البيانات والاستعلامات المتقدمة" },
      { title: "Data Modeling", detail: "OLTP، OLAP، Star وSnowflake" },
      { title: "Pipelines", detail: "ETL/ELT، Airflow واختبار البيانات" },
      { title: "Big Data", detail: "Spark، Kafka والمعالجة المتدفقة" },
      { title: "Cloud Data", detail: "Warehouses، Lakes وLakehouse" },
      { title: "DataOps", detail: "الحوكمة، الجودة، التكلفة والمراقبة" },
    ],
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    category: "الأمن",
    summary: "أساس قوي في الشبكات والدفاع والاختبار الأمني والاستجابة للحوادث.",
    duration: "10–18 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/cyber-security",
    steps: [
      {
        title: "شبكات وأنظمة",
        detail: "TCP/IP، Linux، Windows وActive Directory",
      },
      { title: "أساسيات الأمن", detail: "CIA، التشفير، IAM ونمذجة التهديد" },
      { title: "أمن الويب", detail: "OWASP، المصادقة واختبار APIs" },
      { title: "دفاع ومراقبة", detail: "SIEM، Logs، Detection وSOC" },
      { title: "اختبار اختراق", detail: "Recon، Exploitation وReporting" },
      { title: "مختبر وشهادات", detail: "Home Lab ومسار تخصصي عملي" },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    category: "البنية التحتية",
    summary: "أتمتة البناء والنشر وتشغيل الأنظمة القابلة للملاحظة.",
    duration: "9–15 شهرًا",
    level: "متوسط",
    roadmapUrl: "https://roadmap.sh/devops",
    steps: [
      { title: "Linux والشبكات", detail: "Shell، Processes، DNS وHTTP" },
      { title: "Git وCI/CD", detail: "Pipelines، Artifacts وStrategies" },
      { title: "Docker", detail: "Images، Networking وCompose" },
      { title: "Kubernetes", detail: "Workloads، Services وHelm" },
      {
        title: "Infrastructure as Code",
        detail: "Terraform وConfiguration Management",
      },
      { title: "Observability", detail: "Metrics، Logs، Traces وSRE" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud Engineer",
    category: "البنية التحتية",
    summary: "تصميم وتشغيل حلول سحابية آمنة ومرنة ومضبوطة التكلفة.",
    duration: "8–14 شهرًا",
    level: "متوسط",
    roadmapUrl: "https://roadmap.sh/aws",
    steps: [
      {
        title: "Cloud Foundations",
        detail: "Regions، IAM، Networking وPricing",
      },
      { title: "Compute وStorage", detail: "VMs، Serverless، Objects وCDN" },
      { title: "Databases", detail: "Relational، NoSQL وCaching" },
      { title: "Containers", detail: "Docker وخدمات الحاويات المدارة" },
      {
        title: "الأمن والاعتمادية",
        detail: "Backups، HA، DR وWell-Architected",
      },
      { title: "IaC وFinOps", detail: "Terraform، Monitoring وتحسين التكلفة" },
    ],
  },
  {
    id: "software-architect",
    title: "Software Architect",
    category: "هندسة البرمجيات",
    summary: "اتخاذ قرارات معمارية تربط جودة النظام باحتياجات العمل.",
    duration: "12–24 شهرًا",
    level: "متقدم",
    roadmapUrl: "https://roadmap.sh/software-architect",
    steps: [
      {
        title: "Design Principles",
        detail: "SOLID، Coupling، Cohesion وPatterns",
      },
      {
        title: "System Design",
        detail: "Scalability، Availability وTrade-offs",
      },
      { title: "Data Architecture", detail: "Consistency، Messaging وCaching" },
      {
        title: "Distributed Systems",
        detail: "Events، Resilience وObservability",
      },
      {
        title: "Security Architecture",
        detail: "Threat Modeling، Zero Trust وCompliance",
      },
      {
        title: "Architecture Practice",
        detail: "ADRs، Reviews، Governance وLeadership",
      },
    ],
  },
  {
    id: "database",
    title: "Database Engineer",
    category: "قواعد البيانات",
    summary: "تصميم قواعد بيانات سريعة وآمنة مع فهم عميق لـSQL والتشغيل.",
    duration: "7–12 شهرًا",
    level: "متوسط",
    roadmapUrl: "https://roadmap.sh/postgresql-dba",
    steps: [
      { title: "SQL متقدم", detail: "Joins، CTEs، Windows وExecution Plans" },
      { title: "Data Modeling", detail: "Normalization، Constraints وSchemas" },
      { title: "Indexing", detail: "B-Tree، Composite وFull Text" },
      { title: "Transactions", detail: "ACID، Isolation، Locks وMVCC" },
      { title: "Operations", detail: "Backup، Replication وMonitoring" },
      { title: "Scale", detail: "Partitioning، Sharding وCaching" },
    ],
  },
  {
    id: "computer-science",
    title: "Computer Science",
    category: "علوم الحاسب",
    summary: "منهج ذاتي متين للخوارزميات والأنظمة والنظرية وهندسة البرمجيات.",
    duration: "18–30 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/computer-science",
    steps: [
      { title: "Programming", detail: "لغة واحدة بعمق وحل المشكلات" },
      { title: "Data Structures", detail: "Lists، Trees، Graphs وHashing" },
      {
        title: "Algorithms",
        detail: "التعقيد، البحث، الفرز وDynamic Programming",
      },
      {
        title: "Computer Systems",
        detail: "Architecture، OS، Networks وDatabases",
      },
      { title: "Theory", detail: "Discrete Math، Automata وCompilers" },
      { title: "Software Engineering", detail: "Design، Testing ومشروع تخرّج" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    category: "تطبيقات الهاتف",
    summary: "بناء تطبيقات أصلية أو متعددة المنصات مع تجربة ونشر احترافيين.",
    duration: "8–14 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/android",
    steps: [
      { title: "لغة ومنصة", detail: "Kotlin/Swift أو Flutter/React Native" },
      { title: "UI وNavigation", detail: "Layouts، State وتجربة الاستخدام" },
      { title: "Data وNetworking", detail: "REST، Offline Storage وCaching" },
      { title: "Architecture", detail: "MVVM، DI وتقسيم الوحدات" },
      { title: "Quality", detail: "Testing، Performance وSecurity" },
      { title: "Publishing", detail: "Stores، Analytics وRelease Management" },
    ],
  },
  {
    id: "qa",
    title: "QA Engineer",
    category: "جودة البرمجيات",
    summary: "من الاختبار اليدوي إلى الأتمتة وضمان الجودة داخل دورة التطوير.",
    duration: "6–10 أشهر",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/qa",
    steps: [
      {
        title: "Testing Foundations",
        detail: "الأنواع، الحالات، المخاطر والتوثيق",
      },
      { title: "Web وAPI Testing", detail: "DevTools، HTTP وPostman" },
      { title: "لغة برمجة", detail: "JavaScript أو Python للأتمتة" },
      { title: "Automation", detail: "Playwright، Cypress أو Selenium" },
      { title: "CI وPerformance", detail: "Pipelines، Load وSecurity basics" },
      {
        title: "Quality Strategy",
        detail: "Metrics، Shift-left وتحسين العمليات",
      },
    ],
  },
  {
    id: "network",
    title: "Network Engineer",
    category: "الشبكات",
    summary: "فهم وتصميم وتشغيل الشبكات الحديثة وتأمينها وأتمتتها.",
    duration: "9–15 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/network-engineer",
    steps: [
      { title: "Network Basics", detail: "OSI، TCP/IP، Cabling وEthernet" },
      { title: "Routing وSwitching", detail: "VLANs، STP، OSPF وBGP" },
      { title: "Network Services", detail: "DNS، DHCP، NAT وVPN" },
      { title: "Security", detail: "Firewalls، Segmentation وZero Trust" },
      { title: "Cloud Networking", detail: "VPCs، Load Balancers وCDN" },
      { title: "Automation", detail: "Python، Ansible وTelemetry" },
    ],
  },
  {
    id: "blockchain",
    title: "Blockchain Developer",
    category: "تقنيات ناشئة",
    summary: "فهم الشبكات اللامركزية وبناء عقود وتطبيقات Web3 آمنة.",
    duration: "9–15 شهرًا",
    level: "متوسط",
    roadmapUrl: "https://roadmap.sh/blockchain",
    steps: [
      {
        title: "Distributed Basics",
        detail: "Hashing، Consensus وCryptography",
      },
      { title: "Ethereum وEVM", detail: "Accounts، Transactions وGas" },
      { title: "Solidity", detail: "Contracts، Events وTesting" },
      { title: "Web3 Apps", detail: "Wallets، RPC وFrontend integration" },
      { title: "Security", detail: "Reentrancy، Auditing وThreats" },
      { title: "Production", detail: "Deployment، Indexing وMonitoring" },
    ],
  },
  {
    id: "game-dev",
    title: "Game Developer",
    category: "تطوير الألعاب",
    summary: "تعلّم البرمجة والرسوم والفيزياء لبناء ألعاب قابلة للنشر.",
    duration: "10–18 شهرًا",
    level: "مبتدئ",
    roadmapUrl: "https://roadmap.sh/game-developer",
    steps: [
      { title: "Programming", detail: "C# أو C++، OOP والرياضيات" },
      { title: "Game Engine", detail: "Unity أو Unreal وأدوات المحرر" },
      { title: "Gameplay", detail: "Input، Physics، NPC behavior وState" },
      { title: "Graphics وAudio", detail: "Rendering، Animation وSound" },
      { title: "Optimization", detail: "Profiling، Memory وPerformance" },
      { title: "Ship a Game", detail: "Polish، Build، Store وCommunity" },
    ],
  },
];

type EnglishRoadmap = {
  category: string;
  summary: string;
  duration: string;
  level: string;
  steps: { title: string; detail: string }[];
};

const englishRoadmaps: Record<string, EnglishRoadmap> = {
  frontend: {
    category: "Web Development",
    summary:
      "Move from web foundations to React, accessibility, performance, and polished products.",
    duration: "8–12 months",
    level: "Beginner",
    steps: [
      {
        title: "HTML & CSS",
        detail: "Semantic HTML, Flexbox, Grid, responsive design",
      },
      {
        title: "JavaScript",
        detail: "Language fundamentals, DOM, networking, async programming",
      },
      { title: "Git & Tooling", detail: "GitHub, npm, Vite, debugging" },
      {
        title: "React & TypeScript",
        detail: "Components, state, routing, types",
      },
      {
        title: "Quality & Performance",
        detail: "Testing, accessibility, Web Vitals",
      },
      {
        title: "Projects & Portfolio",
        detail: "Three published, presentation-ready products",
      },
    ],
  },
  backend: {
    category: "Web Development",
    summary:
      "Build dependable services, secure APIs, and databases that can scale.",
    duration: "9–14 months",
    level: "Beginner",
    steps: [
      { title: "Server Language", detail: "PHP, Node.js, Python, or Java" },
      {
        title: "HTTP & APIs",
        detail: "REST, authentication, validation, error handling",
      },
      { title: "Databases", detail: "SQL, modeling, indexes, transactions" },
      { title: "Framework", detail: "Laravel, Express, Django, or Spring" },
      {
        title: "Cache & Queues",
        detail: "Redis, background jobs, performance monitoring",
      },
      {
        title: "Deployment & Scale",
        detail: "Docker, CI/CD, security, observability",
      },
    ],
  },
  "full-stack": {
    category: "Web Development",
    summary:
      "A balanced path for building a complete product from interface to deployment.",
    duration: "12–18 months",
    level: "Beginner",
    steps: [
      { title: "Web Foundations", detail: "HTML, CSS, JavaScript, Git" },
      {
        title: "Modern Frontend",
        detail: "React, TypeScript, data management",
      },
      { title: "Backend & API", detail: "Laravel or Node, authentication" },
      { title: "Data Layer", detail: "PostgreSQL, Redis, file storage" },
      { title: "Testing", detail: "Unit, integration, end-to-end" },
      { title: "Production Product", detail: "CI/CD, cloud, monitoring" },
    ],
  },
  "data-analyst": {
    category: "Data",
    summary:
      "Progress from spreadsheets and queries to dashboards and informed decisions.",
    duration: "5–9 months",
    level: "Beginner",
    steps: [
      { title: "Excel & Sheets", detail: "Cleaning, formulas, Pivot Tables" },
      { title: "SQL", detail: "Joins, CTEs, Window Functions" },
      { title: "Statistics", detail: "Measures, sampling, hypothesis testing" },
      { title: "Power BI or Tableau", detail: "Data modeling, dashboards" },
      {
        title: "Python for Analysis",
        detail: "Pandas, visualization, automation",
      },
      {
        title: "Case Study",
        detail: "Complete business analysis with recommendations",
      },
    ],
  },
  "data-engineer": {
    category: "Data",
    summary:
      "Design reliable data pipelines, warehouses, and large-scale analytics systems.",
    duration: "10–16 months",
    level: "Intermediate",
    steps: [
      { title: "Python & SQL", detail: "Data programming, advanced queries" },
      {
        title: "Data Modeling",
        detail: "OLTP, OLAP, star and snowflake schemas",
      },
      { title: "Pipelines", detail: "ETL/ELT, Airflow, data testing" },
      { title: "Big Data", detail: "Spark, Kafka, streaming" },
      { title: "Cloud Data", detail: "Warehouses, lakes, lakehouse" },
      { title: "DataOps", detail: "Governance, quality, cost, monitoring" },
    ],
  },
  "cyber-security": {
    category: "Cybersecurity",
    summary:
      "Build strong foundations in networks, defense, security testing, and incident response.",
    duration: "10–18 months",
    level: "Beginner",
    steps: [
      {
        title: "Networks & Systems",
        detail: "TCP/IP, Linux, Windows, Active Directory",
      },
      {
        title: "Security Foundations",
        detail: "CIA, cryptography, IAM, threat modeling",
      },
      { title: "Web Security", detail: "OWASP, authentication, API testing" },
      { title: "Defense & Monitoring", detail: "SIEM, logs, detection, SOC" },
      {
        title: "Penetration Testing",
        detail: "Reconnaissance, exploitation, reporting",
      },
      {
        title: "Lab & Certifications",
        detail: "Home lab, practical specialization",
      },
    ],
  },
  devops: {
    category: "Infrastructure",
    summary: "Automate delivery and operate observable, resilient systems.",
    duration: "9–15 months",
    level: "Intermediate",
    steps: [
      { title: "Linux & Networking", detail: "Shell, processes, DNS, HTTP" },
      {
        title: "Git & CI/CD",
        detail: "Pipelines, artifacts, deployment strategies",
      },
      { title: "Docker", detail: "Images, networking, Compose" },
      { title: "Kubernetes", detail: "Workloads, services, Helm" },
      {
        title: "Infrastructure as Code",
        detail: "Terraform, configuration management",
      },
      { title: "Observability", detail: "Metrics, logs, traces, SRE" },
    ],
  },
  cloud: {
    category: "Infrastructure",
    summary: "Design and run secure, resilient, cost-aware cloud solutions.",
    duration: "8–14 months",
    level: "Intermediate",
    steps: [
      {
        title: "Cloud Foundations",
        detail: "Regions, IAM, networking, pricing",
      },
      {
        title: "Compute & Storage",
        detail: "VMs, serverless, object storage, CDN",
      },
      { title: "Databases", detail: "Relational, NoSQL, caching" },
      { title: "Containers", detail: "Docker, managed container services" },
      {
        title: "Security & Reliability",
        detail: "Backups, HA, DR, Well-Architected",
      },
      {
        title: "IaC & FinOps",
        detail: "Terraform, monitoring, cost optimization",
      },
    ],
  },
  "software-architect": {
    category: "Software Engineering",
    summary:
      "Connect architecture decisions and system quality to real business needs.",
    duration: "12–24 months",
    level: "Advanced",
    steps: [
      {
        title: "Design Principles",
        detail: "SOLID, coupling, cohesion, patterns",
      },
      {
        title: "System Design",
        detail: "Scalability, availability, trade-offs",
      },
      { title: "Data Architecture", detail: "Consistency, messaging, caching" },
      {
        title: "Distributed Systems",
        detail: "Events, resilience, observability",
      },
      {
        title: "Security Architecture",
        detail: "Threat modeling, Zero Trust, compliance",
      },
      {
        title: "Architecture Practice",
        detail: "ADRs, reviews, governance, leadership",
      },
    ],
  },
  database: {
    category: "Databases",
    summary:
      "Design fast, secure databases with deep SQL and operations knowledge.",
    duration: "7–12 months",
    level: "Intermediate",
    steps: [
      {
        title: "Advanced SQL",
        detail: "Joins, CTEs, windows, execution plans",
      },
      { title: "Data Modeling", detail: "Normalization, constraints, schemas" },
      { title: "Indexing", detail: "B-Tree, composite, full text" },
      { title: "Transactions", detail: "ACID, isolation, locks, MVCC" },
      { title: "Operations", detail: "Backup, replication, monitoring" },
      { title: "Scale", detail: "Partitioning, sharding, caching" },
    ],
  },
  "computer-science": {
    category: "Computer Science",
    summary:
      "A rigorous self-study path through algorithms, systems, theory, and software engineering.",
    duration: "18–30 months",
    level: "Beginner",
    steps: [
      {
        title: "Programming",
        detail: "One language in depth, problem solving",
      },
      { title: "Data Structures", detail: "Lists, trees, graphs, hashing" },
      {
        title: "Algorithms",
        detail: "Complexity, search, sorting, dynamic programming",
      },
      {
        title: "Computer Systems",
        detail: "Architecture, operating systems, networks, databases",
      },
      { title: "Theory", detail: "Discrete math, automata, compilers" },
      {
        title: "Software Engineering",
        detail: "Design, testing, capstone project",
      },
    ],
  },
  mobile: {
    category: "Mobile Development",
    summary:
      "Build native or cross-platform apps with professional UX, quality, and publishing.",
    duration: "8–14 months",
    level: "Beginner",
    steps: [
      {
        title: "Language & Platform",
        detail: "Kotlin, Swift, Flutter, or React Native",
      },
      { title: "UI & Navigation", detail: "Layouts, state, user experience" },
      { title: "Data & Networking", detail: "REST, offline storage, caching" },
      { title: "Architecture", detail: "MVVM, dependency injection, modules" },
      { title: "Quality", detail: "Testing, performance, security" },
      { title: "Publishing", detail: "Stores, analytics, release management" },
    ],
  },
  qa: {
    category: "Quality Assurance",
    summary:
      "Move from manual testing to automation and quality engineering across delivery.",
    duration: "6–10 months",
    level: "Beginner",
    steps: [
      {
        title: "Testing Foundations",
        detail: "Types, cases, risk, documentation",
      },
      { title: "Web & API Testing", detail: "DevTools, HTTP, Postman" },
      {
        title: "Programming Language",
        detail: "JavaScript or Python for automation",
      },
      { title: "Automation", detail: "Playwright, Cypress, or Selenium" },
      {
        title: "CI & Performance",
        detail: "Pipelines, load testing, security basics",
      },
      {
        title: "Quality Strategy",
        detail: "Metrics, shift-left, process improvement",
      },
    ],
  },
  network: {
    category: "Networks",
    summary:
      "Understand, design, operate, secure, and automate modern networks.",
    duration: "9–15 months",
    level: "Beginner",
    steps: [
      { title: "Network Basics", detail: "OSI, TCP/IP, cabling, Ethernet" },
      { title: "Routing & Switching", detail: "VLANs, STP, OSPF, BGP" },
      { title: "Network Services", detail: "DNS, DHCP, NAT, VPN" },
      { title: "Security", detail: "Firewalls, segmentation, Zero Trust" },
      { title: "Cloud Networking", detail: "VPCs, load balancers, CDN" },
      { title: "Automation", detail: "Python, Ansible, telemetry" },
    ],
  },
  blockchain: {
    category: "Emerging Technology",
    summary:
      "Understand decentralized networks and build secure smart contracts and Web3 apps.",
    duration: "9–15 months",
    level: "Intermediate",
    steps: [
      {
        title: "Distributed Foundations",
        detail: "Hashing, consensus, cryptography",
      },
      { title: "Ethereum & EVM", detail: "Accounts, transactions, gas" },
      { title: "Solidity", detail: "Contracts, events, testing" },
      { title: "Web3 Apps", detail: "Wallets, RPC, frontend integration" },
      { title: "Security", detail: "Reentrancy, auditing, threats" },
      { title: "Production", detail: "Deployment, indexing, monitoring" },
    ],
  },
  "game-dev": {
    category: "Game Development",
    summary:
      "Learn programming, graphics, and physics to create and ship playable games.",
    duration: "10–18 months",
    level: "Beginner",
    steps: [
      { title: "Programming", detail: "C# or C++, OOP, mathematics" },
      { title: "Game Engine", detail: "Unity or Unreal, editor tooling" },
      { title: "Gameplay", detail: "Input, physics, NPC behavior, state" },
      { title: "Graphics & Audio", detail: "Rendering, animation, sound" },
      { title: "Optimization", detail: "Profiling, memory, performance" },
      { title: "Ship a Game", detail: "Polish, builds, stores, community" },
    ],
  },
};

const groupDefinitions = [
  { id: "الكل", en: "All", glyph: "∞" },
  { id: "تطوير الويب", en: "Web Development", glyph: "</>" },
  { id: "البيانات", en: "Data", glyph: "▥" },
  { id: "الأمن", en: "Cybersecurity", glyph: "⌾" },
  { id: "البنية التحتية", en: "Infrastructure", glyph: "∞" },
  { id: "هندسة البرمجيات", en: "Software Engineering", glyph: "▦" },
  { id: "قواعد البيانات", en: "Databases", glyph: "DB" },
  { id: "علوم الحاسب", en: "Computer Science", glyph: "CS" },
  { id: "تطبيقات الهاتف", en: "Mobile Development", glyph: "▯" },
  { id: "جودة البرمجيات", en: "Quality Assurance", glyph: "✓" },
  { id: "الشبكات", en: "Networks", glyph: "⌁" },
  { id: "تقنيات ناشئة", en: "Emerging Technology", glyph: "⬡" },
  { id: "تطوير الألعاب", en: "Game Development", glyph: "GX" },
];

const roadmapGlyphs: Record<string, string> = {
  frontend: "</>",
  backend: "API",
  "full-stack": "FS",
  "data-analyst": "BI",
  "data-engineer": "DE",
  "cyber-security": "⌾",
  devops: "∞",
  cloud: "☁",
  "software-architect": "▦",
  database: "DB",
  "computer-science": "CS",
  mobile: "▯",
  qa: "✓",
  network: "⌁",
  blockchain: "⬡",
  "game-dev": "GX",
};

export default function RoadmapExplorer() {
  const { language, tr } = useLanguage();
  const [selectedId, setSelectedId] = useState(roadmaps[0].id);
  const [group, setGroup] = useState("الكل");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const selected =
    roadmaps.find((roadmap) => roadmap.id === selectedId) ?? roadmaps[0];
  const englishSelected = englishRoadmaps[selected.id];
  const selectedSteps =
    language === "en" ? englishSelected.steps : selected.steps;
  const selectedCategory =
    language === "en" ? englishSelected.category : selected.category;
  const selectedSummary =
    language === "en" ? englishSelected.summary : selected.summary;
  const selectedDuration =
    language === "en" ? englishSelected.duration : selected.duration;
  const selectedLevel =
    language === "en" ? englishSelected.level : selected.level;

  useEffect(() => {
    const saved =
      localStorage.getItem(`dev-nexus-roadmap-${selectedId}`) ??
      localStorage.getItem(`codezx-roadmap-${selectedId}`);
    if (!saved) {
      setCompleted([]);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as unknown;
      const valid = Array.isArray(parsed)
        ? [
            ...new Set(
              parsed.filter(
                (item): item is string =>
                  typeof item === "string" &&
                  Number(item) >= 0 &&
                  Number(item) < selectedSteps.length,
              ),
            ),
          ]
        : [];
      setCompleted(valid);
    } catch {
      setCompleted([]);
    }
  }, [selectedId, selectedSteps.length]);

  const visible = useMemo(
    () =>
      roadmaps.filter((roadmap) => {
        const english = englishRoadmaps[roadmap.id];
        const text =
          `${roadmap.title} ${roadmap.category} ${roadmap.summary} ${english.category} ${english.summary} ${roadmap.steps.map((step) => `${step.title} ${step.detail}`).join(" ")} ${english.steps.map((step) => `${step.title} ${step.detail}`).join(" ")}`.toLowerCase();
        return (
          (group === "الكل" || roadmap.category === group) &&
          text.includes(query.trim().toLowerCase())
        );
      }),
    [group, query],
  );

  function toggleStep(index: number) {
    const key = String(index);
    const next = completed.includes(key)
      ? completed.filter((item) => item !== key)
      : [...completed, key];
    setCompleted(next);
    localStorage.setItem(
      `dev-nexus-roadmap-${selectedId}`,
      JSON.stringify(next),
    );
  }

  function chooseGroup(nextGroup: string) {
    setGroup(nextGroup);
    const firstMatch = roadmaps.find(
      (roadmap) => nextGroup === "الكل" || roadmap.category === nextGroup,
    );
    if (firstMatch) setSelectedId(firstMatch.id);
  }

  function resetProgress() {
    setCompleted([]);
    localStorage.removeItem(`dev-nexus-roadmap-${selectedId}`);
    localStorage.removeItem(`codezx-roadmap-${selectedId}`);
  }

  const progress = Math.min(
    100,
    Math.round((completed.length / selectedSteps.length) * 100),
  );

  return (
    <div className="roadmap-explorer">
      <aside className="roadmap-index">
        <div className="roadmap-index-head">
          <div>
            <span>CAREER INDEX</span>
            <strong>{tr("اختر مسارك", "Choose your path")}</strong>
          </div>
          <b>{roadmaps.length}</b>
        </div>
        <div className="roadmap-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tr("ابحث عن تخصص...", "Search a career...")}
            aria-label={tr("ابحث عن خريطة طريق", "Search roadmaps")}
          />
        </div>
        <div
          className="roadmap-groups"
          aria-label={tr("تصفية خرائط الطريق", "Filter roadmaps")}
        >
          {groupDefinitions.map((item) => (
            <button
              type="button"
              key={item.id}
              className={group === item.id ? "active" : ""}
              onClick={() => chooseGroup(item.id)}
            >
              <b aria-hidden="true">{item.glyph}</b>
              {tr(item.id, item.en)}
            </button>
          ))}
        </div>
        <div className="roadmap-result-count">
          <span>{visible.length}</span> {tr("مسارًا مطابقًا", "matching paths")}
        </div>
        <div className="roadmap-list">
          {visible.length ? (
            visible.map((roadmap, index) => {
              const english = englishRoadmaps[roadmap.id];
              return (
                <button
                  type="button"
                  key={roadmap.id}
                  className={selected.id === roadmap.id ? "active" : ""}
                  onClick={() => setSelectedId(roadmap.id)}
                  aria-pressed={selected.id === roadmap.id}
                >
                  <span>{roadmapGlyphs[roadmap.id]}</span>
                  <div>
                    <strong>{roadmap.title}</strong>
                    <small>
                      {language === "en" ? english.category : roadmap.category}{" "}
                      ·{" "}
                      {language === "en" ? english.duration : roadmap.duration}
                    </small>
                  </div>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </button>
              );
            })
          ) : (
            <div className="roadmap-no-results">
              <span>⌕</span>
              <strong>
                {tr("لا توجد خريطة مطابقة", "No roadmap matched")}
              </strong>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  chooseGroup("الكل");
                }}
              >
                {tr("إظهار كل المسارات", "Show all paths")}
              </button>
            </div>
          )}
        </div>
      </aside>
      <section className="roadmap-canvas">
        <header>
          <div className="roadmap-title-block">
            <span className="roadmap-title-glyph" aria-hidden="true">
              {roadmapGlyphs[selected.id]}
            </span>
            <div>
              <span className="detail-kicker">
                DEV NEXUS CAREER MAP · {selectedCategory}
              </span>
              <h2>{selected.title}</h2>
              <p>{selectedSummary}</p>
            </div>
          </div>
          <div className="roadmap-progress">
            <div>
              <strong>{progress}%</strong>
              <span>
                {completed.length}/{selectedSteps.length}
              </span>
            </div>
            <span>
              {tr(
                "تقدمك محفوظ على هذا الجهاز",
                "Progress saved on this device",
              )}
            </span>
            <i aria-hidden="true">
              <b style={{ width: `${progress}%` }} />
            </i>
            <button
              type="button"
              onClick={resetProgress}
              disabled={!completed.length}
            >
              {tr("إعادة ضبط التقدم", "Reset progress")}
            </button>
          </div>
        </header>

        <div className="roadmap-legend">
          <span>
            <i className="core" />
            {tr("مرحلة أساسية", "Core stage")}
          </span>
          <span>
            <i className="optional" />
            {tr("مهارات المرحلة", "Stage skills")}
          </span>
          <span>
            <i className="complete" />
            {tr("مرحلة مكتملة", "Completed stage")}
          </span>
          <b>
            {tr(
              "اضغط على البطاقة لتحديث تقدمك",
              "Select a card to update your progress",
            )}
          </b>
        </div>

        <div className="map-board" dir="ltr">
          <div className="map-terminal start">
            {tr("ابدأ من هنا", "START HERE")}
          </div>
          <div className="map-flow">
            {selectedSteps.map((step, index) => {
              const done = completed.includes(String(index));
              const branches = step.detail
                .split(/[،,]/)
                .map((item) => item.trim())
                .filter(Boolean);
              return (
                <div
                  className={`map-stage ${index % 2 ? "right" : "left"}`}
                  key={step.title}
                  data-roadmap={selected.id}
                >
                  <span className="map-stage-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className={`map-node ${done ? "done" : ""}`}
                    onClick={() => toggleStep(index)}
                    aria-pressed={done}
                    aria-label={`${step.title} — ${done ? tr("مكتملة", "completed") : tr("وضع علامة مكتمل", "mark complete")}`}
                  >
                    <small>
                      {tr("المرحلة", "STEP")}{" "}
                      {String(index + 1).padStart(2, "0")}
                    </small>
                    <strong dir="auto">{step.title}</strong>
                    <span>
                      {done
                        ? tr("✓ اكتملت هذه المرحلة", "✓ Stage completed")
                        : tr("حددها عند الإكمال", "Mark when completed")}
                    </span>
                  </button>
                  <div className="map-branch">
                    {branches.map((branch) => (
                      <span key={branch}>{branch}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="map-terminal finish">
            {progress === 100
              ? tr("جاهز للبناء ✓", "READY TO BUILD ✓")
              : tr("أكمل المسار", "COMPLETE THE PATH")}
          </div>
        </div>

        <footer>
          <div>
            <strong>{selectedLevel}</strong>
            <span>{tr("المستوى المقترح", "Suggested level")}</span>
          </div>
          <div>
            <strong>{selectedDuration}</strong>
            <span>{tr("المدة التقريبية", "Estimated duration")}</span>
          </div>
          <div>
            <strong>{selectedSteps.length}</strong>
            <span>{tr("مراحل أساسية", "core stages")}</span>
          </div>
          <a
            href={selected.roadmapUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {tr(
              "فتح المرجع الرسمي على roadmap.sh",
              "Open the official roadmap.sh reference",
            )}{" "}
            ↗
          </a>
        </footer>
      </section>
    </div>
  );
}
