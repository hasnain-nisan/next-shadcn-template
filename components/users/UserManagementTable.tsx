"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Shield,
  Calendar,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumns } from "./TableColumns";
import type { User } from "@/types/user.types";
import { AccessScopeFilter } from "./AccessScopeFilter";

export function UserManagementTable({
  users,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  setSortField,
  setSortOrder,
  email,
  setEmail,
  role,
  setRole,
  deletedStatus,
  setDeletedStatus,
  accessScopes,
  setAccessScopes,
}: Readonly<{
  users: User[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: "asc" | "desc" | null) => void;
  email: string;
  setEmail: (email: string) => void;
  role: string;
  setRole: (role: string) => void;
  deletedStatus: string;
  setDeletedStatus: (deletedStatus: string) => void;
  accessScopes: string[];
  setAccessScopes: (accessScopes: string[]) => void;
}>) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users,
    columns: TableColumns,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (newSorting.length > 0) {
        setSortField(newSorting[0].id);
        setSortOrder(newSorting[0].desc ? "desc" : "asc");
      } else {
        setSortField(null);
        setSortOrder(null);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div>
      <div className="w-full pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-6">
          {/* Email Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="email"
              className="text-sm text-muted-foreground mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              placeholder="Filter emails..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="role"
              className="text-sm text-muted-foreground mb-1"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">Super Admin</option>
            </select>
          </div>

          {/* Deleted Status Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="deleted"
              className="text-sm text-muted-foreground mb-1"
            >
              User Status
            </label>
            <select
              id="deleted"
              value={deletedStatus}
              onChange={(e) => setDeletedStatus(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">All Users</option>
              <option value="true">Deleted Users</option>
              <option value="false">Not Deleted Users</option>
            </select>
          </div>

          {/* Access Scope Filter */}
          <div className="flex flex-col lg:flex-1">
            <AccessScopeFilter
              selectedScopes={accessScopes}
              setSelectedScopes={setAccessScopes}
            />

            {/* <label
              htmlFor="accessScope"
              className="text-sm text-muted-foreground mb-1"
            >
              Access Scope
            </label>
            <select
              id="accessScope"
              value={""}
              onChange={(e) => console.log(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">All Access Scopes</option>
              <option value="canManageUsers">Manage Users</option>
              <option value="canManageClients">Manage Clients</option>
              <option value="canManageProjects">Manage Projects</option>
              <option value="canManageInterviews">Manage Interviews</option>
              <option value="canManageStakeholders">Manage Stakeholders</option>
            </select> */}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={TableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination & Selection Info */}
      <div className="flex flex-col-reverse gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Selected Rows Info */}
        <div className="text-sm text-muted-foreground text-center">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-2 flex-row items-center justify-between sm:gap-4">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          {/* Navigation + Page Size */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={pageIndex + 1 >= totalPages}
            >
              Next
            </Button>

            <select
              className="rounded border px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
