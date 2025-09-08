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
import { GetTableColumns } from "./TableColumns";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconListNumbers,
} from "@tabler/icons-react";
import { Client } from "@/types/client.types";
import { ClientStakeholder } from "@/types/stakeholder.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Project } from "@/types/project.types";
import { ServiceFactory } from "@/services/ServiceFactory";

export function ProjectManagementTable({
  projects,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  setSortField,
  setSortOrder,
  name,
  setName,
  clientTeam,
  setClientTeam,
  clientId,
  setClientId,
  stakeholderId,
  setStakeholderId,
  deletedStatus,
  setDeletedStatus,
  setSelectedProject,
  setOpenUpdateModal,
  setOpenDeleteModal,
  filteredClients,
  searchTermClient,
  setSearchTermClient,
  filteredStakeholders,
  searchTermStakeholder,
  setSearchTermStakeholder,
}: Readonly<{
  projects: Project[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: "asc" | "desc" | null) => void;
  name: string;
  setName: (email: string) => void;
  clientTeam: string;
  setClientTeam: (clientCode: string) => void;
  clientId: string;
  setClientId: (clientId: string) => void;
  stakeholderId: string;
  setStakeholderId: (stakeholderId: string) => void;
  deletedStatus: string;
  setDeletedStatus: (deletedStatus: string) => void;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  filteredClients: Client[];
  searchTermClient: string;
  setSearchTermClient: React.Dispatch<React.SetStateAction<string>>;
  filteredStakeholders: ClientStakeholder[];
  searchTermStakeholder: string;
  setSearchTermStakeholder: React.Dispatch<React.SetStateAction<string>>;
}>) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = GetTableColumns({
    setSelectedProject,
    setOpenUpdateModal,
    setOpenDeleteModal,
  });

  const table = useReactTable({
    data: projects,
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
          {/* Name Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="name"
              className="text-sm text-muted-foreground mb-1"
            >
              Name
            </label>
            <Input
              id="name"
              placeholder="Filter by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          {/* Client team Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="clientTeam"
              className="text-sm text-muted-foreground mb-1"
            >
              Client Team
            </label>
            <Input
              id="clientTeam"
              placeholder="Filter by client team..."
              value={clientTeam}
              onChange={(e) => setClientTeam(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          {/* Client Filter Dropdown */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="clientId"
              className="text-sm text-muted-foreground mb-1"
            >
              Client
            </label>
            <Select
              value={clientId}
              onValueChange={(value) => setClientId(value)}
            >
              <SelectTrigger id="clientId" className="w-full text-sm h-[36px]">
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent
                className="max-h-[300px] overflow-y-auto w-full"
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <div className="px-2 py-2 sticky top-[-5px] bg-background z-10">
                  <Input
                    placeholder="Search clients..."
                    value={searchTermClient}
                    onChange={(e) => setSearchTermClient(e.target.value)}
                    className="text-sm"
                  />
                </div>
                {/* All Clients Option */}
                <SelectItem value="all">All Clients</SelectItem>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No clients found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Stakeholder Filter Dropdown */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="stakeholderId"
              className="text-sm text-muted-foreground mb-1"
            >
              Stakeholders
            </label>
            <Select
              value={stakeholderId}
              onValueChange={(value) => setStakeholderId(value)}
            >
              <SelectTrigger id="stakeholderId" className="w-full text-sm h-[36px]">
                <SelectValue placeholder="Select a stakeholder..." />
              </SelectTrigger>
              <SelectContent
                className="max-h-[300px] overflow-y-auto w-full"
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <div className="px-2 py-2 sticky top-[-5px] bg-background z-10">
                  <Input
                    placeholder="Search stakeholders..."
                    value={searchTermStakeholder}
                    onChange={(e) => setSearchTermStakeholder(e.target.value)}
                    className="text-sm"
                  />
                </div>
                {/* All Stakeholder Option */}
                <SelectItem value="all">All Stakeholders</SelectItem>
                {filteredStakeholders.length > 0 ? (
                  filteredStakeholders.map((stakeholder) => (
                    <SelectItem key={stakeholder.id} value={stakeholder.id}>
                      {stakeholder.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No stakeholder found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Deleted Status Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="deleted"
              className="text-sm text-muted-foreground mb-1"
            >
              Project Status
            </label>
            <Select
              value={deletedStatus === "" ? "all" : deletedStatus}
              onValueChange={(value) => setDeletedStatus(value)}
            >
              <SelectTrigger id="deleted" className="w-full h-[36px] text-sm">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="true">Deleted Projects</SelectItem>
                <SelectItem value="false">Not Deleted Projects</SelectItem>
              </SelectContent>
            </Select>
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
