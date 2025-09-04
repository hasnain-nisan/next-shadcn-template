/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTableColumns } from "./TableColumns";
import type { User } from "@/types/user.types";
import { AccessScopeFilter } from "./AccessScopeFilter";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconListNumbers,
} from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  setOpenDetailsModal,
  setSelectedUser,
  setOpenUpdateModal,
  setOpenDeleteModal,
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
  setAccessScopes: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = getTableColumns({
    setOpenDetailsModal,
    setSelectedUser,
    setOpenUpdateModal,
    setOpenDeleteModal,
  });

  const table = useReactTable({
    data: users,
    columns: columns,
    // onSortingChange: (updater) => {
    //   const newSorting =
    //     typeof updater === "function" ? updater(sorting) : updater;
    //   setSorting(newSorting);

    //   if (newSorting.length > 0) {
    //     setSortField(newSorting[0].id);
    //     setSortOrder(newSorting[0].desc ? "desc" : "asc");
    //   } else {
    //     setSortField(null);
    //     setSortOrder(null);
    //   }
    // },
    // onColumnFiltersChange: setColumnFilters,
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
      <div className="w-full mb-5">
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
            <Select value={role === "" ? undefined : role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger id="role" className="w-full h-[36px] text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="SuperAdmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deleted Status Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="deleted"
              className="text-sm text-muted-foreground mb-1"
            >
              User Status
            </label>
            <Select
              value={deletedStatus === "" ? "all" : deletedStatus}
              onValueChange={(value) => setDeletedStatus(value)}
            >
              <SelectTrigger id="deleted" className="w-full h-[36px] text-sm">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="true">Deleted Users</SelectItem>
                <SelectItem value="false">Not Deleted Users</SelectItem>
              </SelectContent>
            </Select>
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
                  className={
                    row.original.isDeleted ? "text-muted-foreground" : ""
                  }
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
                  colSpan={columns.length}
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
        {/* <div className="text-sm text-muted-foreground text-center">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}

        {/* Pagination Controls */}
        <div className="flex flex-row items-center justify-between gap-4 py-2 w-full">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Start Button - hidden on small screens */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={pageIndex === 0}
              className="hidden sm:flex items-center gap-1"
            >
              <IconChevronsLeft size={16} />
              Start
            </Button>

            {/* Prev Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
              className="flex items-center gap-1"
            >
              <IconChevronLeft size={16} />
              Prev
            </Button>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={pageIndex + 1 >= totalPages}
              className="flex items-center gap-1"
            >
              Next
              <IconChevronRight size={16} />
            </Button>

            {/* End Button - hidden on small screens */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages - 1)}
              disabled={pageIndex + 1 >= totalPages}
              className="hidden sm:flex items-center gap-1"
            >
              End
              <IconChevronsRight size={16} />
            </Button>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <IconListNumbers size={16} className="text-muted-foreground" />
            <select
              className="rounded border px-2 py-1 text-sm bg-background text-foreground"
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
