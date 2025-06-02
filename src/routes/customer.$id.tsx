import { getCustomerDetails, formatDate } from "@/services/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Calendar,
  Package,
  DollarSign,
} from "lucide-react";

const queryKeyOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["customer", params.id],
    queryFn: () => getCustomerDetails(params.id),
  });

export const Route = createFileRoute("/customer/$id")({
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
            Error Loading Customer
          </h2>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  const { customer, orders } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        {isRefetching && (
          <div className="text-sm text-gray-500">Refreshing...</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Customer ID
                </label>
                <p className="text-lg font-mono text-gray-900">{customer.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company Name
                </label>
                <p className="text-lg text-gray-900">{customer.companyName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Contact Person
                </label>
                <p className="text-gray-900">{customer.contactName}</p>
                <p className="text-sm text-gray-600">{customer.contactTitle}</p>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <div className="text-gray-900">
                    <p>{customer.address}</p>
                    <p>
                      {customer.city}
                      {customer.region && `, ${customer.region}`}{" "}
                      {customer.postalCode}
                    </p>
                    <p>{customer.country}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900">{customer.phone}</p>
                  {customer.fax && (
                    <p className="text-sm text-gray-600">Fax: {customer.fax}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Orders ({orders?.length || 0})
              </h2>
            </div>

            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders found for this customer</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((customerOrder, index) => {
                  const { order, orderDetails } = customerOrder;
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
                      key={order.id || index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.orderDate)}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mb-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Employee ID:
                          </span>{" "}
                          <span className="text-gray-900">
                            {order.employeeId}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Freight:
                          </span>{" "}
                          <span className="text-gray-900">
                            ${order.freight}
                          </span>
                        </div>
                        {order.requiredDate && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Required:
                            </span>{" "}
                            <span className="text-gray-900">
                              {formatDate(order.requiredDate)}
                            </span>
                          </div>
                        )}
                        {order.shippedDate && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Shipped:
                            </span>{" "}
                            <span className="text-gray-900">
                              {formatDate(order.shippedDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-1 text-sm">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-900 space-y-0">
                          <p className="font-medium">{order.shipName}</p>
                          <p>{order.shipAddress}</p>
                          <p>
                            {order.shipCity},{" "}
                            {order.shipRegion && `${order.shipRegion}, `}
                            {order.shipPostalCode}, {order.shipCountry}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
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
                                  <td className="py-2 text-gray-900">
                                    {detail.productId}
                                  </td>
                                  <td className="py-2 text-right text-gray-900">
                                    ${(detail.unitPrice || 0).toFixed(2)}
                                  </td>
                                  <td className="py-2 text-right text-gray-900">
                                    {detail.quantity}
                                  </td>
                                  <td className="py-2 text-right text-gray-900">
                                    {((detail.discount || 0) * 100).toFixed(0)}%
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
                      <div className="flex justify-end pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
