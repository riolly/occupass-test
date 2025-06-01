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
  const {
    skip,
    take,
    freight,
    orderBy,
    orderByDesc,
    id,
    customerId,
    orderDate,
    shipName,
    shipCity,
    shipCountry,
  } = search;

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

  // Debounced search hooks for all fields
  const idSearch = useDebouncedSearch(id?.toString() || "", (value) => {
    const idValue = value ? Number(value) : undefined;
    updateSearch({ id: idValue, skip: 0 });
  });

  const customerIdSearch = useDebouncedSearch(customerId || "", (value) => {
    updateSearch({ customerId: value || undefined, skip: 0 });
  });

  const orderDateSearch = useDebouncedSearch(orderDate || "", (value) => {
    updateSearch({ orderDate: value || undefined, skip: 0 });
  });

  // Debounced search hook for freight
  const freightSearch = useDebouncedSearch(
    freight?.toString() || "",
    (value) => {
      const freightValue = value ? Number(value) : undefined;
      updateSearch({ freight: freightValue, skip: 0 });
    }
  );

  const shipNameSearch = useDebouncedSearch(shipName || "", (value) => {
    updateSearch({ shipName: value || undefined, skip: 0 });
  });

  const shipCitySearch = useDebouncedSearch(shipCity || "", (value) => {
    updateSearch({ shipCity: value || undefined, skip: 0 });
  });

  const shipCountrySearch = useDebouncedSearch(shipCountry || "", (value) => {
    updateSearch({ shipCountry: value || undefined, skip: 0 });
  });

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

      <div className="mb-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order ID
            </label>
            <Input
              type="number"
              value={idSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                idSearch.setValue(e.target.value)
              }
              placeholder="e.g., 10248"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Customer ID
            </label>
            <Input
              type="text"
              value={customerIdSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                customerIdSearch.setValue(e.target.value)
              }
              placeholder="e.g., ALFKI"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order Date
            </label>
            <Input
              type="date"
              value={orderDateSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                orderDateSearch.setValue(e.target.value)
              }
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ship Name
            </label>
            <Input
              type="text"
              value={shipNameSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                shipNameSearch.setValue(e.target.value)
              }
              placeholder="e.g., Vins et alcools"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ship City
            </label>
            <Input
              type="text"
              value={shipCitySearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                shipCitySearch.setValue(e.target.value)
              }
              placeholder="e.g., Reims"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ship Country
            </label>
            <Input
              type="text"
              value={shipCountrySearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                shipCountrySearch.setValue(e.target.value)
              }
              placeholder="e.g., France"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Freight ($)
            </label>
            <div className="space-y-1">
              <Input
                type="number"
                value={freightSearch.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  freightSearch.setValue(e.target.value)
                }
                placeholder="e.g., 32,38"
                className="bg-background"
              />
              <p className="text-xs text-gray-500">
                Note: Use comma (,) as decimal separator
              </p>
            </div>
          </div>

          {/* <div className="mt-6 justify-self-end">
            <button
              onClick={() =>
                updateSearch({
                  id: undefined,
                  customerId: undefined,
                  orderDate: undefined,
                  shipName: undefined,
                  shipCity: undefined,
                  shipCountry: undefined,
                  freight: undefined,
                  skip: 0,
                })
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear All Filters
            </button>
          </div> */}
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
        onRowClick={(row) => {
          navigate({
            to: "/orders/$id",
            params: { id: row.customerId },
          });
        }}
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
