import { API_BASE_URL } from "@/lib/constants";
import { ApiError, ApiResponse } from "@/types/api.types";
import { getSession } from "next-auth/react";

export async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  const token = session?.accessToken;
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("Making API request to:", url);

  const isFormData = options.body instanceof FormData;

  // Build headers
  const defaultHeaders: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // ✅ only add JSON header if not FormData
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> | ApiError = await response.json();

    if (!response.ok) {
      throw new Error((data as ApiError).message || "Request failed");
    }

    return (data as ApiResponse<T>).data;
  } catch (error) {
    console.log("API request error:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}
