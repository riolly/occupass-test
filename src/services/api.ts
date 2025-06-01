import type {
  Customer,
  Order,
  QueryCustomersRequest,
  QueryOrdersRequest,
  QueryResponse,
  CustomerDetailsResponse,
} from "../types/api";

const API_BASE_URL = "https://uitestapi.occupass.com";

export async function queryCustomers(
  params: QueryCustomersRequest
): Promise<QueryResponse<Customer>> {
  const response = await fetch(
    `${API_BASE_URL}/query/customers?${stringifyParams(params)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }

  return response.json();
}

export async function queryOrders(
  params: QueryOrdersRequest
): Promise<QueryResponse<Order>> {
  const response = await fetch(
    `${API_BASE_URL}/query/orders?${stringifyParams(params)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }

  return response.json();
}

export async function getCustomerDetails(
  customerId: string
): Promise<CustomerDetailsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/GetCustomerDetails?id=${customerId}&jsconfig=eccn%2Cedv`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customer details: ${response.statusText}`);
  }

  return response.json();
}

const stringifyParams = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(","));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  return queryParams.toString();
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  // Handle .NET date format: /Date(1234567890000-0000)/
  const match = dateString.match(/\/Date\((\d+)[-+]\d+\)\//);
  if (match) {
    const timestamp = parseInt(match[1]);
    return new Date(timestamp).toLocaleDateString();
  }

  return new Date(dateString).toLocaleDateString();
};
