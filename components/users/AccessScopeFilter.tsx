"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type AccessScopeFilterProps = {
  selectedScopes: string[];
  setSelectedScopes: React.Dispatch<React.SetStateAction<string[]>>;
};

const ACCESS_SCOPE_GROUPS = [
  {
    module: "Users",
    scopes: [
      { key: "canAccessUsers", label: "Access Users" },
      { key: "canCreateUsers", label: "Create Users" },
      { key: "canUpdateUsers", label: "Update Users" },
      { key: "canDeleteUsers", label: "Delete Users" },
    ],
  },
  {
    module: "Clients",
    scopes: [
      { key: "canAccessClients", label: "Access Clients" },
      { key: "canCreateClients", label: "Create Clients" },
      { key: "canUpdateClients", label: "Update Clients" },
      { key: "canDeleteClients", label: "Delete Clients" },
    ],
  },
  {
    module: "Stakeholders",
    scopes: [
      { key: "canAccessStakeholders", label: "Access Stakeholders" },
      { key: "canCreateStakeholders", label: "Create Stakeholders" },
      { key: "canUpdateStakeholders", label: "Update Stakeholders" },
      { key: "canDeleteStakeholders", label: "Delete Stakeholders" },
    ],
  },
  {
    module: "Projects",
    scopes: [
      { key: "canAccessProjects", label: "Access Projects" },
      { key: "canCreateProjects", label: "Create Projects" },
      { key: "canUpdateProjects", label: "Update Projects" },
      { key: "canDeleteProjects", label: "Delete Projects" },
    ],
  },
  {
    module: "Interviews",
    scopes: [
      { key: "canAccessInterviews", label: "Access Interviews" },
      { key: "canCreateInterviews", label: "Create Interviews" },
      { key: "canUpdateInterviews", label: "Update Interviews" },
      { key: "canDeleteInterviews", label: "Delete Interviews" },
    ],
  },
  {
    module: "N8N Configs",
    scopes: [
      { key: "canAccessConfig", label: "Access Configs" },
      { key: "canCreateConfig", label: "Create Configs" },
      { key: "canUpdateConfig", label: "Update Configs" },
      { key: "canDeleteConfig", label: "Delete Configs" },
    ],
  },
  {
    module: "Admin Settings",
    scopes: [
      { key: "canAccessAdminSettings", label: "Access Admin Settings" },
      { key: "canUpdateAdminSettings", label: "Update Admin Settings" },
    ],
  },
];

export function AccessScopeFilter({
  selectedScopes,
  setSelectedScopes,
}: Readonly<AccessScopeFilterProps>) {
  const toggleScope = (key: string) => {
    setSelectedScopes((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  return (
    <div className="flex flex-col lg:flex-1">
      <label
        htmlFor="accessScope"
        className="text-sm text-muted-foreground mb-1"
      >
        Access Scope
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-md border px-2 py-1 text-sm justify-between"
          >
            {selectedScopes.length > 0
              ? `${selectedScopes.length} selected`
              : "All Access Scopes"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-2"
          style={{ width: "var(--radix-popover-trigger-width)" }} // match trigger width
        >
          <Accordion type="multiple" className="w-full">
            {ACCESS_SCOPE_GROUPS.map((group) => (
              <AccordionItem
                key={group.module}
                value={group.module}
                className="mb-2"
              >
                <AccordionTrigger className="text-sm font-medium mb-1 border-0 after:hidden after:border-0">
                  {group.module}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-2">
                    {group.scopes.map((scope) => (
                      <label
                        key={scope.key}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={selectedScopes.includes(scope.key)}
                          onCheckedChange={() => toggleScope(scope.key)}
                        />
                        {scope.label}
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </PopoverContent>
      </Popover>
    </div>
  );
}
