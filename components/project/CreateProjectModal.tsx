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
import { MultiSelect } from "@/components/ui/multi-select";
import type { ClientStakeholder } from "@/types/stakeholder.types";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  clients: { id: string; name: string }[];
};

type CreateProjectFormValues = {
  name: string;
  clientTeam?: string;
  clientId: string;
  // stakeholderIds: string[];
};

export function CreateProjectModal({
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
  } = useForm<CreateProjectFormValues>({
    defaultValues: {
      name: "",
      clientTeam: "",
      clientId: "",
      // stakeholderIds: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState("all");
  // const [stakeholders, setStakeholders] = useState<ClientStakeholder[]>([]);

  // Fetch stakeholders when clientId changes
  // useEffect(() => {
  //   const fetchStakeholders = async () => {
  //     try {
  //       const clientStakeholderService =
  //         ServiceFactory.getClientStakeholderService();
  //       const result = await clientStakeholderService.getAll({
  //         page: 1,
  //         limit: Number.MAX_SAFE_INTEGER,
  //         clientId: clientId !== "all" ? clientId : undefined,
  //         deletedStatus: "false",
  //       });
  //       setStakeholders(result.items);
  //     } catch (error) {
  //       console.error("Failed to fetch stakeholders:", error);
  //     }
  //   };

  //   if (clientId && clientId !== "") {
  //     fetchStakeholders();
  //   } else {
  //     setStakeholders([]);
  //   }
  // }, [clientId]);

  // Reset form and state when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        clientTeam: "",
        clientId: "",
        // stakeholderIds: [],
      });
      setClientId("all");
      // setStakeholders([]);
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      setIsSubmitting(true);
      const projectService = ServiceFactory.getProjectService();
      await projectService.create(data);
      toast.success("Project created successfully");
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Provide project details and assign stakeholders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <div>
            <Label className="mb-2">Project Name</Label>
            <Input
              type="text"
              {...register("name", {
                required: "Project name must not be empty",
                validate: (v) => v.trim() !== "" || "Name cannot be empty",
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Client Team (optional) */}
          <div>
            <Label className="mb-2">Client Team</Label>
            <Input
              type="text"
              {...register("clientTeam", {
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  v.trim().length > 0 ||
                  "Client team must not be empty",
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
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setClientId(value);
                    // setValue("stakeholderIds", []); // Reset stakeholders when client changes
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

          {/* Stakeholder Multi-Select */}
          {/* <div>
            <Label className="mb-2">Stakeholders</Label>
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
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select stakeholders..."
                      disabled={!clientSelected}
                    />
                    {!clientSelected && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a client first to enable stakeholder selection.
                      </p>
                    )}
                  </>
                );
              }}
            />
            {errors.stakeholderIds && (
              <p className="text-xs text-red-500 mt-1">
                {errors.stakeholderIds.message}
              </p>
            )}
          </div> */}

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
