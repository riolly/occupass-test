import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QueryCustomersRequestSchema } from "../types/api";
import DataTable, { createColumn } from "../components/DataTable";
import type {
  Customer,
  CustomerSchemaField,
  QueryCustomersRequest,
} from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "../components/ui/Input";
import { useCallback } from "react";
import { zodValidator } from "@tanstack/zod-adapter";
import { useDebouncedSearch } from "../hooks/useDebounce";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { queryCustomers } from "@/services/api";

const queryKeyOptions = (search: QueryCustomersRequest) =>
  queryOptions({
    queryKey: ["customers", search],
    queryFn: () => queryCustomers(search),
  });

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
  validateSearch: zodValidator(QueryCustomersRequestSchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    return await context.queryClient.ensureQueryData(
      queryKeyOptions(deps.search)
    );
  },
});

function CustomersPage() {
  const navigate = useNavigate({ from: "/customers" });
  const search = Route.useSearch();
  const { data, isRefetching, error } = useSuspenseQuery(
    queryKeyOptions(search)
  );

  const { skip, take, countryStartsWith, ids, orderBy, orderByDesc } = search;

  const updateSearch = useCallback(
    (updates: Partial<QueryCustomersRequest>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
          ...(updates.skip === undefined && { skip: 0 }),
        }),
      });
    },
    [navigate]
  );

  const countrySearch = useDebouncedSearch(countryStartsWith, (value) => {
    updateSearch({ countryStartsWith: value });
  });

  const idsSearch = useDebouncedSearch(ids.join(", "), (value) => {
    const idsArray = value
      ? value
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];
    updateSearch({ ids: idsArray });
  });

  const columns: ColumnDef<Customer>[] = [
    createColumn("id", "ID"),
    createColumn("companyName", "Company Name"),
    createColumn("contactName", "Contact Name"),
    createColumn("contactTitle", "Contact Title"),
    createColumn("city", "City"),
    createColumn("country", "Country"),
    createColumn("phone", "Phone", { sortable: false }),
  ];

  const pageCount = data ? Math.ceil(data.total / take) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          Manage and view customer information
        </p>
      </div>

      {/* Search Filters */}
      <div className="mb-4 space-y-4">
        {/* First row of filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Country
            </label>
            <Input
              value={countrySearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                countrySearch.setValue(e.target.value)
              }
              placeholder="e.g., Germany, USA..."
              className="max-w-sm bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Search by Customer IDs (comma-separated)
            </label>
            <Input
              value={idsSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                idsSearch.setValue(e.target.value)
              }
              placeholder="e.g., ALFKI, BERGS, ANTON"
              className="max-w-sm bg-background"
            />
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
              const keyAsField = key as CustomerSchemaField;
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
              };
            },
          });
        }}
      />
    </div>
  );
}
