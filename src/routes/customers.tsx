import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../services/api";
import DataTable, { createColumn } from "../components/DataTable";
import type { Customer } from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";

interface CustomerSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const Route = createFileRoute("/customers")({
  component: CustomersPage,
  validateSearch: (search: Record<string, unknown>): CustomerSearchParams => ({
    page: Number(search?.page) || 1,
    pageSize: Number(search?.pageSize) || 25,
    search: (search?.search as string) || "",
    country: (search?.country as string) || "",
    sortBy: (search?.sortBy as string) || "",
    sortOrder: (search?.sortOrder as "asc" | "desc") || "asc",
  }),
});

function CustomersPage() {
  const navigate = useNavigate({ from: "/customers" });
  const {
    page = 1,
    pageSize = 25,
    search = "",
    country = "",
    sortBy = "",
    sortOrder = "asc",
  } = Route.useSearch();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "customers",
      { page, pageSize, search, country, sortBy, sortOrder },
    ],
    queryFn: async () => {
      const params: any = {
        skip: (page - 1) * pageSize,
        take: pageSize,
      };

      if (sortBy) {
        if (sortOrder === "desc") {
          params.orderByDesc = sortBy;
        } else {
          params.orderBy = sortBy;
        }
      }

      if (country) {
        params.countryStartsWith = country;
      }

      const response = await customersApi.queryCustomers(params);

      // Filter by search locally since the API doesn't support general search
      let filteredResults = response.results;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredResults = response.results.filter(
          (customer) =>
            customer.companyName.toLowerCase().includes(searchLower) ||
            customer.contactName.toLowerCase().includes(searchLower) ||
            customer.city.toLowerCase().includes(searchLower) ||
            customer.country.toLowerCase().includes(searchLower)
        );
      }

      return {
        ...response,
        results: filteredResults,
        total: filteredResults.length, // Note: This won't be accurate for server-side pagination with filtering
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          Manage and view customer information
        </p>
      </div>

      <DataTable
        data={data?.results || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        onRowClick={handleRowClick}
        initialPageSize={pageSize}
        enablePagination={true}
        enableSorting={true}
        enableFiltering={true}
      />
    </div>
  );
}
