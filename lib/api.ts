export type ApiLessonSummary = {
  id: number;
  title: string;
  slug: string;
  duration_seconds: number;
  position: number;
  is_preview: boolean;
};

export type ApiCourse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  thumbnail_url: string | null;
  lessons_count?: number;
  lessons?: ApiLessonSummary[];
};

export type CatalogResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  source: string;
  meta: string;
  tag: string;
};

export type LessonProgressSummary = {
  lesson_id: number;
  watched_seconds: number;
  completed: boolean;
  completed_at: string | null;
};

export type EnrollmentResponse = {
  message: string;
  enrollment: {
    id: number;
    status: "active" | "completed";
    progress_percent: number;
    course: {
      id: number;
      title: string;
      slug: string;
    };
  };
};

export type LearningCourseResponse = {
  course: ApiCourse;
  enrollment: {
    id: number;
    status: "active" | "completed";
    progress_percent: number;
    enrolled_at: string | null;
    completed_at: string | null;
  };
  lesson_progress: LessonProgressSummary[];
};

export type LessonResponse = {
  lesson: ApiLessonSummary & {
    content: string | null;
    video_url: string | null;
    course: {
      id: number;
      title: string;
      slug: string;
    };
  };
  progress: {
    watched_seconds: number;
    completed: boolean;
    completed_at: string | null;
  };
  enrolled: boolean;
  can_update_progress: boolean;
};

export type ProgressResponse = {
  message: string;
  lesson_progress: LessonProgressSummary;
  course_progress_percent: number;
};

type ApiEnvelope<T> = {
  data: T;
};

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export class AcademyApi {
  private token: string | null = null;

  constructor(token?: string | null) {
    this.token = token ?? null;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    if (!API_BASE) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      cache: init?.cache ?? "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(this.token
          ? {
              Authorization: `Bearer ${this.token}`,
            }
          : {}),
        ...init?.headers,
      },
    });

    const payload: unknown = await response.json().catch(() => ({
      message: "The API returned an unreadable response",
    }));

    if (!response.ok) {
      const errorPayload = payload as ApiErrorPayload;
      const validationMessage = Object.values(
        errorPayload.errors ?? {},
      ).flat()[0];

      throw new ApiRequestError(
        errorPayload.message ?? validationMessage ?? "تعذّر الاتصال بالخادم",
        response.status,
      );
    }

    return payload as T;
  }

  async courses(params?: {
    search?: string;
    category?: string;
    level?: string;
  }) {
    const query = new URLSearchParams();

    if (params?.search) {
      query.set("search", params.search);
    }

    if (params?.category) {
      query.set("category", params.category);
    }

    if (params?.level) {
      query.set("level", params.level);
    }

    const queryString = query.toString();
    const path = queryString ? `/courses?${queryString}` : "/courses";

    return this.request<ApiEnvelope<ApiCourse[]>>(path);
  }

  async course(slug: string) {
    return this.request<ApiEnvelope<ApiCourse>>(
      `/courses/${encodeURIComponent(slug)}`,
    );
  }

  async learningCourse(slug: string) {
    return this.request<LearningCourseResponse>(
      `/courses/${encodeURIComponent(slug)}/learning`,
    );
  }

  async lesson(lessonId: number) {
    return this.request<LessonResponse>(`/lessons/${lessonId}`);
  }

  async catalog(type: "books" | "courses" | "articles", search = "") {
    return this.request<ApiEnvelope<CatalogResource[]>>(
      `/catalog/${type}?search=${encodeURIComponent(search)}`,
    );
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.request<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        device_name: "react-web",
      }),
    });
  }

  async login(input: { email: string; password: string }) {
    return this.request<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        device_name: "react-web",
      }),
    });
  }

  async dashboard() {
    return this.request<{
      stats: {
        active_courses: number;
        completed_courses: number;
        average_progress: number;
      };
      enrollments: Array<{
        id: number;
        status: "active" | "completed";
        progress_percent: number;
        course: {
          id: number;
          title: string;
          slug: string;
          level: string;
        };
      }>;
    }>("/dashboard");
  }

  async logout() {
    return this.request<{
      message: string;
    }>("/auth/logout", {
      method: "POST",
    });
  }

  async enroll(courseId: number) {
    return this.request<EnrollmentResponse>(`/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  async updateProgress(
    lessonId: number,
    watchedSeconds: number,
    completed: boolean,
  ) {
    return this.request<ProgressResponse>(`/lessons/${lessonId}/progress`, {
      method: "PUT",
      body: JSON.stringify({
        watched_seconds: watchedSeconds,
        completed,
      }),
    });
  }
}

export const academyApi = new AcademyApi();
