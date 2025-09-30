"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Client } from "@/types/client.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CreateInterviewModal } from "@/components/interview/CreateInterviewModal";
// Import the new modal component
import { useSession } from "next-auth/react";
import ClientStakeholderCard from "@/components/clients/StakeholderCard"; // Assuming this is the correct path
import { CreateClientStakeholderModal } from "@/components/client-stakeholder/CreateClientStakeholderModal";
import { ClientStakeholder } from "@/types/stakeholder.types";
import { ClientStakeholderDetailsModal } from "@/components/client-stakeholder/ClientStakeholderDetailsModal";
import { UpdateClientStakeholderModal } from "@/components/client-stakeholder/UpdateClientStakeholderModal";
import { DeleteClientStakeholderModal } from "@/components/client-stakeholder/DeleteClientStakeholderModal";

export default function ClientDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Interview Modal
  const [openCreateInterviewModal, setOpenCreateInterviewModal] =
    useState(false);
  const [projectId, setProjectId] = useState<string>("");

  // State for Stakeholder Modals
  const [openCreateStakeholderModal, setOpenCreateStakeholderModal] =
    useState(false);
  const [openUpdateStakeholderModal, setOpenUpdateStakeholderModal] =
    useState(false);
  const [openViewStakeholderModal, setOpenViewStakeholderModal] = // 2. State for View Modal
    useState(false);
  const [stakeholderToUpdate, setStakeholderToUpdate] =
    useState<ClientStakeholder | null>(null);
  const [stakeholderToView, setStakeholderToView] = // 2. State for View Data
    useState<ClientStakeholder | null>(null);
  const [openDeleteStakeholderModal, setOpenDeleteStakeholderModal] =
    useState(false);
  const [stakeholderToDelete, setStakeholderToDelete] =
    useState<ClientStakeholder | null>(null);

  // State for Refetching Data
  const [refetch, setRefetch] = useState(false);

  // State for Client list (used by modals, currently only this client)
  const [clients, setClients] = useState<Client[]>([]);

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};
  const canCreateInterviews = accessScopes.canCreateInterviews ?? false;

  // Function to fetch client data
  const fetchClient = async () => {
    try {
      setLoading(true);
      const clientService = ServiceFactory.getClientService();
      // Ensure the service fetches updated client data, including stakeholders
      const data = (await clientService.getClientById(id)) as unknown as {
        data: Client;
      };
      setClient(data as unknown as Client);
      // 'clients' array for the modal/dropdown should contain the current client
      setClients([data as unknown as Client]);
      setError(null);
    } catch (err) {
      console.error("Fetch client error:", err);
      setError("Failed to load client details.");
    } finally {
      setLoading(false);
      setRefetch(false); // Reset refetch flag
    }
  };

  useEffect(() => {
    fetchClient();
    // Re-run fetch when refetch state is true (after successful creation/update)
  }, [id, refetch]);

  // --- Stakeholder Modal Handlers ---

  const handleCreateStakeholder = () => {
    // Open the create modal
    setOpenCreateStakeholderModal(true);
  };

  const handleUpdateStakeholder = (stakeholderData: ClientStakeholder) => {
    // Set the ID of the stakeholder to update and open the update modal
    // You would use this ID to fetch/pre-fill the update form later.
    setStakeholderToUpdate(stakeholderData);
    setOpenUpdateStakeholderModal(true);
  };

  const handleViewStakeholder = (stakeholderData: ClientStakeholder) => {
    setStakeholderToView(stakeholderData);
    setOpenViewStakeholderModal(true);
  };

  const handleDeleteStakeholder = (stakeholderData: ClientStakeholder) => {
    setStakeholderToDelete(stakeholderData);
    setOpenDeleteStakeholderModal(true);
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/dashboard/clients"
          className="hover:text-foreground font-medium"
        >
          Clients
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Details</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Client Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View client profile, creator info, and engagement metadata.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading client details...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-10">{error}</div>
        ) : client ? (
          <>
            {/* Info Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="client">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Client Info
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Row 1: Name, Code, Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Name:
                          </span>
                          <p className="text-black">{client.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Code:
                          </span>
                          <Badge variant="outline" className="px-3 py-1">
                            {client.clientCode}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Status:
                          </span>
                          <Badge
                            className={`px-3 py-1 ${
                              client.isDeleted
                                ? "bg-red-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {client.isDeleted ? "Deleted" : "Active"}
                          </Badge>
                        </div>
                      </div>

                      {/* Row 2: CreatedBy & UpdatedBy */}
                      <div className="pt-6 border-t space-y-4">
                        <h3 className="font-semibold text-foreground">
                          Audit Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <span className="font-medium text-foreground">
                              Created By:
                            </span>
                            <p className="text-black">
                              {client.createdBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(client.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Updated By:
                            </span>
                            <p className="text-black">
                              {client.updatedBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(client.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Stakeholders section (using ClientStakeholderCard) */}
            <ClientStakeholderCard
              client={client}
              // Pass the handlers to the card
              onCreateStakeholder={handleCreateStakeholder}
              onUpdateStakeholder={handleUpdateStakeholder}
              onViewStakeholder={handleViewStakeholder}
              onDeleteStakeholder={handleDeleteStakeholder}
            />

            {/* Projects Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="projects">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Projects ({client.projects?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.projects?.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No projects assigned to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.projects.map((project, index) => (
                            <div
                              key={index}
                              className="space-y-3 border p-4 rounded-md shadow-sm bg-white"
                            >
                              {/* Project Name */}
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Project Name:
                                </span>
                                <p className="text-black">
                                  {project.name || "Unnamed Project"}
                                </p>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Status:
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`px-3 py-1 ${
                                    project.isDeleted
                                      ? "border-red-500 text-red-600"
                                      : "border-green-500 text-green-600"
                                  }`}
                                >
                                  {project.isDeleted ? "Deleted" : "Active"}
                                </Badge>
                              </div>

                              {/* Action Button */}
                              <div className="pt-3">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    setProjectId(project.id);
                                    setOpenCreateInterviewModal(true);
                                  }}
                                  disabled={
                                    project.isDeleted || !canCreateInterviews
                                  }
                                >
                                  Request Interview
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Interviews Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="interviews">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Interviews ({client.interviews?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.interviews?.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No interviews linked to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.interviews.map((interview, index) => (
                            <div
                              key={index}
                              className="space-y-2 border p-4 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Interview Title:
                                </span>
                                <p className="text-black">
                                  {interview.name || `Interview ${index + 1}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Date:
                                </span>
                                <p className="text-black">
                                  {interview.date
                                    ? new Date(
                                        interview.date
                                      ).toLocaleDateString()
                                    : "—"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-10">
            No client data found.
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* 1. Create Interview Modal */}
      <CreateInterviewModal
        open={openCreateInterviewModal}
        setOpen={setOpenCreateInterviewModal}
        setRefetch={setRefetch}
        clients={clients}
        id={client?.id}
        projectId={projectId}
      />

      {/* 2. Create Stakeholder Modal (NEW) */}
      <CreateClientStakeholderModal
        open={openCreateStakeholderModal}
        setOpen={setOpenCreateStakeholderModal}
        setRefetch={setRefetch} // This will trigger a re-fetch of client data
        clients={clients} // Pass the clients array (containing the current client)
      />

      {/* 3. View Stakeholder Modal (NEW) */}
      {openViewStakeholderModal && stakeholderToView && (
        <ClientStakeholderDetailsModal
          open={openViewStakeholderModal}
          setOpen={setOpenViewStakeholderModal}
          clientStakeholder={stakeholderToView}
        />
      )}

      {/* 4. Update Stakeholder Modal (new) */}
      <UpdateClientStakeholderModal
        open={openUpdateStakeholderModal}
        setOpen={setOpenUpdateStakeholderModal}
        setRefetch={setRefetch}
        stakeholder={stakeholderToUpdate}
        clients={clients}
      />

      {/* 5. Delete Stakeholder Modal (new) */}
      {openDeleteStakeholderModal && stakeholderToDelete && (
        <DeleteClientStakeholderModal
          open={openDeleteStakeholderModal}
          setOpen={setOpenDeleteStakeholderModal}
          setRefetch={setRefetch}
          stakeholder={stakeholderToDelete}
        />
      )}

      {/* 3. Update Stakeholder Modal (Placeholder) */}
      {/* You would create an UpdateClientStakeholderModal similar to the create one.
        It would receive `stakeholderToUpdateId` and `setOpenUpdateStakeholderModal`.
      */}
      {/* {openUpdateStakeholderModal && (
        <UpdateClientStakeholderModal
          open={openUpdateStakeholderModal}
          setOpen={setOpenUpdateStakeholderModal}
          setRefetch={setRefetch}
          stakeholderId={stakeholderToUpdateId}
          clients={clients}
        />
      )} */}
    </>
  );
}
