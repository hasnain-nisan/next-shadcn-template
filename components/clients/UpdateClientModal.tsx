"use client";

import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Client } from "@/types/client.types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  client: Client | null;
};

type UpdateClientFormValues = {
  name: string;
  clientCode: string;
};

export function UpdateClientModal({
  open,
  setOpen,
  setRefetch,
  client,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClientFormValues>({
    defaultValues: {
      name: "",
      clientCode: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        clientCode: client.clientCode.replace(/^CL-/, ""),
      });
    }
  }, [client, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  const onSubmit = async (data: UpdateClientFormValues) => {
    if (!client) return;
    try {
      setIsSubmitting(true);
      const clientService = ServiceFactory.getClientService();
      await clientService.updateClient(client.id, data);
      toast.success("Client updated successfully");
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
          <DialogTitle>Update Client</DialogTitle>
          <DialogDescription>
            Modify client details and update their code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-2">Client Name</Label>
            <Input
              type="text"
              {...register("name", {
                required: "Client name is required",
                validate: (v) => v.trim() !== "" || "Name cannot be empty",
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Client Code */}
          <div>
            <Label className="mb-2">Client Code</Label>
            <Input
              type="text"
              {...register("clientCode", {
                required: "Client code is required",
                validate: (v) => v.trim() !== "" || "Code cannot be empty",
              })}
            />
            {errors.clientCode && (
              <p className="text-xs text-red-500 mt-1">
                {errors.clientCode.message}
              </p>
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
