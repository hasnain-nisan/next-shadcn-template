"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { MultiSelect } from "../ui/multi-select";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  clients: { id: string; name: string }[];
};

type CreateInterviewFormValues = {
  name: string;
  date: string;
  gDriveId?: string;
  requestDistillation?: string;
  requestCoaching?: string;
  requestUserStories?: string;
  clientId: string;
  projectId: string;
  stakeholderIds: string[];
};

export function CreateInterviewModal({
  open,
  setOpen,
  setRefetch,
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
  } = useForm<CreateInterviewFormValues>({
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
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [stakeholders, setStakeholders] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingStakeholders, setIsLoadingStakeholders] = useState(false);
  const clientId = watch("clientId");

  // Fetch projects when client changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!clientId || clientId === "") {
        setProjects([]);
        setValue("projectId", "");
        clearErrors("projectId");
        return;
      }

      try {
        setIsLoadingProjects(true);
        const projectService = ServiceFactory.getProjectService();
        const result = await projectService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId: clientId !== "all" ? clientId : undefined,
          deletedStatus: "false",
        });

        setProjects(result.items);
        // Reset project selection when client changes and clear validation errors
        setValue("projectId", "");
        clearErrors("projectId");
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to fetch projects");
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [clientId, setValue, clearErrors]);

  // Fetch projects when client changes
  useEffect(() => {
    const fetchStakeholders = async () => {
      if (!clientId || clientId === "") {
        setStakeholders([]);
        setValue("stakeholderIds", []);
        clearErrors("stakeholderIds");
        return;
      }

      try {
        setIsLoadingStakeholders(true);
        const stakeholderService = ServiceFactory.getClientStakeholderService();
        const result = await stakeholderService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId: clientId !== "all" ? clientId : undefined,
          deletedStatus: "false",
        });

        setStakeholders(result.items);
        // Reset project selection when client changes and clear validation errors
        setValue("stakeholderIds", []);
        clearErrors("stakeholderIds");
      } catch (error) {
        console.error("Failed to fetch stakeholders:", error);
        toast.error("Failed to fetch stakeholders");
        setStakeholders([]);
      } finally {
        setIsLoadingStakeholders(false);
      }
    };

    fetchStakeholders();
  }, [clientId, setValue, clearErrors]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset();
      setProjects([]);
      setIsLoadingProjects(false);
      setStakeholders([]);
      setIsLoadingStakeholders(false);
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateInterviewFormValues) => {
    try {
      setIsSubmitting(true);
      const interviewService = ServiceFactory.getInterviewService();
      await interviewService.create(data);
      toast.success("Interview created successfully");
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

  const validateName = (value: string) => {
    if (!value || value.trim() === "") {
      return "Interview name is required";
    }
    return true;
  };

  const validateRequired = (value: string, fieldName: string) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg w-full md:max-w-4xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Create Interview</DialogTitle>
          <DialogDescription>
            Provide interview details and link to client/project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Interview Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Interview Name 
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name", {
                  required: "Interview name is required",
                  validate: validateName,
                })}
                placeholder="Enter interview name"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Interview Date */}
            <div>
              <Label className="mb-2 block">
                Interview Date 
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
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
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
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
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Client Dropdown */}
            <div>
              <Label className="mb-2 block">
                Client 
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Controller
                name="clientId"
                control={control}
                rules={{
                  required: "Client is required",
                  validate: (value) => validateRequired(value, "Client"),
                }}
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
              {errors.clientId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.clientId.message}
                </p>
              )}
            </div>

            {/* Project Dropdown */}
            <div>
              <Label className="mb-2 block">
                Project 
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Controller
                name="projectId"
                control={control}
                rules={{
                  required: "Project is required",
                  validate: (value) => validateRequired(value, "Project"),
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
              <Label className="mb-2 block">
                Stakeholders 
                {/* <span className="text-red-500">*</span> */}
              </Label>
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
                      {/* {!clientSelected && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Select a client first to enable stakeholder selection.
                        </p>
                      )} */}
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
              {isSubmitting ? "Creating..." : "Create Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
