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
import { ClientStakeholder } from "@/types/stakeholder.types"; // Assuming this type is available
import { Interview } from "@/types/interview.types";
import { format } from "date-fns";

// --- 1. Define the Interview Data Structures ---

type Props = {
  // The data to display
  interview: Interview;
  // State handlers for the modal
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Modal component to display detailed information about an Interview.
 */
export function InterviewDetailsModal({
  open,
  setOpen,
  interview,
}: Readonly<Props>) {
  // Helper to safely format date or return a placeholder
  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      // Format the date/time (e.g., '10/5/2025, 8:14:05 AM')
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "N/A";
    }
  };

  // Helper to safely format date only (e.g., '10/6/2025')
  const formatDateOnly = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      // Format the date only (e.g., '10/6/2025')
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  // Helper to display data or a placeholder
  const displayValue = (
    value: string | null | undefined | number,
    placeholder = "N/A"
  ) => {
    // Convert numbers to string if needed for display
    const stringValue = typeof value === "number" ? String(value) : value;
    return stringValue && stringValue.trim() !== "" ? stringValue : placeholder;
  };

  // Inline component for a single detail item
  const DetailItem = ({
    label,
    value,
    children,
  }: {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2">
      <span className="font-medium text-foreground min-w-[100px] flex-shrink-0">
        {label}:
      </span>
      {children || (
        <p className="text-sm text-black break-words">{displayValue(value)}</p>
      )}
    </div>
  );

  // Helper to render a boolean request status badge
  const renderRequestBadge = (
    label: string,
    requested: boolean | null | undefined
  ) => (
    <div className="flex flex-col items-start gap-1">
      <span className="font-medium text-xs text-foreground min-w-[100px] flex-shrink-0">
        {label}:
      </span>
      <Badge
        className={`px-3 py-1 text-xs ${
          requested === true
            ? "bg-blue-600 text-white hover:bg-blue-600"
            : requested === false
            ? "bg-gray-400 text-black hover:bg-gray-400"
            : "bg-yellow-600 text-white hover:bg-yellow-600"
        }`}
      >
        {requested === true ? "Yes" : requested === false ? "No" : "N/A"}
      </Badge>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Details</DialogTitle>
          <DialogDescription>
            Detailed information for the interview: {interview.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* --- Interview Information --- */}
          <h3 className="text-base font-semibold text-foreground border-b pb-2">
            Interview Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <DetailItem label="Interview Name" value={interview.name} />

            {/* Date */}
            <DetailItem label="Date">
              <p className="text-sm text-black break-words">
                {/* {formatDateOnly(interview.date)} */}
                {interview.date
                  ? format(new Date(interview.date), "MMMM do, yyyy") // Matches "October 6th, 2025" style
                  : "Date not set"}
              </p>
            </DetailItem>

            {/* Project Name */}
            <DetailItem label="Project Name" value={interview.project.name} />

            {/* Google Drive ID */}
            <DetailItem label="G-Drive ID">
              <p className="text-sm max-w-full text-black">
                {displayValue(interview.gDriveId)}
              </p>
            </DetailItem>

            {/* Status */}
            <DetailItem label="Status">
              <Badge
                className={`px-3 py-1 ${
                  interview.isDeleted
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {interview.isDeleted ? "Deleted" : "Active"}
              </Badge>
            </DetailItem>
          </div>

          {/* --- Service Requests Section --- */}
          <div className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">
              Analysis Requests
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {renderRequestBadge(
                "Distillation",
                interview.requestDistillation
              )}
              {renderRequestBadge("Coaching", interview.requestCoaching)}
              {renderRequestBadge("User Stories", interview.requestUserStories)}
            </div>
          </div>

          {/* --- Stakeholders Section (Interview Attendees) --- */}
          <div className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">
              Attendees ({interview.stakeholders?.length || 0})
            </h3>

            {interview.stakeholders && interview.stakeholders.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {interview.stakeholders.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 border rounded-md bg-gray-50 flex flex-wrap gap-x-4 gap-y-1 items-center justify-between"
                  >
                    <p className="font-medium text-sm text-foreground truncate max-w-[40%]">
                      {displayValue(s.name, "Unnamed Attendee")}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {s.role && <Badge variant="secondary">{s.role}</Badge>}
                      {s.team && <Badge variant="secondary">{s.team}</Badge>}
                      {s.email && <Badge variant="outline">{s.email}</Badge>}
                      {s.isDeleted && (
                        <Badge variant="destructive">Deleted</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-muted-foreground text-sm">
                No stakeholders were recorded for this interview.
              </p>
            )}
          </div>

          {/* --- Audit Info Section --- */}
          <div className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">
              Audit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Created By */}
              <div>
                <span className="font-medium text-foreground">Created By:</span>
                <p className="text-black">
                  {displayValue(interview.createdBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(interview.createdAt)}
                </p>
              </div>
              {/* Updated By */}
              <div>
                <span className="font-medium text-foreground">Updated By:</span>
                <p className="text-black">
                  {displayValue(interview.updatedBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(interview.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
