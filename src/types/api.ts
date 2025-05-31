export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  phone: string;
  fax?: string;
}

export interface Order {
  id: number;
  customerId: string;
  employeeId: number;
  orderDate: string;
  requiredDate?: string;
  shippedDate?: string;
  shipVia?: number;
  freight: number;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  shipRegion?: string;
  shipPostalCode: string;
  shipCountry: string;
}

export interface QueryResponse<T> {
  offset: number;
  total: number;
  results: T[];
  meta: Record<string, string>;
}

export interface QueryCustomersRequest {
  ids?: string[];
  countryStartsWith?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderByDesc?: string;
  include?: string;
  fields?: string;
}

export interface QueryOrdersRequest {
  freight?: number;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderByDesc?: string;
  include?: string;
  fields?: string;
}
