import React from "react";
import { PlusCircle, Pencil, Eye, Trash2, CalendarPlus } from "lucide-react"; // Added CalendarPlus icon
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Client } from "@/types/client.types"; // Assuming Client is defined elsewhere
import { Project } from "@/types/project.types";

// --- 2. Component for a single project's details (the nested row) ---

interface ProjectDetailsRowProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onView: (project: Project) => void;
  onDelete: (project: Project) => void;
  //   onRequestInterview: (project: Project) => void; // New handler

  // Permissions for Project actions
  canManageProjects: boolean;
  canUpdateProjects: boolean;
  canDeleteProjects: boolean;
  canCreateInterview: boolean;
  openCreateInterviewModal: (open: boolean) => void;
  projectToSet: (project: Project) => void;
  //   canRequestInterviews: boolean;
}

const ProjectDetailsRow: React.FC<ProjectDetailsRowProps> = ({
  project,
  onUpdate,
  onView,
  onDelete,
  //   onRequestInterview,
  canManageProjects,
  canUpdateProjects,
  canDeleteProjects,
  canCreateInterview,
  openCreateInterviewModal,
  projectToSet,
  //   canRequestInterviews,
}) => (
  <div className="flex justify-between items-center py-3 border rounded-md px-4 hover:bg-gray-50">
    {/* Project Info */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 max-w-[calc(100%-220px)] sm:max-w-[calc(100%-250px)]">
      <p className="text-base font-medium text-foreground truncate">
        {project.name || "Unnamed Project"}
      </p>

      {/* Date and Status/Requests Badge */}
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {/* Status Badge */}
        <Badge
          variant={project.isDeleted ? "destructive" : "secondary"}
          className={`text-xs pointer-events-none ${
            project.isDeleted
              ? "bg-red-400 hover:bg-red-400 text-white"
              : "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-50/50"
          }`}
        >
          {project.isDeleted ? "Deleted" : "Active"}
        </Badge>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView?.(project)}
        className="w-8 h-8"
        title={`View ${project.name}`}
        disabled={!canManageProjects}
      >
        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onUpdate(project)}
        className="w-8 h-8"
        title={`Update ${project.name}`}
        disabled={project.isDeleted || !canUpdateProjects}
      >
        <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(project)}
        className="w-8 h-8"
        title={`Delete ${project.name}`}
        disabled={project.isDeleted || !canDeleteProjects}
      >
        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
      </Button>

      <Button
        variant="default"
        size="icon"
        onClick={() => {
          projectToSet(project);
          openCreateInterviewModal(true);
        }}
        className="w-8 h-8 bg-blue-500 hover:bg-blue-600"
        title={`Request Interview for ${project.name}`}
        disabled={project.isDeleted || !canCreateInterview}
      >
        <CalendarPlus className="w-4 h-4 text-white" />
      </Button>
    </div>
  </div>
);

// --- 3. Main Card Component (ClientProjectCard) ---
interface ClientProjectCardProps {
  client: Client;
  onCreateProject: () => void;
  onUpdateProject: (project: Project) => void;
  onViewProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  //   onRequestInterview: (project: Project) => void;

  // Permissions
  canManageProjects: boolean;
  canCreateProjects: boolean;
  canUpdateProjects: boolean;
  canDeleteProjects: boolean;
  canCreateInterview: boolean;
  openCreateInterviewModal: (open: boolean) => void;
  projectToSet: (project: Project) => void;
  //   canRequestInterviews: boolean;
}

const ClientProjectCard: React.FC<ClientProjectCardProps> = ({
  client,
  onCreateProject,
  onUpdateProject,
  onViewProject,
  onDeleteProject,
  //   onRequestInterview,
  canManageProjects,
  canCreateProjects,
  canUpdateProjects,
  canDeleteProjects,
  canCreateInterview,
  openCreateInterviewModal,
  projectToSet,
  //   canRequestInterviews,
}) => {
  console.log(canCreateInterview, "canCreateInterview in ClientProjectCard");

  return (
    <Card>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="text-sm text-muted-foreground"
        >
          <AccordionItem value="projects">
            {/* Custom Trigger Wrapper to include the Button */}
            <div className="flex justify-between items-center">
              <AccordionTrigger className="text-base font-semibold text-foreground !no-underline pr-4">
                Projects ({client.projects?.length || 0})
              </AccordionTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateProject}
                className="flex items-center gap-1 flex-shrink-0"
                disabled={!canCreateProjects}
              >
                <PlusCircle className="w-4 h-4" />
                Create
              </Button>
            </div>

            <AccordionContent className="pt-4 space-y-4">
              {client.projects && client.projects.length > 0 ? (
                <div className="space-y-2">
                  {client.projects.map((p) => (
                    <ProjectDetailsRow
                      key={p.id}
                      project={p}
                      onUpdate={onUpdateProject}
                      onView={onViewProject}
                      onDelete={onDeleteProject}
                      //   onRequestInterview={onRequestInterview}
                      canManageProjects={canManageProjects}
                      canUpdateProjects={canUpdateProjects}
                      canDeleteProjects={canDeleteProjects}
                      canCreateInterview={canCreateInterview}
                      openCreateInterviewModal={openCreateInterviewModal}
                      projectToSet={projectToSet}
                      //   canRequestInterviews={canRequestInterviews}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-muted-foreground">
                  No projects assigned to this client yet.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClientProjectCard;
