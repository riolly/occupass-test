import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  error?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  onRowClick?: (row: TData) => void;
  // Custom row rendering
  rowRender?: (
    rowData: TData,
    defaultRowProps: {
      key: string;
      "data-state"?: string | false;
      className?: string;
      onClick?: () => void;
    },
    cells: React.ReactNode[]
  ) => React.ReactNode;
  // Server-side pagination props
  pageCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalResults?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Pagination URL generation for Link-based navigation
  generatePageUrl?: (page: number) => { to: string; search?: any };
  // Server-side sorting props
  onSort?: (key: string) => void;
  orderBy: string[];
  orderByDesc: string[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  error,
  enablePagination = true,
  enableSorting = true,
  onRowClick,
  // Custom row rendering
  rowRender,
  // Server-side props
  pageCount = 0,
  currentPage = 1,
  pageSize = 25,
  totalResults = 0,
  onPageChange,
  onPageSizeChange,
  generatePageUrl,
  onSort,
  orderBy,
  orderByDesc,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable built-in features for server-side operations
    manualSorting: enableSorting,
    manualFiltering: false,
    manualPagination: enablePagination,
    pageCount: pageCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: (currentPage || 1) - 1,
        pageSize: pageSize || 25,
      },
    },
  });

  const handleSort = (key: string) => {
    onSort?.(key);
  };

  const getSortIcon = (key: string) => {
    if (!enableSorting) return null;

    if (orderBy.includes(key)) {
      return <ChevronDownIcon className={"h-4 w-4 text-gray-900"} />;
    }

    if (orderByDesc.includes(key)) {
      return <ChevronUpIcon className={"h-4 w-4 text-gray-900"} />;
    }

    return (
      <div className="flex flex-col -space-y-1">
        <ChevronUpIcon className={"h-3 w-3 text-gray-400 opacity-50"} />
        <ChevronDownIcon className={"h-3 w-3 text-gray-400 opacity-50"} />
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="relative">
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center justify-between font-bold ${
                        enableSorting && onSort
                          ? "cursor-pointer select-none hover:text-gray-900"
                          : ""
                      }`}
                      onClick={() =>
                        enableSorting && handleSort(header.column.id)
                      }
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {enableSorting && onSort && (
                        <div className="ml-2 flex-shrink-0">
                          {getSortIcon(header.column.id)}
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              // Use custom rowRender if provided
              if (rowRender) {
                return (
                  <React.Fragment key={row.id}>
                    {rowRender(
                      row.original,
                      {
                        key: row.id,
                        "data-state": row.getIsSelected() && "selected",
                        className: onRowClick ? "cursor-pointer" : "",
                        onClick: () => onRowClick?.(row.original),
                      },
                      row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))
                    )}
                  </React.Fragment>
                );
              }

              // Default row rendering
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
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
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Server-side Pagination */}
      {enablePagination && onPageChange && onPageSizeChange && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {totalResults > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
              to {Math.min(currentPage * pageSize, totalResults)} of{" "}
              {totalResults} results
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Rows per page:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value: string) => {
                  onPageSizeChange(Number(value));
                }}
              >
                <SelectTrigger className="w-[70px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {generatePageUrl && currentPage > 1 ? (
                    <Link
                      {...generatePageUrl(currentPage - 1)}
                      resetScroll={false}
                      className={cn(
                        "gap-1 px-2.5 sm:pl-2.5",
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      )}
                      aria-label="Go to previous page"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span className="hidden sm:block">Previous</span>
                    </Link>
                  ) : (
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          onPageChange?.(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  )}
                </PaginationItem>

                {/* Page numbers with ellipsis */}
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter((page) => {
                    const distance = Math.abs(page - currentPage);
                    return distance <= 2 || page === 1 || page === pageCount;
                  })
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && array[index - 1] !== page - 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          {generatePageUrl ? (
                            <Link
                              {...generatePageUrl(page)}
                              resetScroll={false}
                              aria-current={
                                page === currentPage ? "page" : undefined
                              }
                              className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                page === currentPage
                                  ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                  : "hover:bg-accent hover:text-accent-foreground",
                                "h-10 w-10"
                              )}
                            >
                              {page}
                            </Link>
                          ) : (
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                onPageChange?.(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}

                <PaginationItem>
                  {generatePageUrl && currentPage < pageCount ? (
                    <Link
                      {...generatePageUrl(currentPage + 1)}
                      resetScroll={false}
                      className={cn(
                        "gap-1 px-2.5 sm:pr-2.5",
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                        currentPage >= pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      )}
                      aria-label="Go to next page"
                    >
                      <span className="hidden sm:block">Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  ) : (
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pageCount) {
                          onPageChange?.(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to create simple columns
export function createColumn<TData, TValue = unknown>(
  accessorKey: keyof TData,
  header: string,
  options?: {
    sortable?: boolean;
    cell?: (value: TValue) => React.ReactNode;
  }
): ColumnDef<TData, TValue> {
  return {
    accessorKey: accessorKey as string,
    header,
    enableSorting: options?.sortable ?? true,
    cell: options?.cell
      ? ({ getValue }) => options.cell!(getValue() as TValue)
      : ({ getValue }) => String(getValue() ?? ""),
  };
}
