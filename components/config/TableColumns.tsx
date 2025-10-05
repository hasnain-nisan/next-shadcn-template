import { Calendar, MoreHorizontal, FileCog, Layers3 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Config } from "@/types/config.types";
import { useSession } from "next-auth/react";

export const GetTableColumns = ({
  setSelectedConfig,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setSelectedConfig: React.Dispatch<React.SetStateAction<Config | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<Config>[] => {
  const router = useRouter();
  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};

  const canViewConfigs = accessScopes.canAccessConfig ?? false;
  const canUpdateConfigs = accessScopes.canUpdateConfig ?? false;
  const canDeleteConfigs = accessScopes.canDeleteConfig ?? false;

  return [
    {
      accessorKey: "config.project_name",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Layers3 className="h-4 w-4" />
          Project
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.original.config.project_name ? row.original.config.project_name : "Global Config";
        const isDeleted = row.original.isDeleted;

        return isDeleted ? (
          <Tooltip>
            <TooltipTrigger asChild className="ml-3">
              <span className="font-medium cursor-help text-muted-foreground">
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="text-xs">This config is deleted</span>
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
      accessorKey: "version",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <FileCog className="h-4 w-4" />
          Version
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          v{row.original.version}
          {row.original.is_latest && (
            <span className="ml-2 text-xs text-green-600 font-semibold">
              latest
            </span>
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "config.client",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <IconEye className="h-4 w-4" />
          Client
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          {row.original.config.client || "—"}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "created_at",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Calendar className="h-4 w-4" />
          Created
        </Button>
      ),
      cell: ({ row }) => {
        const createdAt = new Date(
          row.original.created_at
        ).toLocaleDateString();
        const createdByEmail = row.original.created_by?.email;

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
      accessorKey: "updated_at",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Calendar className="h-4 w-4" />
          Updated
        </Button>
      ),
      cell: ({ row }) => {
        const updatedAt = new Date(
          row.original.updated_at
        ).toLocaleDateString();
        const updatedByEmail = row.original.updated_by?.email;

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
        const config = row.original;

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
                  !canViewConfigs
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canViewConfigs) {
                    router.push(`/dashboard/configs/${config.id}`);
                  }
                }}
              >
                <IconEye size={16} />
                View config details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canUpdateConfigs || config.isDeleted}
                className={`flex items-center gap-2 ${
                  !canUpdateConfigs || config.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canUpdateConfigs && !config.isDeleted) {
                    setSelectedConfig(config);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update config
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                disabled={!canDeleteConfigs || config.isDeleted}
                className={`text-destructive flex items-center gap-2 ${
                  !canDeleteConfigs || config.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canDeleteConfigs && !config.isDeleted) {
                    setSelectedConfig(config);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
                Delete config
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
