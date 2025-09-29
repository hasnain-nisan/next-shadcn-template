export interface AccessScopes {
  // User Management
  canAccessUsers?: boolean;
  canCreateUsers?: boolean;
  canUpdateUsers?: boolean;
  canDeleteUsers?: boolean;

  // Client Management
  canAccessClients?: boolean;
  canCreateClients?: boolean;
  canUpdateClients?: boolean;
  canDeleteClients?: boolean;

  // Stakeholder Management
  canAccessStakeholders?: boolean;
  canCreateStakeholders?: boolean;
  canUpdateStakeholders?: boolean;
  canDeleteStakeholders?: boolean;

  // Project Management
  canAccessProjects?: boolean;
  canCreateProjects?: boolean;
  canUpdateProjects?: boolean;
  canDeleteProjects?: boolean;

  // Interview Management
  canAccessInterviews?: boolean;
  canCreateInterviews?: boolean;
  canUpdateInterviews?: boolean;
  canDeleteInterviews?: boolean;

  // TPConfig / Configs
  canAccessConfig?: boolean;
  canCreateConfig?: boolean;
  canUpdateConfig?: boolean;
  canDeleteConfig?: boolean;

  // Admin Settings
  canAccessAdminSettings?: boolean;
  canUpdateAdminSettings?: boolean;
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
