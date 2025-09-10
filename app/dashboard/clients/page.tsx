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
import { useSession } from "next-auth/react";

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const canCreateClients = session?.user?.accessScopes?.canCreateClients ?? false;

  const [refetch, setRefetch] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [name, setName] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [deletedStatus, setDeletedStatus] = useState("");

  // const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const debouncedName = useDebouncedValue(name, 500);
  const debouncedClientCode = useDebouncedValue(clientCode, 500);

  const fetchClients = async (
    page = 1,
    limit = 10,
    sortField?: string | null,
    sortOrder?: "asc" | "desc" | null,
    name?: string,
    clientCode?: string,
    deletedStatus?: string
  ) => {
    try {
      const clientService = ServiceFactory.getClientService();
      const result = await clientService.getAllClients({
        page,
        limit,
        sortField,
        sortOrder,
        name,
        clientCode,
        deletedStatus,
      });
      setClients(result.items);
      setTotalPages(result.totalPages);
      setPageIndex(result.currentPage - 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes and fetch users
  useEffect(() => {
    // If filters have changed, reset to page 1
    setPageIndex(0);
    fetchClients(
      1, // Always start from page 1 when filters change
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      debouncedClientCode,
      deletedStatus
    );
  }, [
    pageSize,
    sortField,
    sortOrder,
    debouncedName,
    debouncedClientCode,
    deletedStatus,
  ]);

  // Fetch users when pageIndex, pageSize, or sorting change (but not filters)
  useEffect(() => {
    fetchClients(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      debouncedClientCode,
      deletedStatus
    );
  }, [pageIndex]);

  // fetch based on refetch
  useEffect(() => {
    if (refetch === false) return;
    fetchClients(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedName,
      debouncedClientCode,
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
          href="/dashboard/clients"
          className="text-foreground font-semibold"
        >
          Client
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <Button
            className="h-8 px-3 text-sm"
            onClick={() => setOpenCreateModal(true)}
            disabled={!canCreateClients}
          >
            <IconPlus className="size-4" />
            <span>Create New</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage client profiles and monitor engagement workflows.
        </p>
      </div>

      {/* Data Table */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading clients...
            </span>
          </div>
        ) : (
          <ClientManagementTable
            clients={clients}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            name={name}
            setName={setName}
            clientCode={clientCode}
            setClientCode={setClientCode}
            deletedStatus={deletedStatus}
            setDeletedStatus={setDeletedStatus}
            // setOpenDetailsModal={setOpenUserDetailsModal}
            setSelectedClient={setSelectedClient}
            setOpenUpdateModal={setOpenUpdateModal}
            setOpenDeleteModal={setOpenDeleteModal}
          />
        )}
      </div>

      {/* create client modal */}
      <CreateClientModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        setRefetch={setRefetch}
      />

      {/* user info modal */}
      {/* <UserDetailsModal
        open={openUserDetailsModal}
        setOpen={setOpenUserDetailsModal}
        user={selectedUser}
      /> */}

      {/* update user modal */}
      <UpdateClientModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        setRefetch={setRefetch}
        client={selectedClient}
      />

      {/* delete user modal */}
      <DeleteClientModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        setRefetch={setRefetch}
        client={selectedClient}
      />
    </>
  );
}
