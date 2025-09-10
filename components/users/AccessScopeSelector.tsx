"use client";

import { useEffect } from "react";
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
import { ROLE_ACCESS_PRESETS } from "@/types/global.types";

type Props = {
  type: "create" | "update";
  role: string;
  value: Record<string, boolean>;
  onChange: (newValue: Record<string, boolean>) => void;
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

export function AccessScopeSelector({
  type,
  role,
  value,
  onChange,
}: Readonly<Props>) {
  const toggleScope = (key: string) => {
    onChange({
      ...value,
      [key]: !value[key],
    });
  };

  const allScopeKeys = ACCESS_SCOPE_GROUPS.flatMap((g) =>
    g.scopes.map((s) => s.key)
  );

  const selectedCount = allScopeKeys.filter((key) => value[key]).length;
  const allSelected = selectedCount === allScopeKeys.length;

  const toggleAll = () => {
    const newValue: Record<string, boolean> = {};
    allScopeKeys.forEach((key) => {
      newValue[key] = !allSelected;
    });
    onChange(newValue);
  };

  // Auto-update scopes when role changes
  useEffect(() => {
    if(type === "update") return;
    if (role in ROLE_ACCESS_PRESETS) {
      const presetKeys = ROLE_ACCESS_PRESETS[role];
      const newValue: Record<string, boolean> = {};
      allScopeKeys.forEach((key) => {
        newValue[key] = presetKeys.includes(key);
      });
      onChange(newValue);
    }
  }, [role]);

  return (
    <div className="flex flex-col">
      <label htmlFor="accessScope" className="text-sm mb-1">
        Access Scopes
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded border px-2 py-1 text-sm justify-between"
          >
            <p className="text-muted-foreground">
              {selectedCount > 0
                ? `${selectedCount} selected`
                : "No Access Scopes Selected"}
            </p>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-2"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          {/* Check All */}
          <label className="flex items-center gap-2 text-sm font-medium border-b pb-2 mb-2">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            {allSelected ? "Uncheck All" : "Check All"}
          </label>

          {/* Accordion for grouped scopes */}
          <Accordion type="multiple" className="w-full">
            {ACCESS_SCOPE_GROUPS.map((group) => (
              <AccordionItem
                key={group.module}
                value={group.module}
                className="mb-2"
              >
                <AccordionTrigger className="text-sm font-medium border-0 after:hidden">
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
                          checked={!!value[scope.key]}
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
