import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersApi, customersApi, formatDate } from "../services/api";
import { Button } from "../components/ui/Button";

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getOrder(Number(orderId)),
  });

  const { data: customer } = useQuery({
    queryKey: ["customer", order?.customerId],
    queryFn: () => (order ? customersApi.getCustomer(order.customerId) : null),
    enabled: !!order,
  });

  if (orderLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading order: {orderError.message}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="outline" size="sm">
            ← Back to Orders
          </Button>
        </Link>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Order #{order.id}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Order Information
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Customer ID:</strong>
                {customer ? (
                  <Link
                    to="/customers/$customerId"
                    params={{ customerId: order.customerId }}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    {order.customerId}
                  </Link>
                ) : (
                  <span className="ml-1">{order.customerId}</span>
                )}
              </p>
              <p>
                <strong>Employee ID:</strong> {order.employeeId}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.orderDate)}
              </p>
              {order.requiredDate && (
                <p>
                  <strong>Required Date:</strong>{" "}
                  {formatDate(order.requiredDate)}
                </p>
              )}
              {order.shippedDate && (
                <p>
                  <strong>Shipped Date:</strong> {formatDate(order.shippedDate)}
                </p>
              )}
              {order.shipVia && (
                <p>
                  <strong>Ship Via:</strong> {order.shipVia}
                </p>
              )}
              <p>
                <strong>Freight:</strong> ${Number(order.freight).toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Shipping Information
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Ship Name:</strong> {order.shipName}
              </p>
              <p>
                <strong>Ship Address:</strong> {order.shipAddress}
              </p>
              <p>
                <strong>Ship City:</strong> {order.shipCity}
              </p>
              {order.shipRegion && (
                <p>
                  <strong>Ship Region:</strong> {order.shipRegion}
                </p>
              )}
              <p>
                <strong>Ship Postal Code:</strong> {order.shipPostalCode}
              </p>
              <p>
                <strong>Ship Country:</strong> {order.shipCountry}
              </p>
            </div>
          </div>

          {customer && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Company:</strong> {customer.companyName}
                </p>
                <p>
                  <strong>Contact:</strong> {customer.contactName}
                </p>
                <p>
                  <strong>Title:</strong> {customer.contactTitle}
                </p>
                <p>
                  <strong>Phone:</strong> {customer.phone}
                </p>
                <p>
                  <strong>City:</strong> {customer.city}
                </p>
                <p>
                  <strong>Country:</strong> {customer.country}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
