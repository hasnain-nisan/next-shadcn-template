"use client";

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
import { useEffect, useState, useRef } from "react";
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
import type { Interview } from "@/types/interview.types";
import type { Client } from "@/types/client.types";
import type { Project } from "@/types/project.types";

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
  requestDistillation?: string;
  requestCoaching?: string;
  requestUserStories?: string;
  clientId?: string;
  projectId?: string;
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
    formState: { errors },
  } = useForm<UpdateInterviewFormValues>({
    defaultValues: {
      name: "",
      date: "",
      gDriveId: "",
      requestDistillation: "",
      requestCoaching: "",
      requestUserStories: "",
      clientId: "",
      projectId: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const originalClientIdRef = useRef<string>("");
  const lastInterviewIdRef = useRef<string>("");

  const clientId = watch("clientId");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setProjects([]);
      setIsInitialLoad(true);
      originalClientIdRef.current = "";
      lastInterviewIdRef.current = "";
      setSelectedInterview(null);
    }
    setOpen(isOpen);
  };

  // Ensure projectId gets synced after projects load
  useEffect(() => {
    if (!interview) return;

    const projectIdFromInterview = interview.project?.id ?? "";
    if (
      projects.length > 0 &&
      projectIdFromInterview &&
      !watch("projectId") // only set if not already set
    ) {
      setValue("projectId", projectIdFromInterview);
    }
  }, [projects, interview, setValue, watch]);

  // Hydrate form when modal opens or interview changes
  useEffect(() => {
    if (!open || !interview) {
      return;
    }

    // Check if this is a different interview or if we need to re-hydrate
    const currentInterviewId = interview.id;
    const needsHydration = lastInterviewIdRef.current !== currentInterviewId;

    if (needsHydration) {
      setIsInitialLoad(true);
      const originalClientId = interview.client?.id ?? "";
      originalClientIdRef.current = originalClientId;
      lastInterviewIdRef.current = currentInterviewId;

      reset({
        name: interview.name ?? "",
        date: interview.date ?? "",
        gDriveId: interview.gDriveId ?? "",
        requestDistillation: interview.requestDistillation ?? "",
        requestCoaching: interview.requestCoaching ?? "",
        requestUserStories: interview.requestUserStories ?? "",
        clientId: originalClientId,
        projectId: interview.project?.id ?? "",
      });
    }
  }, [open, interview, reset]);

  // Fetch projects when clientId changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!clientId || clientId === "") {
        setProjects([]);
        return;
      }

      try {
        const projectService = ServiceFactory.getProjectService();
        const result = await projectService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId,
          deletedStatus: "false",
        });
        setProjects(result.items);

        // After fetching projects for the first time, mark initial load as complete
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    };

    if (clientId) {
      fetchProjects();
    } else {
      setProjects([]);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [clientId, isInitialLoad]);

  // Reset projectId when client changes (only after initial load)
  useEffect(() => {
    // Don't reset during initial load or if no interview is set
    if (isInitialLoad || !interview || !originalClientIdRef.current) {
      return;
    }

    // Only reset projectId if the client has actually changed from the original
    if (clientId && clientId !== originalClientIdRef.current) {
      setValue("projectId", "");
    }
  }, [clientId, setValue, interview, isInitialLoad]);

  const onSubmit = async (data: UpdateInterviewFormValues) => {
    try {
      setIsSubmitting(true);
      const interviewService = ServiceFactory.getInterviewService();
      await interviewService.update(interview!.id, {
        name: data.name?.trim() || undefined,
        date: data.date,
        gDriveId: data.gDriveId?.trim() || undefined,
        requestDistillation: data.requestDistillation?.trim() || undefined,
        requestCoaching: data.requestCoaching?.trim() || undefined,
        requestUserStories: data.requestUserStories?.trim() || undefined,
        clientId: data.clientId,
        projectId: data.projectId,
      });
      toast.success("Interview updated successfully");
      setOpen(false);
      setSelectedInterview(null);
      setRefetch(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Interview</DialogTitle>
          <DialogDescription>
            Modify interview details. Changing the client will reset project
            selection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-2">Interview Name</Label>
            <Input type="text" {...register("name")} />
          </div>

          {/* Date */}
          <div>
            <Label className="mb-2">Interview Date</Label>
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
                        className="w-full justify-start text-left font-normal"
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
                        onSelect={(date) => {
                          if (date) {
                            const localDate = new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate()
                            );
                            field.onChange(localDate.toISOString());
                          } else {
                            field.onChange("");
                          }
                        }}
                        initialFocus
                      />
                      <Button
                        variant="ghost"
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
            <Label className="mb-2">Client</Label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-[36px] text-sm">
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto w-full">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Project */}
          <div>
            <Label className="mb-2">Project</Label>
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
                  disabled={!clientId}
                >
                  <SelectTrigger className="w-full h-[36px] text-sm">
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto w-full">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No projects available
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

          {/* Optional Fields */}
          <div>
            <Label className="mb-2">Google Drive ID</Label>
            <Input type="text" {...register("gDriveId")} />
          </div>

          <div>
            <Label className="mb-2">Request Distillation</Label>
            <Input type="url" {...register("requestDistillation")} />
          </div>

          <div>
            <Label className="mb-2">Request Coaching</Label>
            <Input type="url" {...register("requestCoaching")} />
          </div>

          <div>
            <Label className="mb-2">Request User Stories</Label>
            <Input type="url" {...register("requestUserStories")} />
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
