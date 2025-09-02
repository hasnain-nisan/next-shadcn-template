export interface AccessScopes {
  canManageUsers: boolean;
  canManageClients: boolean;
  canManageProjects: boolean;
  canManageInterviews: boolean;
  canManageStakeholders: boolean;
}

export interface UserRef {
  id: string;
  email: string;
  role: string;
  accessScopes: AccessScopes;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface User {
  id: string;
  email: string;
  role: string;
  accessScopes: AccessScopes;
  createdBy: UserRef | null;
  updatedBy: UserRef | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  password?: string; // Only for creating/updating users, not returned from API
  confirmPassword?: string; // Only for creating/updating users, not returned from API
}
