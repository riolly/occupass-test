import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { queryOrders, formatDate } from "../services/api";
import DataTable, { createColumn } from "../components/DataTable";
import {
  QueryOrdersRequestSchema,
  type Order,
  type OrderSchemaField,
  type QueryOrdersRequest,
} from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "../components/ui/Input";
import { useCallback } from "react";
import { useDebouncedSearch } from "../hooks/useDebounce";
import { zodValidator } from "@tanstack/zod-adapter";

const queryKeyOptions = (search: QueryOrdersRequest) =>
  queryOptions({
    queryKey: ["orders", search],
    queryFn: () => queryOrders(search),
  });

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
  validateSearch: zodValidator(QueryOrdersRequestSchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    return await context.queryClient.ensureQueryData(
      queryKeyOptions(deps.search)
    );
  },
});

function OrdersPage() {
  const navigate = useNavigate({ from: "/orders" });
  const search = Route.useSearch();
  const { data, isRefetching, error } = useSuspenseQuery(
    queryKeyOptions(search)
  );
  const { skip, take, freight, orderBy, orderByDesc } = search;

  const updateSearch = useCallback(
    (updates: Partial<QueryOrdersRequest>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
          page: (updates.skip || 0) / 25 + 1,
        }),
      });
    },
    [navigate]
  );

  // Debounced search hook for freight
  const freightSearch = useDebouncedSearch(
    freight?.toString() || "",
    (value) => {
      const freightValue = value ? Number(value) : undefined;
      updateSearch({ freight: freightValue, skip: 0 });
    }
  );

  const columns: ColumnDef<Order>[] = [
    createColumn("id", "Order ID"),
    createColumn("customerId", "Customer ID"),
    createColumn("orderDate", "Order Date", {
      cell: (value) => formatDate(value as string),
    }),
    createColumn("shipName", "Ship Name"),
    createColumn("shipCity", "Ship City"),
    createColumn("shipCountry", "Ship Country"),
    createColumn("freight", "Freight", {
      cell: (value) => `$${Number(value).toFixed(2)}`,
    }),
  ];

  const pageCount = data ? Math.ceil(data.total / take) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">Manage and view order information</p>
      </div>

      {/* Freight Search Filter */}
      <div className="mb-4 flex gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Filter by Freight ($)
          </label>
          <div className="space-y-1">
            <Input
              type="number"
              value={freightSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                freightSearch.setValue(e.target.value)
              }
              placeholder="e.g., 32,38"
              className="max-w-sm bg-background"
            />
            <p className="text-xs text-gray-500">
              Note: Use comma (,) as decimal separator
            </p>
          </div>
        </div>
      </div>

      <DataTable
        data={data?.results || []}
        columns={columns}
        loading={isRefetching}
        error={error?.message}
        // Server-side pagination
        enablePagination={true}
        pageCount={pageCount}
        currentPage={skip / take + 1}
        pageSize={take}
        totalResults={data?.total || 0}
        onPageChange={(newPage) => updateSearch({ skip: (newPage - 1) * take })}
        onPageSizeChange={(newPageSize) =>
          updateSearch({ take: newPageSize, skip: 0 })
        }
        // Server-side sorting
        enableSorting={true}
        orderBy={orderBy}
        orderByDesc={orderByDesc}
        onSort={(key) => {
          navigate({
            search: (prev) => {
              const keyAsField = key as OrderSchemaField;
              const inOrderBy = prev.orderBy?.includes(keyAsField);
              const inOrderByDesc = prev.orderByDesc?.includes(keyAsField);

              let orderBy = [...(prev.orderBy || [])];
              let orderByDesc = [...(prev.orderByDesc || [])];

              if (inOrderByDesc) {
                orderByDesc = orderByDesc.filter((k) => k !== keyAsField);
              } else if (inOrderBy) {
                orderBy = orderBy.filter((k) => k !== keyAsField);
                orderByDesc = [...orderByDesc, keyAsField];
              } else {
                orderBy = [...orderBy, keyAsField];
              }

              return {
                ...prev,
                orderBy,
                orderByDesc,
                page: (skip || 0) / 25 + 1,
              };
            },
          });
        }}
      />
    </div>
  );
}
