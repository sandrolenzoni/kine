import ApiError from "./api-error.js";
import { queryString } from "./query-string.js";

export type ClientOptions = {
  baseUrl: string;
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
};

export type RequestConfig = {
  params?: Record<string, any>;
  headers?: Record<string, string>;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      (data as { detail?: string })?.detail || response.statusText,
      response.status,
      response.statusText,
      data,
    );
  }

  return data as T;
};

export const createClient = (options: ClientOptions) => {
  const request = async <T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> => {
    const globalHeaders = options.headers ? await options.headers() : {};

    // Resolve URL com parâmetros de query
    const searchParams = config?.params ? queryString(config.params) : "";
    const finalUrl = `${options.baseUrl}${url}${searchParams}`;

    const response = await fetch(finalUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...globalHeaders,
        ...config?.headers,
      },
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
    });

    return parseResponse<T>(response);
  };

  return {
    get: <T>(url: string, config?: RequestConfig) =>
      request<T>("GET", url, undefined, config),
    post: <T>(url: string, data?: any, config?: RequestConfig) =>
      request<T>("POST", url, data, config),
    put: <T>(url: string, data?: any, config?: RequestConfig) =>
      request<T>("PUT", url, data, config),
    patch: <T>(url: string, data?: any, config?: RequestConfig) =>
      request<T>("PATCH", url, data, config),
    delete: <T>(url: string, config?: RequestConfig) =>
      request<T>("DELETE", url, undefined, config),
  };
};

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || "";
  if (!url) console.warn("API_URL não definida nas variáveis de ambiente.");
  return url;
};

export const client = createClient({ baseUrl: getBaseUrl() });
