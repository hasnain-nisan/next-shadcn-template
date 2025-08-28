import {
  ArrowUpDown,
  Calendar,
  Mail,
  MoreHorizontal,
  Shield,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccessScopeBadges } from "./AccessScopeBadges";

export const TableColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        <User className="mr-2 h-4 w-4" />
        Role
      </Button>
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("role") === "SuperAdmin" ? "default" : "secondary"
        }
      >
        {row.getValue("role")}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "accessScopes",
    header: () => (
      <div className="flex items-center">
        <Shield className="mr-2 h-4 w-4" />
        Permissions
      </div>
    ),
    cell: ({ row }) => {
      const accessScopes = row.getValue("accessScopes");
      return <AccessScopeBadges accessScopes={accessScopes} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Created
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt).toLocaleDateString();
      const createdByEmail = row.original.createdBy?.email;

      return (
        <div className="text-sm space-y-1">
          <div className="font-medium text-foreground">{createdAt}</div>
          {createdByEmail && (
            <div className="text-xs text-muted-foreground">
              by {createdByEmail}
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Updated
      </Button>
    ),
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.updatedAt).toLocaleDateString();
      const updatedByEmail = row.original.updatedBy?.email;

      return (
        <div className="text-sm space-y-1">
          <div className="font-medium text-foreground">{updatedAt}</div>
          {updatedByEmail && (
            <div className="text-xs text-muted-foreground">
              by {updatedByEmail}
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
            <DropdownMenuItem>Edit permissions</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
