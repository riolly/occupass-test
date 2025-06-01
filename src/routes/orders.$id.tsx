import { getOrderDetails, formatDate } from "@/services/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Truck,
  Building2,
} from "lucide-react";

const queryKeyOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["order", params.id],
    queryFn: () => getOrderDetails(params.id),
  });

export const Route = createFileRoute("/orders/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return await context.queryClient.ensureQueryData(queryKeyOptions(params));
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isRefetching, error } = useSuspenseQuery(
    queryKeyOptions({ id })
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  const orders = data.results;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            No Orders Found
          </h2>
          <p className="text-yellow-700">No orders found for customer {id}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        {isRefetching && (
          <div className="text-sm text-gray-500">Refreshing...</div>
        )}
      </div>

      {/*  Info Card */}
      {orders.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Order Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Customer ID
              </label>
              <p className="text-lg font-mono text-gray-900">
                {orders[0].order.customerId}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Company Name
              </label>
              <p className="text-lg text-gray-900">
                {orders[0].order.shipName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <div className="text-gray-900">
                <p>{orders[0].order.shipAddress}</p>
                <p>
                  {orders[0].order.shipCity}
                  {orders[0].order.shipRegion &&
                    `, ${orders[0].order.shipRegion}`}{" "}
                  {orders[0].order.shipPostalCode}
                </p>
                <p>{orders[0].order.shipCountry}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map((orderData, index) => {
          const { order, orderDetails } = orderData;
          const totalAmount = orderDetails.reduce(
            (sum, detail) =>
              sum +
              (detail.unitPrice || 0) *
                (detail.quantity || 0) *
                (1 - (detail.discount || 0)),
            0
          );

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Order {index + 1} of {orders.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.orderDate)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Information */}
                <div className="lg:col-span-1">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Employee ID
                      </label>
                      <p className="text-gray-900">{order.employeeId}</p>
                    </div>

                    {order.requiredDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Required Date
                        </label>
                        <p className="text-gray-900">
                          {formatDate(order.requiredDate)}
                        </p>
                      </div>
                    )}

                    {order.shippedDate && (
                      <div className="flex items-center gap-2">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            Shipped Date
                            <Truck className="w-4 h-4 text-green-500" />
                          </label>
                          <p className="text-gray-900">
                            {formatDate(order.shippedDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.shipVia && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Ship Via
                        </label>
                        <p className="text-gray-900">{order.shipVia}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="lg:col-span-2">
                  <div>
                    <div className="flex items-center gap-3 relative">
                      <Package className="w-5 h-5 text-orange-600 absolute -left-8" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        Items ({orderDetails.length})
                      </h4>
                    </div>

                    {orderDetails.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No items found for this order</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 font-medium text-gray-700">
                                  Product ID
                                </th>
                                <th className="text-right py-2 font-medium text-gray-700">
                                  Unit Price
                                </th>
                                <th className="text-right py-2 font-medium text-gray-700">
                                  Quantity
                                </th>
                                <th className="text-right py-2 font-medium text-gray-700">
                                  Discount
                                </th>
                                <th className="text-right py-2 font-medium text-gray-700">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.map((detail, detailIndex) => {
                                const itemTotal =
                                  (detail.unitPrice || 0) *
                                  (detail.quantity || 0) *
                                  (1 - (detail.discount || 0));
                                return (
                                  <tr
                                    key={detailIndex}
                                    className="border-b border-gray-100"
                                  >
                                    <td className="py-2 text-gray-900 font-medium">
                                      {detail.productId}
                                    </td>
                                    <td className="py-2 text-right text-gray-900">
                                      ${(detail.unitPrice || 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 text-right text-gray-900">
                                      {detail.quantity}
                                    </td>
                                    <td className="py-2 text-right text-gray-900">
                                      {((detail.discount || 0) * 100).toFixed(
                                        0
                                      )}
                                      %
                                    </td>
                                    <td className="py-2 text-right font-medium text-gray-900">
                                      ${itemTotal.toFixed(2)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Order Total */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                          <div className="text-right space-y-1">
                            <div className="flex justify-between items-center gap-8 text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">
                                ${totalAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-8 text-sm">
                              <span className="text-gray-600">Freight:</span>
                              <span className="font-medium">
                                ${order.freight.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-8 text-lg font-semibold border-t pt-2">
                              <span className="text-gray-900">Total:</span>
                              <div className="flex items-center gap-2 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span>
                                  {(totalAmount + order.freight).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
