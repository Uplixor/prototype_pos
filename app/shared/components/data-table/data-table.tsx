import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Rows3,
} from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import { SearchInput } from "~/shared/components/search-input";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "~/shared/components/page-primitives";
import type { Density } from "~/theme/tokens";
import { cn } from "~/shared/utils/cn";

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  searchPlaceholder?: string;
  searchKey?: keyof TData & string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  bulkActions?: React.ReactNode | ((selectedRows: TData[]) => React.ReactNode);
  onExportCsv?: (rows: TData[]) => void;
  density?: Density;
  onDensityChange?: (density: Density) => void;
  className?: string;
  getRowId?: (row: TData) => string;
};

const densityRowClass: Record<Density, string> = {
  compact: "h-9",
  comfortable: "h-10",
  spacious: "h-12",
};

function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search…",
  searchKey,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting filters or create a new record.",
  bulkActions,
  onExportCsv,
  density: densityProp,
  onDensityChange,
  className,
  getRowId,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [densityInternal, setDensityInternal] = useState<Density>("compact");

  const density = densityProp ?? densityInternal;
  const setDensity = onDensityChange ?? setDensityInternal;

  const selectionColumn = useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }),
    [],
  );

  const tableColumns = useMemo(
    () => [selectionColumn, ...columns],
    [selectionColumn, columns],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    globalFilterFn: searchKey
      ? (row, _columnId, filterValue) => {
          const value = row.original[searchKey];
          return String(value ?? "")
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        }
      : "includesString",
    initialState: {
      pagination: { pageSize: 25 },
    },
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  if (isLoading) {
    return <LoadingState label="Loading records…" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load table"
        description="Check your connection and try again."
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-page py-2">
        <SearchInput
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          containerClassName="w-full max-w-xs"
          aria-label="Search table"
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {selectedRows.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedRows.length} selected
              </span>
              {typeof bulkActions === "function"
                ? bulkActions(selectedRows)
                : bulkActions}
            </div>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Columns3 className="size-3.5" />
                Columns
                <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Rows3 className="size-3.5" />
                Density
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["compact", "comfortable", "spacious"] as const).map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={density === value}
                  onCheckedChange={() => setDensity(value)}
                  className="capitalize"
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onExportCsv ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onExportCsv(
                  table.getFilteredRowModel().rows.map((row) => row.original),
                )
              }
            >
              <Download className="size-3.5" />
              Export CSV
            </Button>
          ) : null}
        </div>
      </div>

      <div className="relative overflow-x-auto overscroll-x-contain border-b border-border [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[40rem] caption-bottom text-[13px]">
          <thead className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-9 px-3 text-left align-middle text-[12px] font-medium text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none hover:text-foreground",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-primary-muted/40",
                    densityRowClass[density],
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 align-middle whitespace-nowrap"
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableColumns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-card px-page py-2">
        <p className="text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
          {selectedRows.length > 0
            ? ` · ${selectedRows.length} selected`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable };
