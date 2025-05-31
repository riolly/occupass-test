import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customersApi, ordersApi, formatDate } from "../services/api";
import DataTable, { type Column } from "../components/DataTable";
import type { Order } from "../types/api";
import Button from "../components/ui/Button";

export const Route = createFileRoute("/customers/$customerId")({
  component: CustomerDetailPage,
});

function CustomerDetailPage() {
  const { customerId } = Route.useParams();

  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customersApi.getCustomer(customerId),
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: () => ordersApi.getOrdersForCustomer(customerId),
  });

  const orderColumns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (value, order) => (
        <Link
          to="/orders/$orderId"
          params={{ orderId: order.id.toString() }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (value) => formatDate(value),
    },
    {
      key: "requiredDate",
      label: "Required Date",
      render: (value) => formatDate(value),
    },
    {
      key: "shippedDate",
      label: "Shipped Date",
      render: (value) => formatDate(value),
    },
    {
      key: "freight",
      label: "Freight",
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: "shipName",
      label: "Ship Name",
    },
    {
      key: "shipCity",
      label: "Ship City",
    },
    {
      key: "shipCountry",
      label: "Ship Country",
    },
  ];

  if (customerLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading customer details...</div>
      </div>
    );
  }

  if (customerError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading customer: {customerError.message}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/customers">
          <Button variant="outline" size="sm">
            ← Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {customer.companyName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Contact Name:</strong> {customer.contactName}
              </p>
              <p>
                <strong>Contact Title:</strong> {customer.contactTitle}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              {customer.fax && (
                <p>
                  <strong>Fax:</strong> {customer.fax}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Address
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
              <p>
                <strong>City:</strong> {customer.city}
              </p>
              {customer.region && (
                <p>
                  <strong>Region:</strong> {customer.region}
                </p>
              )}
              <p>
                <strong>Postal Code:</strong> {customer.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {customer.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Orders ({orders?.length || 0})
        </h2>

        <DataTable
          data={orders || []}
          columns={orderColumns}
          loading={ordersLoading}
          error={ordersError?.message}
        />
      </div>
    </div>
  );
}
