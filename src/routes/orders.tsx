import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersApi, formatDate } from "../services/api";
import DataTable, { createColumn } from "../components/DataTable";
import type { Order } from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";

interface OrderSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  validateSearch: (search: Record<string, unknown>): OrderSearchParams => ({
    page: Number(search?.page) || 1,
    pageSize: Number(search?.pageSize) || 25,
    search: (search?.search as string) || "",
    sortBy: (search?.sortBy as string) || "",
    sortOrder: (search?.sortOrder as "asc" | "desc") || "asc",
  }),
});

function OrdersPage() {
  const navigate = useNavigate({ from: "/orders" });
  const {
    page = 1,
    pageSize = 25,
    search = "",
    sortBy = "",
    sortOrder = "asc",
  } = Route.useSearch();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page, pageSize, search, sortBy, sortOrder }],
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

      const response = await ordersApi.queryOrders(params);

      // Filter by search locally since the API doesn't support general search
      let filteredResults = response.results;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredResults = response.results.filter(
          (order) =>
            order.customerId.toLowerCase().includes(searchLower) ||
            order.shipName.toLowerCase().includes(searchLower) ||
            order.shipCity.toLowerCase().includes(searchLower) ||
            order.shipCountry.toLowerCase().includes(searchLower) ||
            order.id.toString().includes(searchLower)
        );
      }

      return {
        ...response,
        results: filteredResults,
        total: filteredResults.length,
      };
    },
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

  const handleRowClick = (order: Order) => {
    navigate({ to: `/orders/${order.id}` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">Manage and view order information</p>
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
