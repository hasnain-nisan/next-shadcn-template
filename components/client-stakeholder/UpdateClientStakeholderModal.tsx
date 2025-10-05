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
import { ClientStakeholder } from "@/types/stakeholder.types";
import { Client } from "@/types/client.types";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  stakeholder: ClientStakeholder | null;
  clients: Client[];
};

type UpdateStakeholderFormValues = {
  name?: string;
  email?: string;
  phone?: string;
  clientId?: string;
  role?: string;
  team?: string;
};

export function UpdateClientStakeholderModal({
  open,
  setOpen,
  setRefetch,
  stakeholder,
  clients,
}: Readonly<Props>) {
  const firstClientId = clients.length > 0 ? clients[0].id : "";
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateStakeholderFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      clientId: firstClientId,
      role: "",
      team: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && stakeholder) {
      reset({
        name: stakeholder.name ?? "",
        email: stakeholder.email ?? "",
        phone: stakeholder.phone ?? "",
        clientId: firstClientId,
        role: stakeholder.role ?? "",
        team: stakeholder.team ?? "",
      });
    }
  }, [open, stakeholder, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  const onSubmit = async (data: UpdateStakeholderFormValues) => {
    try {
      setIsSubmitting(true);
      const stakeholderService = ServiceFactory.getClientStakeholderService();
      await stakeholderService.update(stakeholder!.id, {
        name: data.name?.trim() || undefined,
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        role: data.role?.trim() || undefined,
        team: data.team?.trim() || undefined,
      });
      toast.success("Stakeholder updated successfully");
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
          <DialogTitle>Update Stakeholder</DialogTitle>
          <DialogDescription>
            Modify stakeholder details. Leave fields blank to keep existing
            values.
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

          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              {...register("email", {
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                  "Invalid email format",
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-2">Phone</Label>
            <Input
              type="tel"
              {...register("phone", {
                validate: (v) =>
                  v === undefined ||
                  v.trim() === "" ||
                  v.trim().length > 0 ||
                  "Phone must not be empty if provided",
              })}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Client Dropdown */}
          <div>
            <Label className="mb-2">Client</Label>
            <Controller
              name="clientId"
              control={control}
              defaultValue={stakeholder?.client?.id ?? ""}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
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
          </div>

          {/* Role */}
          <div>
            <Label className="mb-2">Role</Label>
            <Input
              type="text"
              placeholder="Please enter role name"
              {...register("role")}
            />
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Team */}
          <div>
            <Label className="mb-2">Team</Label>
            <Input
              type="text"
              placeholder="Please enter team name"
              {...register("team")}
            />
            {errors.team && (
              <p className="text-xs text-red-500 mt-1">{errors.team.message}</p>
            )}
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
