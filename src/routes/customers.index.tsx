import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { data, isLoading, error } = useSuspenseQuery(queryKeyOptions(search));

  const {
    skip,
    take,
    orderBy,
    orderByDesc,
    id,
    companyName,
    contactName,
    contactTitle,
    city,
    country,
    phone,
  } = search;

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

  // Debounced search hooks for all CustomerSchema fields
  const idSearch = useDebouncedSearch(id || "", (value) => {
    updateSearch({ id: value || undefined, skip: 0 });
  });

  const companyNameSearch = useDebouncedSearch(companyName || "", (value) => {
    updateSearch({ companyName: value || undefined, skip: 0 });
  });

  const contactNameSearch = useDebouncedSearch(contactName || "", (value) => {
    updateSearch({ contactName: value || undefined, skip: 0 });
  });

  const contactTitleSearch = useDebouncedSearch(contactTitle || "", (value) => {
    updateSearch({ contactTitle: value || undefined, skip: 0 });
  });

  const citySearch = useDebouncedSearch(city || "", (value) => {
    updateSearch({ city: value || undefined, skip: 0 });
  });

  const countrySearch = useDebouncedSearch(country || "", (value) => {
    updateSearch({ country: value || undefined, skip: 0 });
  });

  const phoneSearch = useDebouncedSearch(phone || "", (value) => {
    updateSearch({ phone: value || undefined, skip: 0 });
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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600 mt-2">
          Manage and view customer information
        </p>
      </div>

      {/* Search Filters */}
      <div className="mb-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Customer ID
            </label>
            <Input
              value={idSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                idSearch.setValue(e.target.value)
              }
              placeholder="e.g., ALFKI"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <Input
              value={companyNameSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                companyNameSearch.setValue(e.target.value)
              }
              placeholder="e.g., Alfreds Futterkiste"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <Input
              value={contactNameSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                contactNameSearch.setValue(e.target.value)
              }
              placeholder="e.g., Maria Anders"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Contact Title
            </label>
            <Input
              value={contactTitleSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                contactTitleSearch.setValue(e.target.value)
              }
              placeholder="e.g., Sales Representative"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input
              value={citySearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                citySearch.setValue(e.target.value)
              }
              placeholder="e.g., Berlin"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <Input
              value={countrySearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                countrySearch.setValue(e.target.value)
              }
              placeholder="e.g., Germany"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              value={phoneSearch.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                phoneSearch.setValue(e.target.value)
              }
              placeholder="e.g., 030-0074321"
              className="bg-background"
            />
          </div>
        </div>
      </div>

      <DataTable
        data={data?.results || []}
        columns={columns}
        loading={isLoading}
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
        // Link-based pagination for prefetching
        generatePageUrl={(page) => ({
          to: "/customers",
          search: (prev: QueryCustomersRequest) => ({
            ...prev,
            skip: (page - 1) * take,
          }),
        })}
        rowRender={(rowData, defaultRowProps, cells) => (
          <Link
            to="/customer/$id"
            params={{ id: rowData.id }}
            className={cn(
              "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors table-row",
              defaultRowProps.className
            )}
            data-state={defaultRowProps["data-state"]}
          >
            {cells}
          </Link>
        )}
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
