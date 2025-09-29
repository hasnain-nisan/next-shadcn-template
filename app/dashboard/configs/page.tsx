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
import { ClientStakeholder } from "@/types/stakeholder.types";
import { Project } from "@/types/project.types";
import { ProjectManagementTable } from "@/components/project/ProjectManagementTable";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";
import { UpdateProjectModal } from "@/components/project/UpdateProjectModal";
import { DeleteProjectModal } from "@/components/project/DeleteProjectModal";
import { useSession } from "next-auth/react";
import { Config } from "@/types/config.types";
import { ConfigManagementTable } from "@/components/config/ConfigManagementTable";
import { CreateConfigModal } from "@/components/config/CreateConfigModal";
import { UpdateConfigModal } from "@/components/config/UpdateConfigModal";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};

  const canCreateConfigs = accessScopes.canCreateConfig ?? false;

  const [refetch, setRefetch] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [projectId, setProjectId] = useState("all");
  const [version, setVersion] = useState("all");
  const [isLatest, setIsLatest] = useState("all");
  const [deletedStatus, setDeletedStatus] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(null);

  const [serachTermProject, setSearchTermProject] = useState("");

  const fetchConfigs = async (
    page = 1,
    limit = 10,
    sortField?: string | null,
    sortOrder?: "asc" | "desc" | null,
    projectId?: string,
    version?: string,
    isLatest?: string,
    deletedStatus?: string
  ) => {
    try {
      const configService = ServiceFactory.getConfigService();
      const result = await configService.getAll({
        page,
        limit,
        sortField,
        sortOrder,
        projectId,
        version: Number(version),
        // is_latest: isLatest,
        deletedStatus,
      });
      setConfigs(result.items);
      setTotalPages(result.totalPages);
      setPageIndex(result.currentPage - 1);
    } catch (error) {
      console.error("Failed to fetch configs:", error);
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
        deletedStatus: "false",
      });
      setProjects(result.items);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(serachTermProject.toLowerCase())
    );
  }, [serachTermProject, projects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle filter changes and fetch users
  useEffect(() => {
    // If filters have changed, reset to page 1
    setPageIndex(0);
    fetchConfigs(
      1, // Always start from page 1 when filters change
      pageSize,
      sortField,
      sortOrder,
      projectId,
      version,
      isLatest,
      deletedStatus
    );
  }, [
    pageSize,
    sortField,
    sortOrder,
    projectId,
    version,
    isLatest,
    deletedStatus,
  ]);

  // Fetch users when pageIndex, pageSize, or sorting change (but not filters)
  useEffect(() => {
    fetchConfigs(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      projectId,
      version,
      isLatest,
      deletedStatus
    );
  }, [pageIndex]);

  // fetch based on refetch
  useEffect(() => {
    if (refetch === false) return;
    fetchConfigs(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      projectId,
      version,
      isLatest,
      deletedStatus
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
          href="/dashboard/configs"
          className="text-foreground font-semibold"
        >
          Configs
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Configs</h1>
          <Button
            className="h-8 px-3 text-sm"
            onClick={() => setOpenCreateModal(true)}
            disabled={!canCreateConfigs}
          >
            <IconPlus className="size-4" />
            <span>Create Config</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage versioned configuration snapshots for n8n workflows, including
          project mappings, GDrive integration, and category-based user story
          definitions. Each config is tied to a project and supports rollback,
          audit trails, and granular updates.
        </p>
      </div>

      {/* Data Table */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading Configs...
            </span>
          </div>
        ) : (
          <ConfigManagementTable
            configs={configs}
            projects={projects}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            projectId={projectId}
            setProjectId={setProjectId}
            version={version}
            setVersion={setVersion}
            isLatest={isLatest}
            setIsLatest={setIsLatest}
            deletedStatus={deletedStatus}
            setDeletedStatus={setDeletedStatus}
            setSelectedConfig={setSelectedConfig}
            setOpenUpdateModal={setOpenUpdateModal}
            setOpenDeleteModal={setOpenDeleteModal}
            filteredProjects={filteredProjects}
            searchTermProject={serachTermProject}
            setSearchTermProject={setSearchTermProject}
          />
        )}
      </div>

      {/* create client modal */}
      <CreateConfigModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        setRefetch={setRefetch}
        projects={projects}
      />

      {/* user info modal */}
      {/* <UserDetailsModal
        open={openUserDetailsModal}
        setOpen={setOpenUserDetailsModal}
        user={selectedUser}
      /> */}

      {/* update user modal */}
      <UpdateConfigModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        setRefetch={setRefetch}
        config={selectedConfig}
        projects={projects}
      />

      {/* delete user modal */}
      {/* <DeleteProjectModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        setRefetch={setRefetch}
        project={selectedProject}
      /> */}
    </>
  );
}
