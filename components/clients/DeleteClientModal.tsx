"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Client } from "@/types/client.types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  client: Client | null;
};

export function DeleteClientModal({
  open,
  setOpen,
  setRefetch,
  client,
}: Readonly<Props>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setOpen(false);
  };

  const handleDelete = async () => {
    if (!client) return;
    try {
      setIsSubmitting(true);
      const clientService = ServiceFactory.getClientService();
      await clientService.deleteClient(client.id);
      toast.success("Client deleted successfully");
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

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-red-600">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this client? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-muted-foreground">Name:</span>{" "}
            {client.name}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Code:</span>{" "}
            <Badge className="text-xs">{client.clientCode}</Badge>
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
