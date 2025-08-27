export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    refresh: string;
    logout: string;
    profile: string;
  };
  notes: {
    getAll: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    toggleFavorite: (id: string) => string;
  };
}
