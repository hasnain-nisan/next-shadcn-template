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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ClientManagementTable({
  clients,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  setSortField,
  setSortOrder,
  name,
  setName,
  clientCode,
  setClientCode,
  deletedStatus,
  setDeletedStatus,
  setSelectedClient,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: Readonly<{
  clients: Client[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: "asc" | "desc" | null) => void;
  name: string;
  setName: (email: string) => void;
  clientCode: string;
  setClientCode: (clientCode: string) => void;
  deletedStatus: string;
  setDeletedStatus: (deletedStatus: string) => void;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = GetTableColumns({setSelectedClient, setOpenUpdateModal, setOpenDeleteModal});

  const table = useReactTable({
    data: clients,
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

          {/* Client code Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="clientCode"
              className="text-sm text-muted-foreground mb-1"
            >
              Client Code
            </label>
            <Input
              id="clientCode"
              placeholder="Filter by client code..."
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          {/* Deleted Status Filter */}
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="deleted"
              className="text-sm text-muted-foreground mb-1"
            >
              Client Status
            </label>
            <Select
              value={deletedStatus === "" ? "all" : deletedStatus}
              onValueChange={(value) => setDeletedStatus(value)}
            >
              <SelectTrigger id="deleted" className="w-full h-[36px] text-sm">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="true">Deleted Clients</SelectItem>
                <SelectItem value="false">Not Deleted Clients</SelectItem>
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
