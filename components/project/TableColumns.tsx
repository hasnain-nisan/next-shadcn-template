import {
  Calendar,
  MoreHorizontal,
  Building2,
  UserCog,
  Network,
} from "lucide-react";
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
import { Project } from "@/types/project.types";

export const GetTableColumns = ({
  setSelectedProject,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<Project>[] => {
  const router = useRouter();

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
              <span className="text-xs">This project is deleted</span>
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
      accessorKey: "clientTeam",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Network className="h-4 w-4" />
          Team
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          {row.original.clientTeam || "—"}
        </div>
      ),
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
      accessorKey: "stakeholders",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <UserCog className="h-4 w-4" />
          Stakeholders
        </Button>
      ),
      cell: ({ row }) => {
        const stakeholders = row.original.stakeholders || [];

        return (
          <div className="flex flex-wrap gap-2 ml-3">
            {stakeholders.length > 0 ? (
              stakeholders.map((s) => (
                <span
                  key={s.id}
                  className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {s.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        );
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
        const project = row.original;

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
                className="cursor-pointer flex items-center gap-2"
                onClick={() => {
                  router.push(`/dashboard/projects/${project.id}`);
                }}
              >
                <IconEye size={16} />
                View project details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.isDeleted}
                className={`cursor-pointer flex items-center gap-2 ${
                  project.isDeleted ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => {
                  if (!project.isDeleted) {
                    setSelectedProject(project);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update project
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.isDeleted}
                className={`text-destructive flex items-center gap-2 ${
                  project.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (!project.isDeleted) {
                    setSelectedProject(project);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
                Delete project
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
