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
import { useEffect, useState, useCallback } from "react";
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
  name: string;
  clientTeam: string;
  clientId: string;
  description: string;
  stakeholderIds: string[];
};

export function UpdateProjectModal({
  open,
  setOpen,
  setRefetch,
  project,
  clients,
}: Readonly<Props>) {
  const firstClientId = clients.length > 0 ? clients[0].id : "";

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
      description: "",
      stakeholderIds: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stakeholders, setStakeholders] = useState<ClientStakeholder[]>([]);
  const watchedClientId = watch("clientId");

  const resetForm = useCallback(() => {
    reset({
      name: "",
      clientTeam: "",
      clientId: "",
      description: "",
      stakeholderIds: [],
    });
    setStakeholders([]);
  }, [reset]);

  // --- 1. Populate form on open (This section remains largely correct) ---
  useEffect(() => {
    if (open && project) {
      const initialClient = project.client?.id ?? firstClientId;
      const initialStakeholderIds =
        project.stakeholders?.map((s) => s.id) ?? [];

      // Ensure that the initial reset sets the project's selected IDs
      reset({
        name: project.name ?? "",
        clientTeam: project.clientTeam ?? "",
        clientId: initialClient,
        description: project.description ?? "",
        stakeholderIds: initialStakeholderIds,
      });
    } else if (!open) {
      resetForm();
    }
  }, [open, project, reset, firstClientId, resetForm]);

  // --- 2. Fetch stakeholders when clientId changes (CRITICAL FIX HERE) ---
  useEffect(() => {
    if (!open || !watchedClientId) {
      setStakeholders([]);
      // When client is cleared, also clear selected stakeholders
      if (open) setValue("stakeholderIds", []);
      return;
    }

    const fetchStakeholders = async () => {
      try {
        const clientStakeholderService =
          ServiceFactory.getClientStakeholderService();

        const result = await clientStakeholderService.getAll({
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          clientId: watchedClientId,
          deletedStatus: "false",
        });

        const fetchedStakeholders = result.items;
        setStakeholders(fetchedStakeholders);

        // Logic to handle selected IDs upon client change:

        const isInitialLoad = open && project?.client?.id === watchedClientId;

        // If it's the initial load for the current project, do nothing here.
        // The MultiSelect will automatically show the selected IDs from the
        // form state once 'stakeholders' are available.
        if (isInitialLoad) {
          return;
        }

        // If the client selection was manually changed, we need to clear or filter:
        // const currentSelectedIds = watch("stakeholderIds");
        const currentSelectedIds = project?.stakeholders?.map((s) => s.id) ?? [];
        const validIdsForNewClient = currentSelectedIds.filter((id) =>
          fetchedStakeholders.some((s) => s.id === id)
        );

        // Only update if the selected list changed (e.g., if we had to remove
        // stakeholders not belonging to the new client, or clear the list entirely).
        // if (validIdsForNewClient.length !== currentSelectedIds.length) {
          setValue("stakeholderIds", validIdsForNewClient);
        // }
      } catch (error) {
        console.error("Failed to fetch stakeholders:", error);
        toast.error("Failed to load client stakeholders.");
        setStakeholders([]);
        setValue("stakeholderIds", []);
      }
    };

    fetchStakeholders();

    // The dependency array is correct: re-run when client or modal state changes
  }, [watchedClientId, open, project, setValue, watch]); // `watch` added as it's used inside the effect

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: UpdateProjectFormValues) => {
    if (!project) return;

    try {
      setIsSubmitting(true);
      const projectService = ServiceFactory.getProjectService();

      const payload = {
        name: data.name?.trim() || undefined,
        clientTeam: data.clientTeam?.trim() || undefined,
        clientId: data.clientId,
        description: data.description?.trim() || undefined,
        stakeholderIds: data.stakeholderIds,
      };

      await projectService.update(project.id, payload);
      toast.success("Project updated successfully");
      handleOpenChange(false);
      setRefetch(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clientSelected = !!watchedClientId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Project: {project?.name}</DialogTitle>
          <DialogDescription>
            Modify project details and stakeholders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                validate: (v) => v.trim() !== "" || "Name cannot be empty",
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
              rules={{
                required: "Client is required",
                validate: (v) =>
                  (typeof v === "string" && v.trim() !== "") ||
                  "Client is required",
              }}
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
            {errors.clientId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          {/* Stakeholder Multi-Select */}
          <div>
            <Label className="mb-2">Stakeholders</Label>
            <Controller
              name="stakeholderIds"
              control={control}
              render={({ field }) => {
                const options = stakeholders.map((s) => ({
                  label: s.name,
                  value: s.id,
                }));

                return (
                  <>
                    <MultiSelect
                      options={options}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select stakeholders..."
                      disabled={!clientSelected || options.length === 0}
                    />
                    {!clientSelected && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a client first to enable stakeholder selection.
                      </p>
                    )}
                    {clientSelected && options.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        No active stakeholders found for this client.
                      </p>
                    )}
                  </>
                );
              }}
            />
          </div>

          {/* Description */}
          <div>
            <Label className="mb-2">Description</Label>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={4}
              {...register("description", {
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
