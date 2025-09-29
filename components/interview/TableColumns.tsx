import {
  Calendar,
  MoreHorizontal,
  Building2,
  UserCog,
  Network,
  Info,
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
import { Interview } from "@/types/interview.types";
import { useSession } from "next-auth/react";

export const GetTableColumns = ({
  setSelectedInterview,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setSelectedInterview: React.Dispatch<React.SetStateAction<Interview | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<Interview>[] => {
  const router = useRouter();

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};
  const canViewInterviews = accessScopes.canAccessInterviews ?? false;
  const canUpdateInterviews = accessScopes.canUpdateInterviews ?? false;
  const canDeleteInterviews = accessScopes.canDeleteInterviews ?? false;

  return [
    {
      accessorKey: "name",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Building2 className="h-4 w-4" />
          Name
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.original.name;
        const isDeleted = row.original.isDeleted;

        return isDeleted ? (
          <Tooltip>
            <TooltipTrigger asChild className="ml-3">
              <span className="font-medium cursor-help text-muted-foreground">
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="text-xs">This interview is deleted</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="font-medium ml-3">{name}</span>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Calendar className="h-4 w-4" />
          Date
        </Button>
      ),
      cell: ({ row }) => {
        // const date = new Date(row.original.date).toLocaleString();
        const date = new Date(row.original.date).toLocaleDateString();
        return <div className="ml-3 text-sm font-medium">{date}</div>;
      },
    },
    {
      accessorKey: "client.name",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <IconBriefcase className="h-4 w-4" />
          Client
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          {row.original.client?.name || "—"}
        </div>
      ),
    },
    {
      accessorKey: "project.name",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Network className="h-4 w-4" />
          Project
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3 font-medium text-sm text-foreground">
          {row.original.project?.name || "—"}
        </div>
      ),
    },
    {
      accessorKey: "project.stakeholders",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <UserCog className="h-4 w-4" />
          Stakeholders
        </Button>
      ),
      cell: ({ row }) => {
        const stakeholders = row.original.stakeholders || [];
        return (
          <div className="flex flex-wrap gap-2 ml-3">
            {stakeholders.length > 0 ? (
              stakeholders
                .filter((s) => !s.isDeleted)
                .map((s) => (
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
    },
    {
      accessorKey: "interviewInfo",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Info className="h-4 w-4" />
          Interview Info
        </Button>
      ),
      cell: ({ row }) => {
        const {
          gDriveId,
          requestDistillation,
          requestCoaching,
          requestUserStories,
        } = row.original;

        const renderField = (label: string, value?: string | null) => {
          const isLink =
            value?.startsWith("http://") || value?.startsWith("https://");

          const getShortLabel = (url: string) => {
            try {
              const parsed = new URL(url);
              return (
                parsed.hostname +
                parsed.pathname.slice(0, 20) +
                (parsed.pathname.length > 20 ? "…" : "")
              );
            } catch {
              return url.slice(0, 30) + "…";
            }
          };

          return (
            <div>
              <span className="text-muted-foreground font-medium">
                {label}:
              </span>{" "}
              {value ? (
                isLink ? (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline break-all"
                  >
                    {getShortLabel(value)}
                  </a>
                ) : (
                  <span className="text-foreground">{value}</span>
                )
              ) : (
                "—"
              )}
            </div>
          );
        };

        return (
          <div className="ml-3 text-sm space-y-1">
            {renderField("GDrive ID", gDriveId)}
            {/* {renderField("Distillation", requestDistillation)} */}
            {/* {renderField("Coaching", requestCoaching)} */}
            {/* {renderField("User Stories", requestUserStories)} */}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
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
    },
    {
      accessorKey: "updatedAt",
      header: () => (
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
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
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const interview = row.original;

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
                  !canViewInterviews
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canViewInterviews) {
                    router.push(
                      `/dashboard/discovery-interviews/${interview.id}`
                    );
                  }
                }}
              >
                <IconEye size={16} />
                View interview details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={interview.isDeleted}
                className={`flex items-center gap-2 ${
                  !canUpdateInterviews || interview.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (canUpdateInterviews && !interview.isDeleted) {
                    setSelectedInterview(interview);
                    setOpenUpdateModal(true);
                  }
                }}
              >
                <IconEdit size={16} />
                Update interview
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={interview.isDeleted}
                className={`flex items-center gap-2 ${
                  !canDeleteInterviews || interview.isDeleted
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if ( canDeleteInterviews && !interview.isDeleted) {
                    setSelectedInterview(interview);
                    setOpenDeleteModal(true);
                  }
                }}
              >
                <IconTrash size={16} />
                Delete interview
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
