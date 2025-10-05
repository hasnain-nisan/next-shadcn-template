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

// --- 1. Define the Project Data Structure ---

interface ProjectData {
  id: string;
  name: string;
  clientTeam: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  stakeholders: ClientStakeholder[] | null;
  // Assuming optional audit fields like createdBy, updatedBy
  createdBy?: { id: string; email: string } | null;
  updatedBy?: { id: string; email: string } | null;
}

type Props = {
  // The data to display
  project: ProjectData;
  // State handlers for the modal
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Modal component to display detailed information about a Project.
 */
export function ProjectDetailsModal({
  open,
  setOpen,
  project,
}: Readonly<Props>) {

  // Helper to safely format date or return a placeholder
  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
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
      <span className="font-medium text-foreground min-w-[100px] flex-shrink-0">
        {label}:
      </span>
      {children || <p className="text-sm text-black break-words">{displayValue(value)}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>
            Detailed information for the project: {project.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          
          <h3 className="text-base font-semibold text-foreground border-b pb-2">
            Project Information
          </h3>
          
          {/* Project Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
            <DetailItem label="Project Name" value={project.name} />
            <DetailItem label="Client Team" value={project.clientTeam} />

            {/* Status */}
            <DetailItem label="Status">
              <Badge
                className={`px-3 py-1 ${
                  project.isDeleted
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {project.isDeleted ? "Deleted" : "Active"}
              </Badge>
            </DetailItem>
          </div>

          {/* Description (Full Width) */}
          <div className="mt-4">
             <DetailItem label="Description" value={project.description}>
                <p className="text-sm text-black break-words whitespace-pre-wrap">
                  {displayValue(project.description)}
                </p>
             </DetailItem>
          </div>

          {/* --- Stakeholders Section --- */}
          <div className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">
              Stakeholders ({project.stakeholders?.length || 0})
            </h3>
            
            {project.stakeholders && project.stakeholders.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {project.stakeholders.map((s) => (
                  <div key={s.id} className="p-3 border rounded-md bg-gray-50 flex flex-wrap gap-x-4 gap-y-1 items-center justify-between">
                    <p className="font-medium text-sm text-foreground truncate max-w-[40%]">
                      {displayValue(s.name, "Unnamed Stakeholder")}
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
                No stakeholders assigned to this project.
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
                <span className="font-medium text-foreground">
                  Created By:
                </span>
                <p className="text-black">
                  {displayValue(project.createdBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(project.createdAt)}
                </p>
              </div>
              {/* Updated By */}
              <div>
                <span className="font-medium text-foreground">
                  Updated By:
                </span>
                <p className="text-black">
                  {displayValue(project.updatedBy?.email, "System")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(project.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}