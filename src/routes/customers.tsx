import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../services/api";
import DataTable, { createColumn } from "../components/DataTable";
import type { Customer } from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "../components/ui/Input";
import { useCallback } from "react";
import { useDebouncedSearch } from "../hooks/useDebounce";

interface CustomerSearchParams {
  page?: number;
  pageSize?: number;
  country?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const Route = createFileRoute("/customers")({
  component: CustomersPage,
  validateSearch: (search: Record<string, unknown>): CustomerSearchParams => ({
    page: Number(search?.page) || 1,
    pageSize: Number(search?.pageSize) || 25,
    country: (search?.country as string) || "",
    customerId: (search?.customerId as string) || "",
    sortBy: (search?.sortBy as string) || "",
    sortOrder: (search?.sortOrder as "asc" | "desc") || "asc",
  }),
});

function CustomersPage() {
  const navigate = useNavigate({ from: "/customers" });
  const {
    page = 1,
    pageSize = 25,
    country = "",
    customerId = "",
    sortBy = "",
    sortOrder = "asc",
  } = Route.useSearch();

  const updateSearch = useCallback(
    (updates: Partial<CustomerSearchParams>) => {
      navigate({
        search: (prev) => ({ ...prev, ...updates, page: updates.page || 1 }),
      });
    },
    [navigate]
  );

  // Debounced search hooks
  const countrySearch = useDebouncedSearch(country, (value) =>
    updateSearch({ country: value, page: 1 })
  );

  const customerIdSearch = useDebouncedSearch(customerId, (value) =>
    updateSearch({ customerId: value, page: 1 })
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "customers",
      { page, pageSize, country, customerId, sortBy, sortOrder },
    ],
    queryFn: async () => {
      const params: any = {
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: "total", // Include total count for pagination
      };

      // Server-side sorting
      if (sortBy) {
        if (sortOrder === "desc") {
          params.orderByDesc = sortBy;
        } else {
          params.orderBy = sortBy;
        }
      }

      // Server-side filtering
      if (country) {
        params.countryStartsWith = country;
      }

      if (customerId) {
        params.ids = [customerId]; // API accepts array of IDs
      }

      const response = await customersApi.queryCustomers(params);

      return {
        results: response.results,
        total: response.total,
        offset: response.offset,
      };
    },
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

  const handleRowClick = (customer: Customer) => {
    navigate({ to: `/customers/${customer.id}` });
  };

  const pageCount = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          Manage and view customer information
        </p>
      </div>

      {/* Search Filters */}
      <div className="mb-4 flex gap-4">
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
            Search by Customer ID
          </label>
          <Input
            value={customerIdSearch.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              customerIdSearch.setValue(e.target.value)
            }
            placeholder="e.g., ALFKI, BERGS..."
            className="max-w-sm bg-background"
          />
        </div>
      </div>

      <DataTable
        data={data?.results || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        onRowClick={handleRowClick}
        // Server-side pagination
        enablePagination={true}
        pageCount={pageCount}
        currentPage={page}
        pageSize={pageSize}
        totalResults={data?.total || 0}
        onPageChange={(newPage) => updateSearch({ page: newPage })}
        onPageSizeChange={(newPageSize) =>
          updateSearch({ pageSize: newPageSize, page: 1 })
        }
        // Server-side sorting
        enableSorting={true}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key, order) =>
          updateSearch({ sortBy: key, sortOrder: order, page: 1 })
        }
      />
    </div>
  );
}
