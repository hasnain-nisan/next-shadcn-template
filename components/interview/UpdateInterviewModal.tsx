"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import type { Interview } from "@/types/interview.types";
import type { Client } from "@/types/client.types";
import type { Project } from "@/types/project.types";
// Assuming this type is available
// import type { ClientStakeholder } from "@/types/stakeholder.types";

// --- Function to find Client ID based on Project ID ---
const findClientId = (clients: Client[], projectId: string | undefined) => {
  if (!projectId) return "";

  for (const client of clients) {
    if (client.projects && client.projects.some((p) => p.id === projectId)) {
      return client.id;
    }
  }
  return "";
};
// --------------------------------------------------------

type StakeholderOption = { id: string; name: string };

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  interview: Interview | null;
  setSelectedInterview: React.Dispatch<React.SetStateAction<Interview | null>>;
  clients: Client[];
};

type UpdateInterviewFormValues = {
  name?: string;
  date?: string;
  gDriveId?: string;
  requestDistillation?: boolean;
  requestCoaching?: boolean;
  requestUserStories?: boolean;
  clientId?: string;
  projectId?: string;
  stakeholderIds?: string[];
};

export function UpdateInterviewModal({
  open,
  setOpen,
  setRefetch,
  interview,
  setSelectedInterview,
  clients,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<UpdateInterviewFormValues>({
    defaultValues: {
      name: "",
      date: "",
      gDriveId: "",
      requestDistillation: false,
      requestCoaching: false,
      requestUserStories: false,
      clientId: "",
      projectId: "",
      stakeholderIds: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  // Renamed state to reflect project-specific filtering
  const [projectStakeholders, setProjectStakeholders] = useState<
    StakeholderOption[]
  >([]);

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingStakeholders, setIsLoadingStakeholders] = useState(false); // Combined loading for simplicity
  const [originalClientId, setOriginalClientId] = useState("");

  const clientId = watch("clientId");
  const currentProjectId = watch("projectId");
  const stakeholderIds = watch("stakeholderIds");

  // Memoized Stakeholder Options: only includes project stakeholders
  const stakeholderOptions = useMemo(() => {
    const optionsMap = new Map<string, StakeholderOption>();

    // 1. Add all project-associated stakeholders
    projectStakeholders.forEach((s) => optionsMap.set(s.id, s));

    // 2. Add any currently selected stakeholders that might not be in the list
    // (e.g., if they were recently removed from the project but still exist in the interview record).
    if (interview && stakeholderIds) {
      const selectedButMissing = interview.stakeholders
        ?.filter((s) => stakeholderIds.includes(s.id) && !optionsMap.has(s.id))
        .map((s) => ({
          id: s.id,
          name: s.name || `Stakeholder ${s.id.substring(0, 4)}`,
        }));

      selectedButMissing?.forEach((s) => optionsMap.set(s.id, s));
    }

    return Array.from(optionsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [projectStakeholders, interview, stakeholderIds]);

  // Reset everything when modal closes
  useEffect(() => {
    if (!open) {
      reset();
      setProjects([]);
      setProjectStakeholders([]);
      setOriginalClientId("");
      setSelectedInterview(null);
    }
  }, [open, reset, setSelectedInterview]);

  // Populate form with interview data when modal opens
  useEffect(() => {
    if (open && interview) {
      const initialProjectId = interview.project?.id ?? "";
      const initialClientId = findClientId(clients, initialProjectId);

      const interviewData: UpdateInterviewFormValues = {
        name: interview.name ?? "",
        date: interview.date ?? "",
        gDriveId: interview.gDriveId ?? "",
        requestDistillation: !!interview.requestDistillation,
        requestCoaching: !!interview.requestCoaching,
        requestUserStories: !!interview.requestUserStories,
        clientId: initialClientId,
        projectId: initialProjectId,
        stakeholderIds: interview.stakeholders?.map((s) => s.id) ?? [],
      };

      reset(interviewData);
      setOriginalClientId(initialClientId);
    }
  }, [open, interview, reset, clients]);

  // --- 1. Fetch Projects when clientId changes ---
  useEffect(() => {
    const fetchProjects = async () => {
      if (!clientId || clientId === "") {
        setProjects([]);
        return;
      }

      try {
        setIsLoadingProjects(true);

        const projectResult = await ServiceFactory.getProjectService().getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId,
          deletedStatus: "false",
        });

        // projectResult.items already contains Project[]
        setProjects(projectResult.items.filter(p => p.id === interview?.project?.id));

        // If client changed from original, reset project and stakeholders
        if (clientId !== originalClientId) {
          setValue("projectId", "");
          setValue("stakeholderIds", []);
          clearErrors("projectId");
          clearErrors("stakeholderIds");
          setProjectStakeholders([]); // Reset project stakeholders
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to fetch projects");
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (clientId) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [clientId, originalClientId, setValue, clearErrors]);

  // --- 2. Fetch Project Stakeholders when projectId changes ---
  useEffect(() => {
    const fetchProjectStakeholders = async () => {
      if (!currentProjectId || currentProjectId === "") {
        setProjectStakeholders([]);
        return;
      }

      try {
        setIsLoadingStakeholders(true);

        // Fetch the specific project details to get its nested stakeholders
        const projectDetail = await ServiceFactory.getProjectService().getById(
          currentProjectId
        );

        const stakeholders = projectDetail.stakeholders || [];
        setProjectStakeholders(
          stakeholders.map((s) => ({ id: s.id, name: s.name }))
        );

        // Reset selected stakeholders if the project changes from the initial interview project
        if (currentProjectId !== interview?.project?.id) {
          setValue("stakeholderIds", []);
        }
      } catch (error) {
        console.error("Failed to fetch project stakeholders:", error);
        toast.error("Failed to fetch project stakeholders");
        setProjectStakeholders([]);
      } finally {
        setIsLoadingStakeholders(false);
      }
    };

    if (currentProjectId) {
      fetchProjectStakeholders();
    } else {
      setProjectStakeholders([]);
    }
  }, [currentProjectId, interview, setValue]);

  const onSubmit = async (data: UpdateInterviewFormValues) => {
    if (!interview) return;

    try {
      setIsSubmitting(true);
      const interviewService = ServiceFactory.getInterviewService();

      await interviewService.update(interview.id, {
        name: data.name?.trim() || undefined,
        date: data.date,
        gDriveId: data.gDriveId?.trim() || undefined,
        requestDistillation: data.requestDistillation,
        requestCoaching: data.requestCoaching,
        requestUserStories: data.requestUserStories,
        clientId: data.clientId,
        projectId: data.projectId,
        stakeholderIds: data.stakeholderIds,
      });
      toast.success("Interview updated successfully");
      setOpen(false);
      setRefetch(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (
	  date: Date | undefined,
	  onChange: (value: string) => void
	) => {
	  if (date) {
		// Create a date at local midnight
		const localDate = new Date(
		  date.getFullYear(),
		  date.getMonth(),
		  date.getDate()
		);

		// Adjust for the local timezone offset so UTC date matches clicked day
		const corrected = new Date(
		  localDate.getTime() - localDate.getTimezoneOffset() * 60000
		);

		// Send ISO string that preserves the clicked day in UTC
		onChange(corrected.toISOString());
	  } else {
		onChange("");
	  }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg w-full md:max-w-4xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Interview</DialogTitle>
          <DialogDescription>
            Modify interview details. Changing the client will reset project and
            stakeholder selection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Interview Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Enter interview name"
              />
            </div>

            {/* Date */}
            <div>
              <Label className="mb-2 block">Interview Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => {
                  const dateValue = field.value
                    ? new Date(field.value)
                    : undefined;

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          onSelect={(date) =>
                            handleDateSelect(date, field.onChange)
                          }
                          initialFocus
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          className="w-full text-sm text-muted-foreground"
                          onClick={() => field.onChange("")}
                        >
                          Reset Date
                        </Button>
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
            </div>

            {/* Client */}
            <div>
              <Label className="mb-2 block">Client</Label>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No clients available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Project */}
            <div>
              <Label className="mb-2 block">Project</Label>
              <Controller
                name="projectId"
                control={control}
                rules={{
                  required: "Project is required",
                  validate: (v) =>
                    (typeof v === "string" && v.trim() !== "") ||
                    "Project is required",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!clientId || isLoadingProjects}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !clientId
                            ? "Select a client first"
                            : isLoadingProjects
                            ? "Loading projects..."
                            : "Select a project..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          {clientId && !isLoadingProjects
                            ? "No projects available for this client"
                            : "No projects available"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.projectId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            {/* Stakeholders Multi-Select */}
            <div>
              <Label className="mb-2 block">Stakeholders</Label>
              <Controller
                name="stakeholderIds"
                control={control}
                rules={{
                  required: "At least one stakeholder must be assigned",
                  validate: (v) =>
                    (Array.isArray(v) && v.length > 0) ||
                    "At least one stakeholder must be assigned",
                }}
                render={({ field }) => {
                  const clientSelected = !!watch("clientId");

                  return (
                    <>
                      <MultiSelect
                        options={stakeholderOptions.map((s) => ({
                          label: s.name,
                          value: s.id,
                        }))}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          !clientSelected
                            ? "Select a client first"
                            : !currentProjectId
                            ? "Select a project to load stakeholders"
                            : isLoadingStakeholders
                            ? "Loading project stakeholders..."
                            : "Select stakeholders..."
                        }
                        disabled={
                          !clientSelected ||
                          !currentProjectId ||
                          isLoadingStakeholders
                        }
                      />
                    </>
                  );
                }}
              />
              {errors.stakeholderIds && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.stakeholderIds.message}
                </p>
              )}
            </div>

            {/* Optional Fields */}
            <div>
              <Label htmlFor="gDriveId" className="mb-2 block">
                Google Drive ID
              </Label>
              <Input
                id="gDriveId"
                type="text"
                {...register("gDriveId")}
                placeholder="Enter Google Drive ID"
              />
            </div>

            {/* <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  id="requestDistillation"
                  type="checkbox"
                  {...register("requestDistillation")}
                  className="w-4 h-4"
                />
                <Label htmlFor="requestDistillation">
                  Request Distillation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="requestCoaching"
                  type="checkbox"
                  {...register("requestCoaching")}
                  className="w-4 h-4"
                />
                <Label htmlFor="requestCoaching">Request Coaching</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="requestUserStories"
                  type="checkbox"
                  {...register("requestUserStories")}
                  className="w-4 h-4"
                />
                <Label htmlFor="requestUserStories">Request User Stories</Label>
              </div>
            </div> */}
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Updating..." : "Update Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
