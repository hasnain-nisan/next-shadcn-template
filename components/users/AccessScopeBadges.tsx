"use client";

import { Badge } from "@/components/ui/badge";

interface AccessScopeBadgesProps {
  accessScopes: {
    canManageUsers: boolean;
    canManageClients: boolean;
    canManageProjects: boolean;
    canManageInterviews: boolean;
    canManageStakeholders: boolean;
  };
}

export function AccessScopeBadges({ accessScopes }: Readonly<AccessScopeBadgesProps>) {
  const scopes = [
    {
      key: "canManageUsers",
      label: "Users",
      enabled: accessScopes.canManageUsers,
    },
    {
      key: "canManageClients",
      label: "Clients",
      enabled: accessScopes.canManageClients,
    },
    {
      key: "canManageProjects",
      label: "Projects",
      enabled: accessScopes.canManageProjects,
    },
    {
      key: "canManageInterviews",
      label: "Interviews",
      enabled: accessScopes.canManageInterviews,
    },
    {
      key: "canManageStakeholders",
      label: "Stakeholders",
      enabled: accessScopes.canManageStakeholders,
    },
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
