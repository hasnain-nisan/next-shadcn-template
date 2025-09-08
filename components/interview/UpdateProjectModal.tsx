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
import { MultiSelect } from "@/components/ui/multi-select";
import type { Project } from "@/types/project.types";
import type { Client } from "@/types/client.types";
import type { ClientStakeholder } from "@/types/stakeholder.types";

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
  stakeholderIds?: string[];
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateProjectFormValues>({
    defaultValues: {
      name: "",
      clientTeam: "",
      clientId: "",
      stakeholderIds: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stakeholders, setStakeholders] = useState<ClientStakeholder[]>([]);
  const [isLoadingStakeholders, setIsLoadingStakeholders] = useState(false);
  const [isFormHydrated, setIsFormHydrated] = useState(false);

  // Keep track of original project client ID to detect user changes
  const originalClientIdRef = useRef<string>("");

  const clientId = watch("clientId");

  // Reset everything when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setStakeholders([]);
      setIsFormHydrated(false);
      originalClientIdRef.current = "";
    }
    setOpen(isOpen);
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (!open || !project || isFormHydrated) return;

    const originalClientId = project.client?.id ?? "";
    const originalStakeholderIds = project.stakeholders?.map((s) => s.id) ?? [];

    // Store original client ID for comparison
    originalClientIdRef.current = originalClientId;

    // Set all form values including the original stakeholder IDs
    reset({
      name: project.name ?? "",
      clientTeam: project.clientTeam ?? "",
      clientId: originalClientId,
      stakeholderIds: originalStakeholderIds,
    });

    setIsFormHydrated(true);
  }, [open, project, isFormHydrated, reset]);

  // Fetch stakeholders when clientId changes
  useEffect(() => {
    const fetchStakeholders = async () => {
      if (!clientId || clientId === "") {
        setStakeholders([]);
        return;
      }

      try {
        setIsLoadingStakeholders(true);
        const clientStakeholderService =
          ServiceFactory.getClientStakeholderService();
        const result = await clientStakeholderService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId: clientId !== "all" ? clientId : undefined,
          deletedStatus: "false",
        });
        setStakeholders(result.items);
      } catch (error) {
        console.error("Failed to fetch stakeholders:", error);
        setStakeholders([]);
      } finally {
        setIsLoadingStakeholders(false);
      }
    };

    if (clientId) {
      fetchStakeholders();
    } else {
      setStakeholders([]);
    }
  }, [clientId]);

  // Clear stakeholders when user changes client (but not on initial load)
  useEffect(() => {
    if (!isFormHydrated) return; // Don't run during initial hydration

    // If client changed from the original, clear stakeholders
    if (clientId !== originalClientIdRef.current) {
      setValue("stakeholderIds", []);
    }
  }, [clientId, isFormHydrated, setValue]);

  const onSubmit = async (data: UpdateProjectFormValues) => {
    try {
      setIsSubmitting(true);
      const projectService = ServiceFactory.getProjectService();
      await projectService.update(project!.id, {
        name: data.name?.trim() || undefined,
        clientTeam: data.clientTeam?.trim() || undefined,
        stakeholderIds: data.stakeholderIds,
        clientId: data.clientId,
      });
      toast.success("Project updated successfully");
      reset();
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>
            Modify project details. Changing the client will reset stakeholder
            selection.
          </DialogDescription>
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

          {/* Stakeholder Multi-Select */}
          <div>
            <Label className="mb-2">Stakeholders</Label>
            <Controller
              name="stakeholderIds"
              control={control}
              rules={{
                validate: (value) =>
                  Array.isArray(value) && value.length > 0
                    ? true
                    : "At least one stakeholder must be selected",
              }}
              render={({ field }) => (
                <MultiSelect
                  options={stakeholders.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingStakeholders
                      ? "Loading stakeholders..."
                      : "Select stakeholders..."
                  }
                  disabled={!clientId || isLoadingStakeholders}
                />
              )}
            />
            {errors.stakeholderIds && (
              <p className="text-xs text-red-500 mt-1">
                {errors.stakeholderIds.message}
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
