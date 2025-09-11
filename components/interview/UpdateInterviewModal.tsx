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
import { useEffect, useState } from "react";
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
      requestDistillation: "",
      requestCoaching: "",
      requestUserStories: "",
      clientId: "",
      projectId: "",
      stakeholderIds: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stakeholders, setStakeholders] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingStakeholders, setIsLoadingStakeholders] = useState(false);
  const [originalClientId, setOriginalClientId] = useState("");

  const clientId = watch("clientId");
  const projectId = watch("projectId");
  const stakeholderIds = watch("stakeholderIds");

  // Reset everything when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        date: "",
        gDriveId: "",
        requestDistillation: "",
        requestCoaching: "",
        requestUserStories: "",
        clientId: "",
        projectId: "",
        stakeholderIds: [],
      });
      setProjects([]);
      setStakeholders([]);
      setOriginalClientId("");
      setSelectedInterview(null);
    }
  }, [open, reset, setSelectedInterview]);

  // Populate form with interview data when modal opens
  useEffect(() => {
    if (open && interview) {
      const interviewData = {
        name: interview.name ?? "",
        date: interview.date ?? "",
        gDriveId: interview.gDriveId ?? "",
        requestDistillation: interview.requestDistillation ?? "",
        requestCoaching: interview.requestCoaching ?? "",
        requestUserStories: interview.requestUserStories ?? "",
        clientId: interview.client?.id ?? "",
        projectId: interview.project?.id ?? "",
        stakeholderIds: interview.stakeholders?.map((s) => s.id) ?? [],
      };

      reset(interviewData);
      setOriginalClientId(interview.client?.id ?? "");
    }
  }, [open, interview, reset]);

  // Fetch projects and stakeholders when clientId changes
  useEffect(() => {
    const fetchProjectsAndStakeholders = async () => {
      if (!clientId || clientId === "") {
        setProjects([]);
        setStakeholders([]);
        return;
      }

      try {
        setIsLoadingProjects(true);
        setIsLoadingStakeholders(true);

        const [projectResult, stakeholderResult] = await Promise.all([
          ServiceFactory.getProjectService().getAll({
            page: 1,
            limit: Number.MAX_SAFE_INTEGER,
            clientId,
            deletedStatus: "false",
          }),
          ServiceFactory.getClientStakeholderService().getAll({
            page: 1,
            limit: Number.MAX_SAFE_INTEGER,
            clientId,
            deletedStatus: "false",
          }),
        ]);

        setProjects(projectResult.items);
        setStakeholders(stakeholderResult.items);

        // If client changed from original, reset project and stakeholders
        if (clientId !== originalClientId) {
          setValue("projectId", "");
          setValue("stakeholderIds", []);
          clearErrors("projectId");
          clearErrors("stakeholderIds");
        }
      } catch (error) {
        console.error("Failed to fetch projects and stakeholders:", error);
        toast.error("Failed to fetch projects and stakeholders");
        setProjects([]);
        setStakeholders([]);
      } finally {
        setIsLoadingProjects(false);
        setIsLoadingStakeholders(false);
      }
    };

    if (clientId) {
      fetchProjectsAndStakeholders();
    } else {
      setProjects([]);
      setStakeholders([]);
    }
  }, [clientId, originalClientId, setValue, clearErrors]);

  // Set project and stakeholder values after they're loaded
  useEffect(() => {
    if (!interview || !open) return;

    // Only set values if we're still on the original client
    if (clientId === originalClientId) {
      if (projects.length > 0 && interview.project?.id && !projectId) {
        setValue("projectId", interview.project.id);
      }

      if (
        stakeholders.length > 0 &&
        interview.stakeholders?.length > 0 &&
        (!stakeholderIds || stakeholderIds.length === 0)
      ) {
        setValue(
          "stakeholderIds",
          interview.stakeholders.map((s) => s.id)
        );
      }
    }
  }, [
    projects,
    stakeholders,
    interview,
    setValue,
    clientId,
    originalClientId,
    projectId,
    stakeholderIds,
    open,
  ]);

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
      const normalized = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      ).toISOString();
      onChange(normalized);
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
                        options={stakeholders.map((s) => ({
                          label: s.name,
                          value: s.id,
                        }))}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          !clientSelected
                            ? "Select a client first"
                            : isLoadingStakeholders
                            ? "Loading stakeholders..."
                            : "Select stakeholders..."
                        }
                        disabled={!clientSelected || isLoadingStakeholders}
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

            <div>
              <Label htmlFor="requestDistillation" className="mb-2 block">
                Request Distillation
              </Label>
              <Input
                id="requestDistillation"
                type="url"
                {...register("requestDistillation")}
                placeholder="Enter distillation URL"
              />
            </div>

            <div>
              <Label htmlFor="requestCoaching" className="mb-2 block">
                Request Coaching
              </Label>
              <Input
                id="requestCoaching"
                type="url"
                {...register("requestCoaching")}
                placeholder="Enter coaching URL"
              />
            </div>

            <div>
              <Label htmlFor="requestUserStories" className="mb-2 block">
                Request User Stories
              </Label>
              <Input
                id="requestUserStories"
                type="url"
                {...register("requestUserStories")}
                placeholder="Enter user stories URL"
              />
            </div>
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
