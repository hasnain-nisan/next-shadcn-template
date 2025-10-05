"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { ClientStakeholder } from "@/types/stakeholder.types";

type Props = {
  // The data to display
  clientStakeholder: ClientStakeholder;
  // State handlers for the modal
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Modal component to display detailed information about a Client Stakeholder (Simplified View).
 */
export function ClientStakeholderDetailsModal({
  open,
  setOpen,
  clientStakeholder,
}: Readonly<Props>) {
  
  // Helper to safely format date or return a placeholder
  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "N/A";
    }
  };

  // Helper to display data or a placeholder
  const displayValue = (value: string | null | undefined, placeholder = "N/A") => {
    return value && value.trim() !== "" ? value : placeholder;
  };

  // Inline component for a single detail item
  const DetailItem = ({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) => (
    <div className="flex items-center gap-2">
      <span className="font-medium text-foreground min-w-[70px]">
        {label}:
      </span>
      {children || <p className="text-sm text-black">{value}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stakeholder Details</DialogTitle>
          <DialogDescription>
            Detailed information for {clientStakeholder.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          
          <h3 className="text-base font-semibold text-foreground border-b pb-2">
            Contact Information
          </h3>
          
          {/* Stakeholder Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Name and Phone */}
            <div className="space-y-4">
              <DetailItem label="Name" value={displayValue(clientStakeholder.name)} />
              <DetailItem label="Phone">
                <Badge variant="outline" className="px-3 py-1">
                  {displayValue(clientStakeholder.phone, "No Phone")}
                </Badge>
              </DetailItem>
              <DetailItem label="Role">
                <Badge variant="outline" className="px-3 py-1">
                  {displayValue(clientStakeholder.role, "No role")}
                </Badge>
              </DetailItem>
            </div>

            {/* Email and Status */}
            <div className="space-y-4">
              <DetailItem label="Email">
                <Badge variant="outline" className="px-3 py-1">
                  {displayValue(clientStakeholder.email, "No Email")}
                </Badge>
              </DetailItem>
              <DetailItem label="Status">
                <Badge
                  className={`px-3 py-1 ${
                    clientStakeholder.isDeleted
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {clientStakeholder.isDeleted ? "Deleted" : "Active"}
                </Badge>
              </DetailItem>
              <DetailItem label="Team">
                <Badge variant="outline" className="px-3 py-1">
                  {displayValue(clientStakeholder.team, "No team")}
                </Badge>
              </DetailItem>
            </div>
          </div>

          {/* Audit Info Section */}
          <div className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">
              Audit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Created By */}
              <div>
                <span className="font-medium text-foreground">
                  Created By:
                </span>
                <p className="text-black">
                  {displayValue(clientStakeholder.createdBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(clientStakeholder.createdAt)}
                </p>
              </div>
              {/* Updated By */}
              <div>
                <span className="font-medium text-foreground">
                  Updated By:
                </span>
                <p className="text-black">
                  {displayValue(clientStakeholder.updatedBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(clientStakeholder.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}