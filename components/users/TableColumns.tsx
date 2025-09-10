import {
  Calendar,
  Mail,
  MoreHorizontal,
  Shield,
  User as UserIcon,
} from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import type { AccessScopes, User } from "@/types/user.types";
import { useSession } from "next-auth/react";

export const GetTableColumns = ({
  setOpenDetailsModal,
  setSelectedUser,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setOpenDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<User>[] => {
  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};

  const canViewUsers = accessScopes.canAccessUsers ?? false;
  const canUpdateUsers = accessScopes.canUpdateUsers ?? false;
  const canDeleteUsers = accessScopes.canDeleteUsers ?? false;

  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
      ),
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        const isDeleted = row.original.isDeleted;

        return isDeleted ? (
          <Tooltip>
            <TooltipTrigger asChild className="ml-3">
              <span className="font-medium cursor-help text-muted-foreground">
                {email}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="text-xs">This user is deleted</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="font-medium ml-3">{email}</span>
        );
      },

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
          <UserIcon className="h-4 w-4" />
          Role
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3">
          <Badge
            variant={
              row.getValue("role") === "SuperAdmin" ? "default" : "secondary"
            }
          >
            {row.getValue("role")}
          </Badge>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "accessScopes",
    //   header: () => (
    //     <div className="flex items-center">
    //       <Shield className="mr-2 h-4 w-4" />
    //       Permissions
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const accessScopes = row.getValue("accessScopes");
    //     return <AccessScopeBadges accessScopes={accessScopes as AccessScopes} />;
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Calendar className="h-4 w-4" />
          Created
        </Button>
      ),
      cell: ({ row }) => {
        const createdAt = new Date(row.original.createdAt).toLocaleDateString();
        const createdByEmail = row.original.createdBy?.email;

        return (
          <div className="text-sm space-y-1 ml-3">
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
          <Calendar className="h-4 w-4" />
          Updated
        </Button>
      ),
      cell: ({ row }) => {
        const updatedAt = new Date(row.original.updatedAt).toLocaleDateString();
        const updatedByEmail = row.original.updatedBy?.email;

        return (
          <div className="text-sm space-y-1 ml-3">
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
              <DropdownMenuSeparator />

              {/* View */}
              <DropdownMenuItem
                disabled={!canViewUsers}
                className={`flex items-center gap-2 ${
                  !canViewUsers
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canViewUsers) {
                    setSelectedUser(user);
                    setOpenDetailsModal(true);
                  }
                }}
              >
                <IconEye size={16} />
                View user details
              </DropdownMenuItem>

              {/* Update */}
              <DropdownMenuItem
                disabled={
                  !canUpdateUsers ||
                  user.role === "SuperAdmin" ||
                  user.isDeleted
                }
                className={`flex items-center gap-2 ${
                  !canUpdateUsers ||
                  user.role === "SuperAdmin" ||
                  user.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (
                    canUpdateUsers &&
                    user.role !== "SuperAdmin" &&
                    !user.isDeleted
                  ) {
                    setSelectedUser(user);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update user details
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                disabled={
                  !canDeleteUsers ||
                  user.role === "SuperAdmin" ||
                  user.isDeleted
                }
                className={`text-destructive flex items-center gap-2 ${
                  !canDeleteUsers ||
                  user.role === "SuperAdmin" ||
                  user.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (
                    canDeleteUsers &&
                    user.role !== "SuperAdmin" &&
                    !user.isDeleted
                  ) {
                    setSelectedUser(user);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
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
};
