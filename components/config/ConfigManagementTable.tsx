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
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconListNumbers,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Project } from "@/types/project.types";
import { Config } from "@/types/config.types";
import { GetTableColumns } from "./TableColumns";

export function ConfigManagementTable({
  configs,
  projects,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  setSortField,
  setSortOrder,
  projectId,
  setProjectId,
  version,
  setVersion,
  isLatest,
  setIsLatest,
  deletedStatus,
  setDeletedStatus,
  setSelectedConfig,
  setOpenUpdateModal,
  setOpenDeleteModal,
  filteredProjects,
  searchTermProject,
  setSearchTermProject,
}: Readonly<{
  configs: Config[];
  projects: Project[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: "asc" | "desc" | null) => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
  version: string;
  setVersion: (version: string) => void;
  isLatest: string;
  setIsLatest: (isLatest: string) => void;
  deletedStatus: string;
  setDeletedStatus: (deletedStatus: string) => void;
  setSelectedConfig: React.Dispatch<React.SetStateAction<Config | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  filteredProjects: Project[];
  searchTermProject: string;
  setSearchTermProject: React.Dispatch<React.SetStateAction<string>>;
}>) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = GetTableColumns({
    setSelectedConfig,
    setOpenUpdateModal,
    setOpenDeleteModal,
  });

  const table = useReactTable({
    data: configs,
    columns,
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
      {/* Filters */}
      <div className="w-full mb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-6">
          {/* Project Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="projectId"
              className="text-sm text-muted-foreground mb-1"
            >
              Projects
            </label>
            <Select
              value={projectId}
              onValueChange={(value) => setProjectId(value)}
            >
              <SelectTrigger id="projectId" className="w-full text-sm h-[36px]">
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent
                className="max-h-[300px] overflow-y-auto w-full"
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <div className="px-2 py-2 sticky top-[-5px] bg-background z-10">
                  <Input
                    placeholder="Search projects..."
                    value={searchTermProject}
                    onChange={(e) => setSearchTermProject(e.target.value)}
                    className="text-sm"
                  />
                </div>
                {/* All project Option */}
                <SelectItem value="all">All projects</SelectItem>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No project found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Version Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="version"
              className="text-sm text-muted-foreground mb-1"
            >
              Version
            </label>
            <Input
              id="version"
              placeholder="Filter by version..."
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full text-sm"
              type="number"
            />
          </div>


          {/* Deleted Status Filter */}
          {/* <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="deleted"
              className="text-sm text-muted-foreground mb-1"
            >
              Config Status
            </label>
            <Select
              value={deletedStatus === "" ? "all" : deletedStatus}
              onValueChange={(value) => setDeletedStatus(value)}
            >
              <SelectTrigger id="deleted" className="w-full h-[36px] text-sm">
                <SelectValue placeholder="All Configs" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Configs</SelectItem>
                <SelectItem value="true">Deleted</SelectItem>
                <SelectItem value="false">Active</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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

      {/* Pagination */}
      <div className="flex flex-col-reverse gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
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
