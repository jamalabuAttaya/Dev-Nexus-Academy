export type HomeCourse = {
  id: number;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  categoryId: string;
  level: string;
  levelEn: string;
  lessons: number;
  hours: string;
  hoursEn: string;
  accent: string;
  code: string;
  description: string;
  descriptionEn: string;
};

export const homeCourses: HomeCourse[] = [
  {
    id: 1,
    title: "أساسيات HTML و CSS",
    titleEn: "HTML & CSS Foundations",
    category: "تطوير الويب",
    categoryEn: "Web Development",
    categoryId: "web",
    level: "مبتدئ",
    levelEn: "Beginner",
    lessons: 24,
    hours: "8 ساعات",
    hoursEn: "8 hours",
    accent: "mint",
    code: "</>",
    description:
      "ابنِ صفحات متجاوبة من الصفر وتعلّم أساسيات الويب الدلالية وتنسيق الواجهات الحديثة.",
    descriptionEn:
      "Build responsive pages from scratch while learning semantic HTML and modern CSS layout.",
  },
  {
    id: 2,
    title: "JavaScript من الصفر",
    titleEn: "JavaScript from Scratch",
    category: "جافاسكربت",
    categoryEn: "JavaScript",
    categoryId: "javascript",
    level: "مبتدئ",
    levelEn: "Beginner",
    lessons: 36,
    hours: "14 ساعة",
    hoursEn: "14 hours",
    accent: "yellow",
    code: "JS",
    description:
      "افهم المتغيرات والدوال وDOM والبرمجة غير المتزامنة عبر تمارين ومشاريع قصيرة.",
    descriptionEn:
      "Understand variables, functions, the DOM, and asynchronous programming through focused practice.",
  },
  {
    id: 3,
    title: "React للتطبيقات الحديثة",
    titleEn: "React for Modern Applications",
    category: "React",
    categoryEn: "React",
    categoryId: "react",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 42,
    hours: "18 ساعة",
    hoursEn: "18 hours",
    accent: "blue",
    code: "⚛",
    description:
      "أنشئ تطبيقات React عملية باستخدام المكوّنات وHooks وإدارة الحالة وربط الواجهات البرمجية.",
    descriptionEn:
      "Create practical React apps with components, Hooks, state management, and API integration.",
  },
  {
    id: 4,
    title: "Laravel API باحتراف",
    titleEn: "Professional Laravel APIs",
    category: "Laravel",
    categoryEn: "Laravel",
    categoryId: "laravel",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 38,
    hours: "16 ساعة",
    hoursEn: "16 hours",
    accent: "coral",
    code: "L",
    description:
      "طوّر REST API آمنة باستخدام Laravel وSanctum وقواعد البيانات وسياسات الصلاحيات.",
    descriptionEn:
      "Develop secure REST APIs with Laravel, Sanctum, databases, validation, and authorization policies.",
  },
  {
    id: 5,
    title: "TypeScript للمطورين",
    titleEn: "TypeScript for Developers",
    category: "جافاسكربت",
    categoryEn: "JavaScript",
    categoryId: "javascript",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 28,
    hours: "10 ساعات",
    hoursEn: "10 hours",
    accent: "violet",
    code: "TS",
    description:
      "اكتب شيفرة أكثر أمانًا ووضوحًا وتعلّم الأنواع والواجهات والأنماط المتقدمة.",
    descriptionEn:
      "Write safer, clearer code while learning types, interfaces, generics, and advanced patterns.",
  },
  {
    id: 6,
    title: "مشروع Full Stack عملي",
    titleEn: "Practical Full-Stack Project",
    category: "مشاريع",
    categoryEn: "Projects",
    categoryId: "projects",
    level: "متقدم",
    levelEn: "Advanced",
    lessons: 32,
    hours: "22 ساعة",
    hoursEn: "22 hours",
    accent: "cream",
    code: "{•}",
    description:
      "ابنِ منصة تعليم مصغّرة بواجهة React وخلفية Laravel، من التخطيط حتى النشر.",
    descriptionEn:
      "Build a compact learning platform with React and Laravel, from planning through deployment.",
  },
];

export const homeCourseFilters = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "web", ar: "تطوير الويب", en: "Web Development" },
  { id: "javascript", ar: "جافاسكربت", en: "JavaScript" },
  { id: "react", ar: "React", en: "React" },
  { id: "laravel", ar: "Laravel", en: "Laravel" },
  { id: "projects", ar: "مشاريع", en: "Projects" },
] as const;
