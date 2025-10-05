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
import ProjectCard from "@/components/clients/ProjectCard";
import { Project } from "@/types/project.types";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";
import { ProjectDetailsModal } from "@/components/project/ProjectDetailsModal";
import { UpdateProjectModal } from "@/components/project/UpdateProjectModal";
import { DeleteProjectModal } from "@/components/project/DeleteProjectModal";
import { Inter } from "next/font/google";
import ClientInterviewCard from "@/components/clients/InterviewCard";
import { Interview } from "@/types/interview.types";
import { InterviewDetailsModal } from "@/components/interview/InterviewDetailsModal";
import { UpdateInterviewModal } from "@/components/interview/UpdateInterviewModal";
import { DeleteInterviewModal } from "@/components/interview/DeleteInterviewModal";

export default function ClientDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [project, setProject] = useState<Project | null>(null);

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

  // State for Project Modals
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [openUpdateProjectModal, setOpenUpdateProjectModal] = useState(false);
  const [openViewProjectModal, setOpenViewProjectModal] = useState(false);
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null);
  const [projectToView, setProjectToView] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // State for Interview Modals
  const [openCreateInterviewModal, setOpenCreateInterviewModal] =
    useState(false);
  const [openUpdateInterviewModal, setOpenUpdateInterviewModal] =
    useState(false);
  const [openViewInterviewModal, setOpenViewInterviewModal] = useState(false);
  const [openDeleteInterviewModal, setOpenDeleteInterviewModal] =
    useState(false);
  const [interviewToUpdate, setInterviewToUpdate] = useState<Interview | null>(
    null
  );
  const [interviewToView, setInterviewToView] = useState<Interview | null>(
    null
  );
  const [interviewToDelete, setInterviewToDelete] = useState<Interview | null>(
    null
  );

  // State for Refetching Data
  const [refetch, setRefetch] = useState(false);

  // State for Client list (used by modals, currently only this client)
  const [clients, setClients] = useState<Client[]>([]);

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};
  console.log("User access scopes:", accessScopes); // Debug log

  const canCreateStakeholders = accessScopes.canCreateStakeholders ?? false;
  const canUpdateStakeholders = accessScopes.canUpdateStakeholders ?? false;
  const canDeleteStakeholders = accessScopes.canDeleteStakeholders ?? false;
  const canManageStakeholders = accessScopes.canManageStakeholders ?? false;

  const canCreateProjects = accessScopes.canCreateProjects ?? false;
  const canUpdateProjects = accessScopes.canUpdateProjects ?? false;
  const canDeleteProjects = accessScopes.canDeleteProjects ?? false;
  const canManageProjects = accessScopes.canManageProjects ?? false;

  const canCreateInterview = accessScopes.canCreateInterviews ?? false;
  const canUpdateInterview = accessScopes.canUpdateInterviews ?? false;
  const canDeleteInterview = accessScopes.canDeleteInterviews ?? false;
  const canManageInterview = accessScopes.canManageInterviews ?? false;

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
  // --- Stakeholder Modal Handlers ---

  // --- Project Modal Handlers (placeholders) ---
  const handleCreateProject = () => {
    setOpenCreateProjectModal(true);
  };

  const handleUpdateProject = (projectData: Project) => {
    // Set the ID of the stakeholder to update and open the update modal
    // You would use this ID to fetch/pre-fill the update form later.
    setProjectToUpdate(projectData);
    setOpenUpdateProjectModal(true);
  };

  const handleViewProject = (projectData: Project) => {
    setProjectToView(projectData);
    setOpenViewProjectModal(true);
  };

  const handleDeleteProject = (projectData: Project) => {
    setProjectToDelete(projectData);
    setOpenDeleteProjectModal(true);
  };
  // --- Project Modal Handlers ---

  // --- Interview Modal Handlers ---
  const handleCreateInterview = () => {
    setOpenCreateInterviewModal(true);
  };

  const handleUpdateInterview = (interviewData: Interview) => {
    setInterviewToUpdate(interviewData);
    setOpenUpdateInterviewModal(true);
  };

  const handleViewInterview = (interviewData: Interview) => {
    setInterviewToView(interviewData);
    setOpenViewInterviewModal(true);
  };

  const handleDeleteInterview = (interviewData: Interview) => {
    setInterviewToDelete(interviewData);
    setOpenDeleteInterviewModal(true);
  };
  // --- Interview Modal Handlers ---

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
              canManageStakeholders={canManageStakeholders}
              canCreateStakeholders={canCreateStakeholders}
              canUpdateStakeholders={canUpdateStakeholders}
              canDeleteStakeholders={canDeleteStakeholders}
            />

            {/* project section */}
            <ProjectCard
              client={client}
              // Pass the handlers to the card
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onViewProject={handleViewProject}
              onDeleteProject={handleDeleteProject}
              canManageProjects={canManageProjects}
              canCreateProjects={canCreateProjects}
              canUpdateProjects={canUpdateProjects}
              canDeleteProjects={canDeleteProjects}
              canCreateInterview={canCreateInterview}
              openCreateInterviewModal={setOpenCreateInterviewModal}
              projectToSet={setProject}
            />

            {/* Interviews Section */}
            <ClientInterviewCard
              client={client}
              // Pass the handlers to the card
              onCreateInterview={handleCreateInterview}
              onUpdateInterview={handleUpdateInterview} // Reusing project handlers for simplicity
              onViewInterview={handleViewInterview}
              onDeleteInterview={handleDeleteInterview}
              canManageInterviews={canManageInterview}
              canCreateInterviews={canCreateInterview}
              canUpdateInterviews={canUpdateInterview}
              canDeleteInterviews={canDeleteInterview}
            />
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
        project={project}
      />

      {/* Start Stakeholder modals */}
      {/* 2. Create Stakeholder Modal (NEW) */}
      {openCreateStakeholderModal && (
        <CreateClientStakeholderModal
          open={openCreateStakeholderModal}
          setOpen={setOpenCreateStakeholderModal}
          setRefetch={setRefetch} // This will trigger a re-fetch of client data
          clients={clients} // Pass the clients array (containing the current client)
        />
      )}

      {/* 3. View Stakeholder Modal (NEW) */}
      {openViewStakeholderModal && stakeholderToView && (
        <ClientStakeholderDetailsModal
          open={openViewStakeholderModal}
          setOpen={setOpenViewStakeholderModal}
          clientStakeholder={stakeholderToView}
        />
      )}

      {/* 4. Update Stakeholder Modal (new) */}
      {openUpdateStakeholderModal && stakeholderToUpdate && (
        <UpdateClientStakeholderModal
          open={openUpdateStakeholderModal}
          setOpen={setOpenUpdateStakeholderModal}
          setRefetch={setRefetch}
          stakeholder={stakeholderToUpdate}
          clients={clients}
        />
      )}

      {/* 5. Delete Stakeholder Modal (new) */}
      {openDeleteStakeholderModal && stakeholderToDelete && (
        <DeleteClientStakeholderModal
          open={openDeleteStakeholderModal}
          setOpen={setOpenDeleteStakeholderModal}
          setRefetch={setRefetch}
          stakeholder={stakeholderToDelete}
        />
      )}
      {/* End Stakeholders modals */}

      {/* Start Project modals */}
      {/* 6. Create Project Modal */}
      {openCreateProjectModal && (
        <CreateProjectModal
          open={openCreateProjectModal}
          setOpen={setOpenCreateProjectModal}
          setRefetch={setRefetch}
          clients={clients}
        />
      )}

      {/* 7. View Stakeholder Modal (NEW) */}
      {openViewProjectModal && projectToView && (
        <ProjectDetailsModal
          open={openViewProjectModal}
          setOpen={setOpenViewProjectModal}
          project={projectToView}
        />
      )}

      {/* 8. Update Project Modal (NEW) */}
      {openUpdateProjectModal && projectToUpdate && (
        <UpdateProjectModal
          open={openUpdateProjectModal}
          setOpen={setOpenUpdateProjectModal}
          setRefetch={setRefetch}
          project={projectToUpdate}
          clients={clients}
        />
      )}

      {/* 9. Delete Project Modal (NEW) */}
      {openDeleteProjectModal && projectToDelete && (
        <DeleteProjectModal
          open={openDeleteProjectModal}
          setOpen={setOpenDeleteProjectModal}
          setRefetch={setRefetch}
          project={projectToDelete}
        />
      )}
      {/* End Project modals */}

      {/* Start Interview modals */}
      {/* 10.View Interview Modal (NEW) */}
      {openViewInterviewModal && interviewToView && (
        <InterviewDetailsModal
          open={openViewInterviewModal}
          setOpen={setOpenViewInterviewModal}
          interview={interviewToView}
        />
      )}

      {/* 11. Update Interview Modal (NEW) */}
      {openUpdateInterviewModal && interviewToUpdate && (
        <UpdateInterviewModal
          open={openUpdateInterviewModal}
          setOpen={setOpenUpdateInterviewModal}
          setRefetch={setRefetch}
          interview={interviewToUpdate}
          clients={clients}
          setSelectedInterview={() => {}}
        />
      )}

      {/* 12. Delete Interview Modal (NEW) */}
      {openDeleteInterviewModal && interviewToDelete && (
        <DeleteInterviewModal
          open={openDeleteInterviewModal}
          setOpen={setOpenDeleteInterviewModal}
          setRefetch={setRefetch}
          interview={interviewToDelete}
        />
      )}
      {/* End Interview modals */}
    </>
  );
}
