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
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const clientId = watch("clientId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectService = ServiceFactory.getProjectService();
        const result = await projectService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId: clientId !== "all" ? clientId : undefined,
          deletedStatus: "false",
        });
        setProjects(result.items);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    if (clientId && clientId !== "") {
      fetchProjects();
    } else {
      setProjects([]);
      setValue("projectId", "");
    }
  }, [clientId, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setProjects([]);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Create Interview</DialogTitle>
          <DialogDescription>
            Provide interview details and link to client/project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Interview Name */}
          <div>
            <Label className="mb-2">Interview Name</Label>
            <Input
              type="text"
              {...register("name", {
                required: "Interview name must not be empty",
                validate: (v) => v.trim() !== "" || "Name cannot be empty",
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Interview Date */}
          <div>
            <Label className="mb-2">Interview Date</Label>
            <Input
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Client Dropdown */}
          <div>
            <Label className="mb-2">Client</Label>
            <Controller
              name="clientId"
              control={control}
              rules={{
                required: "Client is required",
                validate: (v) =>
                  (typeof v === "string" && v.trim() !== "") ||
                  "Client is required",
              }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
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
            {errors.clientId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          {/* Project Dropdown (enabled only if client is selected) */}
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
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
