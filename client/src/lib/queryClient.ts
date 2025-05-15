import { useMutation, useQuery, QueryClient, QueryFunction } from "@tanstack/react-query";

// Import your existing utilities directly
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  headers?: Record<string, string>,
): Promise<Response> {
  const requestHeaders: HeadersInit = {};
  
  if (data) {
    requestHeaders["Content-Type"] = "application/json";
  }
  
  if (headers) {
    Object.assign(requestHeaders, headers);
  }
  
  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
   
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Types based on your Auth responses
export interface AuthResponse {
  succeeded: boolean;
  message: string;
  developerId: string;
  token: string;
  isOnboardingComplete: boolean;
}

export interface AuthData {
  email: string;
  password: string;
}

// Base API URL
export const API_BASE_URL = "https://prismon-api-b2aeetbkezhwdhg3.southafricanorth-01.azurewebsites.net/api";

/**
 * Generic API endpoint interface
 */
interface ApiEndpoint<TParams = void, TResponse = unknown, TBody = unknown> {
  /** Method for the API call */
  method: string;
  /** Path to append to base URL */
  path: string;
  /** Function to construct the URL with parameters */
  getUrl: (params: TParams) => string;
  /** Function to transform the response */
  transformResponse?: (data: any) => TResponse;
}

/**
 * Create an API endpoint definition
 */
function createEndpoint<TParams = void, TResponse = unknown, TBody = unknown>(
  method: string,
  path: string,
  options: {
    getUrl?: (params: TParams) => string;
    transformResponse?: (data: any) => TResponse;
  } = {}
): ApiEndpoint<TParams, TResponse, TBody> {
  return {
    method,
    path,
    getUrl: options.getUrl || ((params) => `${API_BASE_URL}/${path}`),
    transformResponse: options.transformResponse,
  };
}

/**
 * Authentication utility functions
 */
export function getTokenPayload(token: string): any {
  try {
    // Split the token and get the payload part (second part)
    const base64Url = token.split(".")[1];
    // Replace characters that are URL-safe with normal base64 characters and pad if needed
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    throw new Error("Invalid token format");
  }
}

export function getAuthHeader(): { Authorization: string } | undefined {
  const token = localStorage.getItem("developerToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/**
 * API Endpoints
 */
export const api = {
  auth: {
    login: createEndpoint<void, AuthResponse, AuthData>("POST", "auth/login"),
    register: createEndpoint<void, AuthResponse, AuthData>("POST", "auth/register"),
    logout: createEndpoint<void, void>("POST", "auth/logout"),
    me: createEndpoint<void, any>("GET", "auth/me"),
    getApps: createEndpoint<void, any[]>("GET", "apps"),
  },
  
  // Add your actual endpoints here
  developers: {
    getProfile: createEndpoint<void, any>("GET", "developers/profile"),
    updateProfile: createEndpoint<void, any, any>("PUT", "developers/profile"),
  },
  
  // Example of other endpoints you might have
  projects: {
    getAll: createEndpoint<void, any[]>("GET", "projects"),
    getById: createEndpoint<{ id: string }, any>("GET", "projects", {
      getUrl: ({ id }) => `${API_BASE_URL}/projects/${id}`,
    }),
    create: createEndpoint<void, any, any>("POST", "projects"),
    update: createEndpoint<{ id: string }, any, any>("PUT", "projects", {
      getUrl: ({ id }) => `${API_BASE_URL}/projects/${id}`,
    }),
    delete: createEndpoint<{ id: string }, void>("DELETE", "projects", {
      getUrl: ({ id }) => `${API_BASE_URL}/projects/${id}`,
    }),
  },
};

/**
 * Hook to use a GET API endpoint with React Query
 */
export function useApiQuery<TParams, TResponse>(
  endpoint: ApiEndpoint<TParams, TResponse>,
  params: TParams,
  options: {
    enabled?: boolean;
    onSuccess?: (data: TResponse) => void;
    onError?: (error: Error) => void;
    refetchInterval?: number | false;
    select?: (data: TResponse) => any;
  } = {}
) {
  const url = endpoint.getUrl(params);
  
  return useQuery({
    queryKey: [url],
    enabled: options.enabled,
     //@ts-ignore
    onSuccess: options.onSuccess,
    onError: options.onError,
    refetchInterval: options.refetchInterval,
    select: options.select,
    queryFn: async ({ queryKey }) => {
      const headers: HeadersInit = {};
      const authHeader = getAuthHeader();
      
      if (authHeader) {
        Object.assign(headers, authHeader);
      }
      
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
      
      const data = await res.json();
      return endpoint.transformResponse ? endpoint.transformResponse(data) : data;
    },
  });
}

/**
 * Hook to use a mutation API endpoint with React Query
 */
export function useApiMutation<TParams, TResponse, TBody>(
  endpoint: ApiEndpoint<TParams, TResponse, TBody>,
  options: {
    onSuccess?: (data: TResponse) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[];
  } = {}
) {
  return useMutation({
    mutationFn: async ({ params, body }: { params: TParams; body?: TBody }) => {
      const url = endpoint.getUrl(params);
      const headers = getAuthHeader();
      const res = await apiRequest(endpoint.method, url, body, headers);
      const data = await res.json();
      return endpoint.transformResponse ? endpoint.transformResponse(data) : data;
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [query] });
        });
      }
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: options.onError,
  });
}

// Hook for developer profile
export function useDeveloperProfile() {
  return useApiQuery(api.developers.getProfile, undefined, {
    onError: (error) => {
      console.error("Failed to fetch developer profile:", error);
    }
  });
}

// Hook for updating developer profile
export function useUpdateDeveloperProfile() {
  return useApiMutation(api.developers.updateProfile, {
    invalidateQueries: [`${API_BASE_URL}/developers/profile`],
    onError: (error) => {
      console.error("Failed to update developer profile:", error);
    }
  });
}

