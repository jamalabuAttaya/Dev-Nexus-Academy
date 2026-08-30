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

type ApiEnvelope<T> = {
  data: T;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export class AcademyApi {
  private token: string | null = null;

  constructor(token?: string | null) {
    this.token = token ?? null;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    if (!API_BASE) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
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

    const payload = (await response.json().catch(() => ({
      message: "The API returned an unreadable response",
    }))) as {
      message?: string;
    };

    if (!response.ok) {
      throw new Error(payload.message ?? "تعذّر الاتصال بالخادم");
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

  async catalog(
    type: "books" | "courses" | "articles",
    search = "",
  ) {
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

  async login(input: {
    email: string;
    password: string;
  }) {
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
    return this.request<EnrollmentResponse>(
      `/courses/${courseId}/enroll`,
      {
        method: "POST",
      },
    );
  }

  async updateProgress(
    lessonId: number,
    watchedSeconds: number,
    completed: boolean,
  ) {
    return this.request(
      `/lessons/${lessonId}/progress`,
      {
        method: "PUT",
        body: JSON.stringify({
          watched_seconds: watchedSeconds,
          completed,
        }),
      },
    );
  }
}

export const academyApi = new AcademyApi();