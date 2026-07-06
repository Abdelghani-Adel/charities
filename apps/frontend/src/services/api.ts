const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

function getAcceptLanguage(): string {
  try {
    const lang = localStorage.getItem("i18nextLng") || navigator.language || "ar";
    return lang.split("-")[0] === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    headers["Accept-Language"] = getAcceptLanguage();

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();
    if (!res.ok) {
      if (res.status === 401 && this.token) {
        this.clearToken();
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_expires_at");
        window.location.href = "/login";
      }
      throw new ApiError(json.message ?? "Request failed", json.code, json.correlationId);
    }
    return json.data;
  }

  get<T>(path: string) {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>("POST", path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public correlationId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = new ApiClient();
