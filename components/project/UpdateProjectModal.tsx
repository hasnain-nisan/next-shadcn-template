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
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Project } from "@/types/project.types";
import type { Client } from "@/types/client.types";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  project: Project | null;
  clients: Client[];
};

type UpdateProjectFormValues = {
  name?: string;
  clientTeam?: string;
  clientId?: string;
  description?: string;
};

export function UpdateProjectModal({
  open,
  setOpen,
  setRefetch,
  project,
  clients,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateProjectFormValues>({
    defaultValues: {
      name: "",
      clientTeam: "",
      clientId: "",
      description: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when modal opens with a project
  useEffect(() => {
    if (open && project) {
      reset({
        name: project.name ?? "",
        clientTeam: project.clientTeam ?? "",
        clientId: project.client?.id ?? "",
        description: project.description ?? "",
      });
    }
  }, [open, project, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset({
        name: "",
        clientTeam: "",
        clientId: "",
        description: "",
      });
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: UpdateProjectFormValues) => {
    try {
      setIsSubmitting(true);
      const projectService = ServiceFactory.getProjectService();
      await projectService.update(project!.id, {
        name: data.name?.trim() || undefined,
        clientTeam: data.clientTeam?.trim() || undefined,
        clientId: data.clientId,
        description: data.description?.trim() || undefined,
      });
      toast.success("Project updated successfully");
      setOpen(false); // closing triggers handleOpenChange → reset
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
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>Modify project details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              type="text"
              {...register("name", {
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  v.trim().length > 0 ||
                  "Name must not be empty if provided",
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Client Team */}
          <div>
            <Label className="mb-2">Client Team</Label>
            <Input
              type="text"
              {...register("clientTeam", {
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  v.trim().length > 0 ||
                  "Client team must not be empty if provided",
              })}
            />
            {errors.clientTeam && (
              <p className="text-xs text-red-500 mt-1">
                {errors.clientTeam.message}
              </p>
            )}
          </div>

          {/* Client Dropdown */}
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

          {/* Description */}
          <div>
            <Label className="mb-2">Description</Label>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={4}
              {...register("description", {
                required: "Description is required",
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  v.trim().length > 0 ||
                  "Description must not be empty if provided",
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
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
