import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersApi, formatDate } from "../services/api";
import DataTable, { createColumn } from "../components/DataTable";
import type { Order } from "../types/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "../components/ui/Input";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface OrderSearchParams {
  page?: number;
  pageSize?: number;
  freight?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  validateSearch: (search: Record<string, unknown>): OrderSearchParams => ({
    page: Number(search?.page) || 1,
    pageSize: Number(search?.pageSize) || 25,
    freight: search?.freight ? Number(search.freight) : undefined,
    sortBy: (search?.sortBy as string) || "",
    sortOrder: (search?.sortOrder as "asc" | "desc") || "asc",
  }),
});

function OrdersPage() {
  const navigate = useNavigate({ from: "/orders" });
  const {
    page = 1,
    pageSize = 25,
    freight,
    sortBy = "",
    sortOrder = "asc",
  } = Route.useSearch();

  // Local state for immediate UI updates
  const [localFreight, setLocalFreight] = useState(freight?.toString() || "");

  // Debounced value
  const debouncedFreight = useDebounce(localFreight, 500);

  // Sync local state with URL params when they change
  useEffect(() => {
    setLocalFreight(freight?.toString() || "");
  }, [freight]);

  const updateSearch = (updates: Partial<OrderSearchParams>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates, page: updates.page || 1 }),
    });
  };

  // Update search when debounced value changes
  useEffect(() => {
    const freightValue = debouncedFreight
      ? Number(debouncedFreight)
      : undefined;
    if (freightValue !== freight) {
      updateSearch({ freight: freightValue, page: 1 });
    }
  }, [debouncedFreight]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page, pageSize, freight, sortBy, sortOrder }],
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

      // Server-side freight filtering
      if (freight !== undefined) {
        params.freight = freight;
      }
      console.log(params, "<<< params");
      const response = await ordersApi.queryOrders(params);

      return {
        results: response.results,
        total: response.total,
        offset: response.offset,
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

  const pageCount = data ? Math.ceil(data.total / pageSize) : 0;

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
              value={localFreight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalFreight(e.target.value)
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
