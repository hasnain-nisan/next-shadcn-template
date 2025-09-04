/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { UserDetailsModal } from "@/components/users/UserDetailsModal";
import { Client } from "@/types/client.types";
import { ClientManagementTable } from "@/components/clients/ClientManagementTable";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { UpdateClientModal } from "@/components/clients/UpdateClientModal";
import { DeleteClientModal } from "@/components/clients/DeleteClientModal";
import { ClientStakeholder } from "@/types/stakeholder.types";
import { StakeholderManagementTable } from "@/components/client-stakeholder/StakeholderManagementTable";
import { CreateClientStakeholderModal } from "@/components/client-stakeholder/CreateClientStakeholderModal";
import { UpdateClientStakeholderModal } from "@/components/client-stakeholder/UpdateClientStakeholderModal";
import { DeleteClientStakeholderModal } from "@/components/client-stakeholder/DeleteClientStakeholderModal";

export default function ClientsPage() {
  const [refetch, setRefetch] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [stakeholders, setStakeholders] = useState<ClientStakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("all");
  const [deletedStatus, setDeletedStatus] = useState("");

  // const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] =
    useState<ClientStakeholder | null>(null);

  const debouncedName = useDebouncedValue(name, 500);

  const fetchStakeholders = async (
    page = 1,
    limit = 10,
    sortField?: string | null,
    sortOrder?: "asc" | "desc" | null,
    name?: string,
    clientId?: string,
    deletedStatus?: string
  ) => {
    try {
      const stakeholderService = ServiceFactory.getClientStakeholderService();
      const result = await stakeholderService.getAll({
        page,
        limit,
        sortField,
        sortOrder,
        name,
        clientId,
        deletedStatus,
      });
      setStakeholders(result.items);
      setTotalPages(result.totalPages);
      setPageIndex(result.currentPage - 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle filter changes and fetch users
  useEffect(() => {
    // If filters have changed, reset to page 1
    setPageIndex(0);
    fetchStakeholders(
      1, // Always start from page 1 when filters change
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
      deletedStatus
    );
  }, [pageSize, sortField, sortOrder, debouncedName, clientId, deletedStatus]);

  // Fetch users when pageIndex, pageSize, or sorting change (but not filters)
  useEffect(() => {
    fetchStakeholders(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
      deletedStatus
    );
  }, [pageIndex]);

  // fetch based on refetch
  useEffect(() => {
    if (refetch === false) return;
    fetchStakeholders(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      clientId,
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
          href="/dashboard/client-stakeholders"
          className="text-foreground font-semibold"
        >
          Client Stakeholder
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <Button
            className="h-8 px-3 text-sm"
            onClick={() => setOpenCreateModal(true)}
          >
            <IconPlus className="size-4" />
            <span>Create New</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage stakeholders linked to clients, including contact
          details, project associations, and engagement status.
        </p>
      </div>

      {/* Data Table */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading Client stakeholders...
            </span>
          </div>
        ) : (
          <StakeholderManagementTable
            stakeholders={stakeholders}
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
            deletedStatus={deletedStatus}
            setDeletedStatus={setDeletedStatus}
            // setOpenDetailsModal={setOpenUserDetailsModal}
            setSelectedStakeholder={setSelectedStakeholder}
            setOpenUpdateModal={setOpenUpdateModal}
            setOpenDeleteModal={setOpenDeleteModal}
            clients={clients}
          />
        )}
      </div>

      {/* create client modal */}
      <CreateClientStakeholderModal
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

      {/* update user modal */}
      <UpdateClientStakeholderModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        setRefetch={setRefetch}
        stakeholder={selectedStakeholder}
        clients={clients}
      />

      {/* delete user modal */}
      <DeleteClientStakeholderModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        setRefetch={setRefetch}
        stakeholder={selectedStakeholder}
      />
    </>
  );
}
