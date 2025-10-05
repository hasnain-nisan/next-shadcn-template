import React from "react";
import {
  MessageCircle,
  Calendar,
  Folder,
  Eye,
  Pencil,
  Trash2,
  CalendarPlus,
  PlusCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { Client } from "@/types/client.types";
import { Interview } from "@/types/interview.types";

// Assuming these types are defined in your application
// import { Client } from "@/types/client.types";
// import { Interview } from "@/types/interview.types"; // New type needed

// --- 2. Component for a single interview's details (the nested row) ---

interface InterviewDetailsRowProps {
  interview: Interview;
  onUpdate: (interview: Interview) => void;
  onView: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;

  // Permissions for Interview actions
  canManageInterviews: boolean;
  canUpdateInterviews: boolean;
  canDeleteInterviews: boolean;
}

const InterviewDetailsRow: React.FC<InterviewDetailsRowProps> = ({
  interview,
  onUpdate,
  onView,
  onDelete,
  canManageInterviews,
  canUpdateInterviews,
  canDeleteInterviews,
}) => {
  const formattedDate = interview.date
    ? format(new Date(interview.date), "MMMM do, yyyy") // Matches "October 6th, 2025" style
    : "Date not set";

  const isDeleted = interview.isDeleted;

  // Use smaller size for icons in the info row to match the image
  const InfoIcon = (props: { className?: string }) => (
    <Calendar className={`w-4 h-4 text-gray-500 ${props.className}`} />
  );
  const LinkIcon = (props: { className?: string }) => (
    <MessageCircle className={`w-4 h-4 text-gray-500 ${props.className}`} />
  );

  return (
    <div className="flex flex-col py-3 px-4 border rounded-md hover:bg-gray-50 transition-colors">
      {/* Row 1: Name and Status Badge */}
      <div className="flex justify-between items-center mb-2">
        {/* Name */}
        <p className="text-base font-semibold text-foreground truncate max-w-[calc(100%-120px)]">
          {interview.name || "Unnamed Interview"}
        </p>

        {/* Status Badge - Pushed to the right of the name */}
        <Badge
          variant={isDeleted ? "destructive" : "secondary"}
          className={`text-xs pointer-events-none flex-shrink-0 ${
            isDeleted
              ? "bg-red-400 hover:bg-red-400 text-white"
              : "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-50/50"
          } h-5`}
        >
          {isDeleted ? "Deleted" : "Active"}
        </Badge>
      </div>

      {/* Row 2: Date, Project, and Action Buttons (Aligned to right) */}
      <div className="flex justify-between items-center mt-2">
        {/* Date and Project Details (Left) */}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {/* Date */}
          <div className="flex items-center text-sm font-medium text-gray-700">
            <InfoIcon className="mr-2" />
            <span>{formattedDate}</span>
          </div>

          {/* Project Name (Linked to: Naruto) */}
          <div className="flex items-center text-sm text-gray-500">
            <LinkIcon className="mr-2" />
            Linked to:
            <span className="font-medium ml-1 text-gray-700">
              {interview.project.name || "No Project"}
            </span>
          </div>
        </div>

        {/* Action Buttons (Right) */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(interview)}
            className="w-8 h-8"
            title={`View ${interview.name}`}
            disabled={!canManageInterviews}
          >
            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate(interview)}
            className="w-8 h-8"
            title={`Update ${interview.name}`}
            disabled={isDeleted || !canUpdateInterviews}
          >
            <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(interview)}
            className="w-8 h-8"
            title={`Delete ${interview.name}`}
            disabled={isDeleted || !canDeleteInterviews}
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Card Component (ClientInterviewCard) ---
interface ClientInterviewCardProps {
  client: Client;
  onCreateInterview: () => void;
  onUpdateInterview: (interview: Interview) => void;
  onViewInterview: (interview: Interview) => void;
  onDeleteInterview: (interview: Interview) => void;

  // Permissions
  canManageInterviews: boolean;
  canCreateInterviews: boolean;
  canUpdateInterviews: boolean;
  canDeleteInterviews: boolean;
}

const ClientInterviewCard: React.FC<ClientInterviewCardProps> = ({
  client,
  onCreateInterview,
  onUpdateInterview,
  onViewInterview,
  onDeleteInterview,
  canManageInterviews,
  canCreateInterviews,
  canUpdateInterviews,
  canDeleteInterviews,
}) => {
  const interviewCount = client.interviews?.length || 0;

  return (
    <Card>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="text-sm text-muted-foreground"
        >
          <AccordionItem value="interviews">
            {/* Custom Trigger Wrapper to include the Button */}
            <div className="flex justify-between items-center">
              <AccordionTrigger className="text-base font-semibold text-foreground !no-underline pr-4">
                Interviews ({interviewCount})
              </AccordionTrigger>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={onCreateInterview}
                className="flex items-center gap-1 flex-shrink-0"
                disabled={!canCreateInterviews}
              >
                <PlusCircle className="w-4 h-4" />
                Create
              </Button> */}
            </div>

            <AccordionContent className="pt-4 space-y-4">
              {interviewCount > 0 ? (
                <div className="space-y-2">
                  {client.interviews.map((i) => (
                    <InterviewDetailsRow
                      key={i.id}
                      interview={i}
                      onUpdate={onUpdateInterview}
                      onView={onViewInterview}
                      onDelete={onDeleteInterview}
                      canManageInterviews={canManageInterviews}
                      canUpdateInterviews={canUpdateInterviews}
                      canDeleteInterviews={canDeleteInterviews}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-muted-foreground">
                  No interviews recorded for this client yet.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClientInterviewCard;
