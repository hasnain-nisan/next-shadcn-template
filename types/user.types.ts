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
  createdBy: UserRef;
  updatedBy: UserRef | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
