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
import { ClientStakeholder } from "@/types/stakeholder.types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  stakeholder: ClientStakeholder | null;
};

export function DeleteClientStakeholderModal({
  open,
  setOpen,
  setRefetch,
  stakeholder,
}: Readonly<Props>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setOpen(false);
  };

  const handleDelete = async () => {
    if (!stakeholder) return;
    try {
      setIsSubmitting(true);
      const stakeholderService = ServiceFactory.getClientStakeholderService();
      await stakeholderService.delete(stakeholder.id);
      toast.success("Stakeholder deleted successfully");
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

  if (!stakeholder) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-red-600">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this stakeholder? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-muted-foreground">Name:</span>{" "}
            {stakeholder.name}
          </p>
          {stakeholder.email && (
            <p>
              <span className="font-medium text-muted-foreground">Email:</span>{" "}
              <Badge className="text-xs">{stakeholder.email}</Badge>
            </p>
          )}
          {stakeholder.phone && (
            <p>
              <span className="font-medium text-muted-foreground">Phone:</span>{" "}
              <Badge className="text-xs">{stakeholder.phone}</Badge>
            </p>
          )}
          {stakeholder.client && (
            <p>
              <span className="font-medium text-muted-foreground">Client:</span>{" "}
              <Badge className="text-xs">{stakeholder.client.name}</Badge>
            </p>
          )}
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
