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

type Props = {
  value: Record<string, boolean>; // e.g. { canManageUsers: true, canManageClients: false }
  onChange: (newValue: Record<string, boolean>) => void;
};

export function AccessScopeSelector({ value, onChange }: Readonly<Props>) {
  const toggleScope = (key: string) => {
    onChange({
      ...value,
      [key]: !value[key],
    });
  };

  const selectedCount = Object.values(value).filter(Boolean).length;
  const allSelected = selectedCount === ACCESS_SCOPE_OPTIONS.length;

  const toggleAll = () => {
    const newValue: Record<string, boolean> = {};
    ACCESS_SCOPE_OPTIONS.forEach((scope) => {
      newValue[scope.key] = !allSelected;
    });
    onChange(newValue);
  };

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
        <PopoverContent className="w-64 p-2">
          <div className="flex flex-col gap-2">
            {/* Check All Option */}
            <label className="flex items-center gap-2 text-sm font-medium border-b pb-2 mb-2">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              {allSelected ? "Uncheck All" : "Check All"}
            </label>

            {/* Individual Options */}
            {ACCESS_SCOPE_OPTIONS.map((scope) => (
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
