import { Calendar, MoreHorizontal, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  IconBriefcase,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ClientStakeholder } from "@/types/stakeholder.types";
import { useSession } from "next-auth/react";

export const GetTableColumns = ({
  setSelectedStakeholder,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setSelectedStakeholder: React.Dispatch<
    React.SetStateAction<ClientStakeholder | null>
  >;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<ClientStakeholder>[] => {
  const router = useRouter();

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};

  const canViewStakeholders = accessScopes.canAccessStakeholders ?? false;
  const canUpdateStakeholders = accessScopes.canUpdateStakeholders ?? false;
  const canDeleteStakeholders = accessScopes.canDeleteStakeholders ?? false;

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Building2 className="h-4 w-4" />
          Name
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const isDeleted = row.original.isDeleted;

        return isDeleted ? (
          <Tooltip>
            <TooltipTrigger asChild className="ml-3">
              <span className="font-medium cursor-help text-muted-foreground">
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="text-xs">This stakeholder is deleted</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="font-medium ml-3">{name}</span>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "client.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <IconBriefcase className="h-4 w-4" />
          Client
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          {row.original.client?.name || "—"}
        </div>
      ),
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
        const stakeholder = row.original;

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
              <DropdownMenuItem
                className={`flex items-center gap-2 ${
                  !canViewStakeholders
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canViewStakeholders) {
                    router.push(
                      `/dashboard/client-stakeholders/${stakeholder.id}`
                    );
                  }
                }}
              >
                <IconEye size={16} />
                View stakeholder details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canUpdateStakeholders || stakeholder.isDeleted}
                className={`flex items-center gap-2 ${
                  !canUpdateStakeholders || stakeholder.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canUpdateStakeholders && !stakeholder.isDeleted) {
                    setSelectedStakeholder(stakeholder);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update stakeholder
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canDeleteStakeholders || stakeholder.isDeleted}
                className={`text-destructive flex items-center gap-2 ${
                  !canDeleteStakeholders || stakeholder.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if ( canDeleteStakeholders && !stakeholder.isDeleted) {
                    setSelectedStakeholder(stakeholder);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
                Delete stakeholder
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
