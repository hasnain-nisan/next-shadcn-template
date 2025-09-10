"use client";

import { Badge } from "@/components/ui/badge";

export interface AccessScopeBadgesProps {
  accessScopes: {
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

    // TPConfig Module
    canAccessConfig?: boolean;
    canCreateConfig?: boolean;
    canUpdateConfig?: boolean;
    canDeleteConfig?: boolean;

    // AdminSettings Module
    canAccessAdminSettings?: boolean;
    canUpdateAdminSettings?: boolean;
  };
}

export function AccessScopeBadges({
  accessScopes,
}: Readonly<AccessScopeBadgesProps>) {
  const scopes = [
    { key: "canAccessUsers", label: "Users", enabled: accessScopes.canAccessUsers },
    { key: "canAccessClients", label: "Clients", enabled: accessScopes.canAccessClients },
    { key: "canAccessProjects", label: "Projects", enabled: accessScopes.canAccessProjects },
    { key: "canAccessInterviews", label: "Interviews", enabled: accessScopes.canAccessInterviews },
    { key: "canAccessStakeholders", label: "Stakeholders", enabled: accessScopes.canAccessStakeholders },
    { key: "canAccessConfig", label: "N8N Configs", enabled: accessScopes.canAccessConfig },
    { key: "canAccessAdminSettings", label: "Settings", enabled: accessScopes.canAccessAdminSettings },
  ];

  const enabledScopes = scopes.filter((scope) => scope.enabled);

  return (
    <div className="flex flex-wrap gap-1">
      {enabledScopes.length > 0 ? (
        enabledScopes.map((scope) => (
          <Badge key={scope.key} variant="secondary" className="text-xs">
            {scope.label}
          </Badge>
        ))
      ) : (
        <Badge variant="outline" className="text-xs">
          No permissions
        </Badge>
      )}
    </div>
  );
}