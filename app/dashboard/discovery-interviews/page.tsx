/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Client } from "@/types/client.types";
import { Project } from "@/types/project.types";
import { Interview } from "@/types/interview.types";
import { InterviewManagementTable } from "@/components/interview/InterviewManagementTable";
import { CreateInterviewModal } from "@/components/interview/CreateInterviewModal";
import { UpdateInterviewModal } from "@/components/interview/UpdateInterviewModal";
import { DeleteInterviewModal } from "@/components/interview/DeleteInterviewModal";
import { useSession } from "next-auth/react";
import { ClientStakeholder } from "@/types/stakeholder.types";

export default function InterviewsPage() {
  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};
  const canCreateInterviews = accessScopes.canCreateInterviews ?? false;

  const [refetch, setRefetch] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stakeholders, setStakeholders] = useState<ClientStakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [stakeholderId, setStakeholderId] = useState("all");
  const [deletedStatus, setDeletedStatus] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  const [searchTermClient, setSearchTermClient] = useState("");
  const [searchTermProject, setSearchTermProject] = useState("");
  const [searchTermStakeholder, setSearchTermStakeholder] = useState("");

  const debouncedName = useDebouncedValue(name, 500);

  const fetchInterviews = async (
    page = 1,
    limit = 10,
    sortField?: string | null,
    sortOrder?: "asc" | "desc" | null,
    name?: string,
    clientId?: string,
    projectId?: string,
    stakeholderId?: string,
    deletedStatus?: string,
    startDate?: string | undefined,
    endDate?: string | undefined
  ) => {
    try {
      const interviewService = ServiceFactory.getInterviewService();
      const result = await interviewService.getAll({
        page,
        limit,
        sortField,
        sortOrder,
        name,
        clientId,
        projectId,
        stakeholderId,
        deletedStatus,
        startDate,
        endDate,
      });
      setInterviews(result.items);
      setTotalPages(result.totalPages);
      setPageIndex(result.currentPage - 1);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const clientService = ServiceFactory.getClientService();
      const result = await clientService.getAllClients({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        clientCode: undefined,
        deletedStatus: "false",
      });
      setClients(result.items);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectService = ServiceFactory.getProjectService();
      const result = await projectService.getAll({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        clientId: clientId !== "all" ? clientId : undefined,
        deletedStatus: "false",
      });
      setProjects(result.items);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchStakeholders = async () => {
    try {
      const service = ServiceFactory.getClientStakeholderService();
      const result = await service.getAll({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        clientId: clientId !== "all" ? clientId : undefined,
        deletedStatus: "false",
      });
      setStakeholders(result.items);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStakeholders();
  }, [clientId]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTermProject.toLowerCase())
    );
  }, [searchTermProject, projects]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTermClient.toLowerCase())
    );
  }, [searchTermClient, clients]);

  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter((stakeholder) =>
      stakeholder.name.toLowerCase().includes(searchTermStakeholder.toLowerCase())
    );
  }, [searchTermStakeholder, stakeholders]);

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle filter changes and fetch users
  useEffect(() => {
    // If filters have changed, reset to page 1
    setPageIndex(0);
    fetchInterviews(
      1, // Always start from page 1 when filters change
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
      projectId,
      stakeholderId,
      deletedStatus,
      startDate ?? undefined,
      endDate ?? undefined
    );
  }, [
    pageSize,
    sortField,
    sortOrder,
    debouncedName,
    clientId,
    projectId,
    stakeholderId,
    deletedStatus,
    startDate,
    endDate,
  ]);

  // Fetch users when pageIndex, pageSize, or sorting change (but not filters)
  useEffect(() => {
    fetchInterviews(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
      projectId,
      stakeholderId,
      deletedStatus,
      startDate ?? undefined,
      endDate ?? undefined
    );
  }, [pageIndex]);

  // fetch based on refetch
  useEffect(() => {
    if (refetch === false) return;
    fetchInterviews(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
      projectId,
      stakeholderId,
      deletedStatus,
      startDate ?? undefined,
      endDate ?? undefined
    );
    setRefetch(false);
  }, [refetch]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/dashboard/interviews"
          className="text-foreground font-semibold"
        >
          Interviews
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Interviews</h1>
          <Button
            className="h-8 px-3 text-sm"
            onClick={() => setOpenCreateModal(true)}
            disabled={!canCreateInterviews}
          >
            <IconPlus className="size-4" />
            <span>Create New</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage discovery interviews linked to clients and projects. Filter by
          date, client, or project.
        </p>
      </div>

      {/* Data Table */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading interviews...
            </span>
          </div>
        ) : (
          <InterviewManagementTable
            interviews={interviews}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            name={name}
            setName={setName}
            clientId={clientId}
            setClientId={setClientId}
            projectId={projectId}
            setProjectId={setProjectId}
            stakeholderId={stakeholderId}
            setStakeholderId={setStakeholderId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            deletedStatus={deletedStatus}
            setDeletedStatus={setDeletedStatus}
            // setOpenDetailsModal={setOpenUserDetailsModal}
            setSelectedInterview={setSelectedInterview}
            setOpenUpdateModal={setOpenUpdateModal}
            setOpenDeleteModal={setOpenDeleteModal}
            filteredClients={filteredClients}
            searchTermClient={searchTermClient}
            setSearchTermClient={setSearchTermClient}
            filteredProjects={filteredProjects}
            searchTermProject={searchTermProject}
            setSearchTermProject={setSearchTermProject}
            filteredStakeholders={filteredStakeholders}
            searchTermStakeholder={searchTermStakeholder}
            setSearchTermStakeholder={setSearchTermStakeholder}
          />
        )}
      </div>

      {/* create client modal */}
      <CreateInterviewModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        setRefetch={setRefetch}
        clients={clients}
      />

      {/* user info modal */}
      {/* <UserDetailsModal
        open={openUserDetailsModal}
        setOpen={setOpenUserDetailsModal}
        user={selectedUser}
      /> */}

      {/* update modal */}
      <UpdateInterviewModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        setRefetch={setRefetch}
        interview={selectedInterview}
        setSelectedInterview={setSelectedInterview}
        clients={clients}
      />

      {/* delete user modal */}
      <DeleteInterviewModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        setRefetch={setRefetch}
        interview={selectedInterview}
      />
    </>
  );
}
