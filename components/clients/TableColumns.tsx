import { Calendar, MoreHorizontal, Building2, Barcode } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Client } from "@/types/client.types"; // Make sure this type matches your structure
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const GetTableColumns = ({
  setSelectedClient,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<Client>[] => {
  const router = useRouter();

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};

  const canViewClients = accessScopes.canAccessClients ?? false;
  const canUpdateClients = accessScopes.canUpdateClients ?? false;
  const canDeleteClients = accessScopes.canDeleteClients ?? false;

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
              <span className="text-xs">This client is deleted</span>
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
      accessorKey: "clientCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Barcode className="h-4 w-4" />
          Code
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3">
          <Badge variant="outline">{row.getValue("clientCode")}</Badge>
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
        const client = row.original;

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
                disabled={!canViewClients}
                className={`flex items-center gap-2 ${
                  !canViewClients
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canViewClients) {
                    router.push(`/dashboard/clients/${client.id}`);
                  }
                }}
              >
                <IconEye size={16} />
                View client details
              </DropdownMenuItem>

              {/* Update */}
              <DropdownMenuItem
                disabled={!canUpdateClients || client.isDeleted}
                className={`flex items-center gap-2 ${
                  !canUpdateClients || client.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canUpdateClients && !client.isDeleted) {
                    setSelectedClient(client);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update client details
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                disabled={!canDeleteClients || client.isDeleted}
                className={`text-destructive flex items-center gap-2 ${
                  !canDeleteClients || client.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canDeleteClients && !client.isDeleted) {
                    setSelectedClient(client);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
                Delete client
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
