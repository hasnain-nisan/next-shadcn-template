import { ApiEndpoints } from "@/types/api.types";

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS: ApiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    profile: "/auth/profile",
  },
  notes: {
    getAll: "/notes",
    getById: (id: string) => `/notes/${id}`,
    create: "/notes",
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
    toggleFavorite: (id: string) => `/notes/${id}/favorite`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  NOTES: "/notes",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export const DRAWER_WIDTH = 250;

export const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
  },
  {
    title: "Note",
    icon: "note_alt",
    path: "/dashboard/note",
  },
  {
    title: "Profile",
    icon: "person",
    path: "/dashboard/profile",
  },
];


export const NOTE_ROUTES: Record<string, string> = {
  CREATE: '/dashboard/note/create',
  EDIT: '/dashboard/note/edit/[id]',
}