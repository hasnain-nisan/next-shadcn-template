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
  users: {
    getAll: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    // getById: (id: string) => string;
    // toggleFavorite: (id: string) => string;
  };
  clients: {
    getAll: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    // toggleFavorite: (id: string) => string;
  };
  clientStakeholders: {
    getAll: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    // toggleFavorite: (id: string) => string;
  };
}
