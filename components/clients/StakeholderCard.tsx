import { PlusCircle, Pencil, Eye, Trash2 } from "lucide-react"; // Assuming you have lucide-react icons
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Client } from "@/types/client.types";
import { ClientStakeholder } from "@/types/stakeholder.types";

// ... your other imports (Card, CardContent, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Badge, Button, etc.)

// --- Component for a single stakeholder's details (the nested accordion) ---

// Replace this with your actual Stakeholder type definition

interface StakeholderDetailsAccordionProps {
  clientStakeholder: ClientStakeholder;
  onUpdate: (stakeholder: ClientStakeholder) => void;
  onView: (stakeholder: ClientStakeholder) => void;
  onDelete: (stakeholder: ClientStakeholder) => void;
}

const StakeholderDetailsRow: React.FC<StakeholderDetailsAccordionProps> = ({
  clientStakeholder,
  onUpdate,
  onView,
  onDelete,
}) => (
  <div className="flex justify-between items-center py-3">
    {/* Stakeholder Info */}
    <div className="flex flex-col gap-1 max-w-[calc(100%-140px)]">
      <p className="text-base font-medium text-foreground truncate">
        {clientStakeholder.name}
      </p>
      {/* Uncomment if you want to show more info */}
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {clientStakeholder.isDeleted && (
          <Badge
            variant="destructive"
            className="bg-red-500 hover:bg-red-500 text-white pointer-events-none"
          >
            Deleted
          </Badge>
        )}
        {/* <Badge variant="outline">{clientStakeholder.email}</Badge>
        <Badge variant="outline">{clientStakeholder.phone}</Badge>
        <Badge variant="outline">{clientStakeholder.role}</Badge>
        <Badge variant="outline">{clientStakeholder.company}</Badge> */}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView?.(clientStakeholder)}
        className="w-8 h-8"
        title={`View ${clientStakeholder.name}`}
      >
        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onUpdate(clientStakeholder)}
        className="w-8 h-8"
        title={`Update ${clientStakeholder.name}`}
        disabled={clientStakeholder.isDeleted}
      >
        <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(clientStakeholder)}
        className="w-8 h-8"
        title={`Delete ${clientStakeholder.name}`}
        disabled={clientStakeholder.isDeleted}
      >
        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
      </Button>
    </div>
  </div>
);

// --- Main Card Component (Your initial code updated) ---

interface ClientStakeholderCardProps {
  client: Client;
  onCreateStakeholder: () => void; // Function to open the create form/modal
  onUpdateStakeholder: (stakeholder: ClientStakeholder) => void; // Function to open the update form/modal
  onViewStakeholder: (stakeholder: ClientStakeholder) => void; // Function to open the view details modal
  onDeleteStakeholder: (stakeholder: ClientStakeholder) => void; // Function to open the delete confirmation modal
}

const ClientStakeholderCard: React.FC<ClientStakeholderCardProps> = ({
  client,
  onCreateStakeholder,
  onUpdateStakeholder,
  onViewStakeholder,
  onDeleteStakeholder,
}) => {
  console.log("Rendering ClientStakeholderCard with client:", client);

  return (
    <Card>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="text-sm text-muted-foreground"
        >
          <AccordionItem value="stakeholders">
            {/* Custom Trigger Wrapper to include the Button */}
            <div className="flex justify-between items-center">
              <AccordionTrigger className="text-base font-semibold text-foreground !no-underline pr-4">
                Stakeholders ({client.stakeholders?.length || 0})
              </AccordionTrigger>
              <Button
                variant="outline" // Use a variant that fits your design (e.g., outline, secondary)
                size="sm"
                onClick={onCreateStakeholder} // Call the passed handler
                className="flex items-center gap-1 flex-shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Create
              </Button>
            </div>

            <AccordionContent className="pt-4 space-y-4">
              {client.stakeholders && client.stakeholders.length > 0 ? (
                <div className="space-y-2">
                  {client.stakeholders.map((s) => (
                    // Render the details accordion for each stakeholder
                    <StakeholderDetailsRow
                      key={s.id}
                      clientStakeholder={s}
                      onUpdate={onUpdateStakeholder}
                      onView={onViewStakeholder}
                      onDelete={onDeleteStakeholder}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-muted-foreground">
                  No stakeholders assigned
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClientStakeholderCard; // Or your actual export
