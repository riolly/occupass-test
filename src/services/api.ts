import type {
  Customer,
  Order,
  QueryResponse,
  QueryCustomersRequest,
  QueryOrdersRequest,
} from "../types/api";

const API_BASE_URL = "https://uitestapi.occupass.com";

export const customersApi = {
  async queryCustomers(
    params: QueryCustomersRequest = {}
  ): Promise<QueryResponse<Customer>> {
    const response = await fetch(`${API_BASE_URL}/query/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await customersApi.queryCustomers({ ids: [id], take: 1 });
    const customer = response.results[0];
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    return customer;
  },
};

export const ordersApi = {
  async queryOrders(
    params: QueryOrdersRequest = {}
  ): Promise<QueryResponse<Order>> {
    const response = await fetch(`${API_BASE_URL}/query/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  },

  async getOrder(id: number): Promise<Order> {
    const response = await ordersApi.queryOrders({ take: 1000 }); // We need to filter locally since there's no ID filter in the API
    const order = response.results.find((o) => o.id === id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  },

  async getOrdersForCustomer(customerId: string): Promise<Order[]> {
    const response = await ordersApi.queryOrders({ take: 1000 }); // Get all orders and filter locally
    return response.results.filter((order) => order.customerId === customerId);
  },
};

// Utility function to format dates from the API
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
