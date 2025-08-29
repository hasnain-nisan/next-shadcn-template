/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { User } from "@/types/user.types";
import { UserManagementTable } from "@/components/users/UserManagementTable";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CreateUserModal } from "@/components/users/CreateUserModal";

export default function UsersPage() {
  const [refetch, setRefetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [deletedStatus, setDeletedStatus] = useState("");
  const [accessScopes, setAccessScopes] = useState<string[]>([]);

  const debouncedEmail = useDebouncedValue(email, 500);

  const fetchUsers = async (
    page = 1,
    limit = 10,
    sortField?: string | null,
    sortOrder?: "asc" | "desc" | null,
    email?: string,
    role?: string,
    deletedStatus?: string,
    accessScopes?: string[]
  ) => {
    try {
      const userService = ServiceFactory.getUserService();
      const result = await userService.getAllUsers({
        page,
        limit,
        sortField,
        sortOrder,
        email,
        role,
        deletedStatus,
        accessScopes,
      });
      setUsers(result.items);
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
    fetchUsers(
      1, // Always start from page 1 when filters change
      pageSize,
      sortField,
      sortOrder,
      debouncedEmail,
      role,
      deletedStatus,
      accessScopes
    );
  }, [
    pageSize,
    sortField,
    sortOrder,
    debouncedEmail,
    role,
    deletedStatus,
    accessScopes,
  ]);

  // Fetch users when pageIndex, pageSize, or sorting change (but not filters)
  useEffect(() => {
    fetchUsers(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedEmail,
      role,
      deletedStatus,
      accessScopes
    );
  }, [pageIndex]);

  // fetch based on refetch
  useEffect(() => {
    if (refetch === false) return;
    fetchUsers(
      pageIndex + 1,
      pageSize,
      sortField,
      sortOrder,
      debouncedEmail,
      role,
      deletedStatus,
      accessScopes
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
        <Link href="/dashboard/users" className="text-foreground font-semibold">
          Users
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <Button className="h-8 px-3 text-sm" onClick={() => setOpen(true)}>
            <IconPlus className="size-4" />
            <span>Create New</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage platform users, assign roles, and control access across
          administrative levels.
        </p>
      </div>

      {/* Data Table */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading users...
            </span>
          </div>
        ) : (
          <UserManagementTable
            users={users}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            email={email}
            setEmail={setEmail}
            role={role}
            setRole={setRole}
            deletedStatus={deletedStatus}
            setDeletedStatus={setDeletedStatus}
            accessScopes={accessScopes}
            setAccessScopes={setAccessScopes}
          />
        )}
      </div>

      {/* create use modal */}
      <CreateUserModal
        open={open}
        setOpen={setOpen}
        setRefetch={setRefetch}
      />
    </>
  );
}
