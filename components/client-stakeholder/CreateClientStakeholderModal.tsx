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
import { useState, useEffect } from "react";
import { // <-- Added useEffect import
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

type CreateStakeholderFormValues = {
  name: string;
  email?: string;
  phone?: string;
  clientId: string;
  role?: string;
  team?: string;
};

export function CreateClientStakeholderModal({
  open,
  setOpen,
  setRefetch,
  clients,
}: Readonly<Props>) {
  // Determine the ID of the first client, if available
  const firstClientId = clients.length > 0 ? clients[0].id : "";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateStakeholderFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      // Set initial default value based on props for first render
      clientId: firstClientId,
      role: "",
      team: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Effect to reset/set default values when the modal opens ---
  useEffect(() => {
    if (open) {
      // Always reset to a clean state, setting the clientId to the first client's ID
      reset({
        name: "",
        email: "",
        phone: "",
        clientId: firstClientId,
      });
    }
  }, [open, firstClientId, reset]); 
  // Reruns when 'open' state changes or if the 'firstClientId' (derived from 'clients') changes

  const handleOpenChange = (isOpen: boolean) => {
    // If closing, we let the useEffect handle the reset logic for the next open.
    // However, calling reset here to clear data when closing is still a good practice.
    if (!isOpen) {
      reset(); 
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: CreateStakeholderFormValues) => {
    try {
      setIsSubmitting(true);
      const stakeholderService = ServiceFactory.getClientStakeholderService();
      await stakeholderService.create(data);
      toast.success("Stakeholder created successfully");
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

  // Disable submission if no client is available for selection
  const canSubmit = !isSubmitting && clients.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Create Stakeholder</DialogTitle>
          <DialogDescription>
            Fill in stakeholder details and assign them to a client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              type="text"
              {...register("name", {
                required: "Stakeholder name must not be empty",
                validate: (v) => v.trim() !== "" || "Name cannot be empty",
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email (optional, must not be empty if provided) */}
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

          {/* Phone (optional, must not be empty if provided) */}
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

          {/* Client Dropdown (required) */}
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
                  onValueChange={field.onChange}
                  disabled={clients.length === 0} // Disable if no clients
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
                {errors.clientId.message || "Client is required"}
              </p>
            )}
          </div>
          
          {/* Role */}
          <div>
            <Label className="mb-2">Role</Label>
            <Input
              placeholder="Please enter a Role"
              type="text"
              {...register("role")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Team */}
          <div>
            <Label className="mb-2">Team</Label>
            <Input
              placeholder="Please enter a Team"
              type="text"
              {...register("team")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
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
            <Button type="submit" disabled={!canSubmit}>
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