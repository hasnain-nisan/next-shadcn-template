import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const ACCESS_SCOPE_OPTIONS = [
  { key: "canManageUsers", label: "Manage Users" },
  { key: "canManageClients", label: "Manage Clients" },
  { key: "canManageProjects", label: "Manage Projects" },
  { key: "canManageInterviews", label: "Manage Interviews" },
  { key: "canManageStakeholders", label: "Manage Stakeholders" },
];

export function AccessScopeFilter({
  selectedScopes,
  setSelectedScopes,
}: Readonly<{
  selectedScopes: string[];
  setSelectedScopes: (scopes: string[]) => void;
}>) {
  const toggleScope = (key: string) => {
    setSelectedScopes((prev: string[]) =>
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
            className="w-full rounded border px-2 py-1 text-sm justify-between"
          >
            {selectedScopes.length > 0
              ? `${selectedScopes.length} selected`
              : "All Access Scopes"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="flex flex-col gap-2">
            {ACCESS_SCOPE_OPTIONS.map((scope) => (
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
