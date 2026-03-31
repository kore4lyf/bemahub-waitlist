"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { 
  ArrowUpDown, 
  Search, 
  RefreshCw, 
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WaitlistUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
  timestamp: string;
}

const columnHelper = createColumnHelper<WaitlistUser>();

const columns = [
  columnHelper.display({
    id: "rowNumber",
    size: 50,
    header: () => <span className="text-[#2d4a44] font-medium">#</span>,
    cell: ({ row }) => <span className="text-[#4b5563]">{row.index + 1}</span>,
  }),
  columnHelper.accessor("firstName", {
    size: 130,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 text-[#2d4a44]"
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("firstName")}</span>,
  }),
  columnHelper.accessor("lastName", {
    size: 130,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 text-[#2d4a44]"
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("lastName")}</span>,
  }),
  columnHelper.accessor("email", {
    size: 200,
    header: () => <span className="text-[#2d4a44] font-medium">Email</span>,
    cell: ({ row }) => (
      <a href={`mailto:${row.getValue("email")}`} className="hover:underline text-sm text-[#d9724d]">
        {row.getValue("email")}
      </a>
    ),
  }),
  columnHelper.accessor("phone", {
    size: 150,
    header: () => <span className="text-[#2d4a44] font-medium">Phone</span>,
    cell: ({ row }) => (
      <a href={`tel:${row.getValue("phone")}`} className="hover:underline text-sm text-[#d9724d]">
        {row.getValue("phone")}
      </a>
    ),
  }),
  columnHelper.accessor("location", {
    size: 180,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 text-[#2d4a44]"
      >
        Location
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm text-[#4b5563]">{row.getValue("location")}</span>,
  }),
  columnHelper.accessor("referrerName", {
    size: 180,
    header: () => <span className="text-[#2d4a44] font-medium">Referrer Name</span>,
    cell: ({ row }) => <span className="text-sm text-[#4b5563]">{row.getValue("referrerName") || <span className="text-[#4b5563]/60">—</span>}</span>,
  }),
  columnHelper.accessor("referrerPhone", {
    size: 160,
    header: () => <span className="text-[#2d4a44] font-medium">Referrer Phone</span>,
    cell: ({ row }) => <span className="text-sm text-[#4b5563]">{row.getValue("referrerPhone") || <span className="text-[#4b5563]/60">—</span>}</span>,
  }),
  columnHelper.accessor("referrerEmail", {
    size: 200,
    header: () => <span className="text-[#2d4a44] font-medium">Referrer Email</span>,
    cell: ({ row }) => <span className="text-sm text-[#4b5563]">{row.getValue("referrerEmail") || <span className="text-[#4b5563]/60">—</span>}</span>,
  }),
  columnHelper.accessor("timestamp", {
    size: 170,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 text-[#2d4a44]"
      >
        Joined On
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-[#4b5563]">{row.getValue("timestamp")}</span>
    ),
  }),
];

export default function WaitlistPage() {
  const [data, setData] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist-data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="navbar"><img src="https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/bemahub-logo.png" alt="Bema Hub Logo" /></nav>

      <div className="bg-[#2d4a44] px-5 py-8 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white">Waitlist</h1>
            <p className="text-[#a8c5bf] text-base mt-2">Manage and view registered users</p>
          </div>
          <Button onClick={fetchData} disabled={loading} className="gap-2 px-6 bg-[#d9724d] hover:bg-[#c2643f] text-white border-none">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        {loading && (
          <div className="max-w-7xl mx-auto mt-4">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-[#d9724d] h-full rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: "40%" }} />
            </div>
          </div>
        )}
      </div>

      <div className="py-10 md:py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          <Card className="bg-[#2d4a44] border-none rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center gap-1 space-y-0 pb-2">
              <Users className="h-5 w-5 text-white" />
              <CardTitle className="text-sm font-medium text-[#a8c5bf]">Total on Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{data.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-none border-none">
            <CardHeader className="px-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                  <Input
                    placeholder="Search all columns..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 py-2.5 text-sm border border-[#d1d5db] hover:border-[#d9724d] focus:border-[#d9724d] focus:ring-2 focus:ring-[#d9724d]/20 focus:outline-none rounded-md placeholder:text-[#4b5563] transition-colors"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-6 px-0">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-[#4b5563]">
                  Showing{" "}
                  <strong className="text-foreground">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-foreground">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </strong>{" "}
                  of <strong className="text-foreground">{table.getFilteredRowModel().rows.length}</strong> users
                </div>
              </div>
              <div className="rounded-lg border border-[#d1d5db]">
                <Table className="table-fixed [&_td]:px-6 [&_td]:py-3 [&_th]:px-6 [&_th]:py-3 [&_th]:border-b [&_td]:border-b [&_*]:border-[#d1d5db]">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent">
                        {headerGroup.headers.map((header) => (
                          <TableHead 
                            key={header.id}
                            style={{ width: header.getSize() }}
                          >
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
                    {!loading && table.getRowModel().rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-[#4b5563]">
                          No users have registered yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-[#2d4a44]/5">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell 
                              key={cell.id}
                              style={{ width: cell.column.getSize() }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-center mt-6 pt-4 border-t border-[#d1d5db]">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {table.getCanPreviousPage() ? (
                        <PaginationPrevious onClick={() => table.previousPage()} className="text-[#2d4a44] hover:text-[#2d4a44]" />
                      ) : (
                        <span className="pointer-events-none opacity-50">
                          <PaginationPrevious className="text-[#2d4a44]" />
                        </span>
                      )}
                    </PaginationItem>
                    {Array.from({ length: table.getPageCount() }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => table.setPageIndex(i)}
                          isActive={table.getState().pagination.pageIndex === i}
                          className={table.getState().pagination.pageIndex === i ? "bg-[#d9724d] text-white border-[#d9724d] hover:bg-[#c2643f] hover:text-white" : ""}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      {table.getCanNextPage() ? (
                        <PaginationNext onClick={() => table.nextPage()} className="text-[#2d4a44] hover:text-[#2d4a44]" />
                      ) : (
                        <span className="pointer-events-none opacity-50">
                          <PaginationNext className="text-[#2d4a44]" />
                        </span>
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
