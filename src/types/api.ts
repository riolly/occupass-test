import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  contactName: z.string(),
  contactTitle: z.string(),
  address: z.string(),
  city: z.string(),
  region: z.string().optional(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  fax: z.string().optional(),
});
export type Customer = z.infer<typeof CustomerSchema>;
export const CustomerSchemaFieldSchema = CustomerSchema.keyof();
export type CustomerSchemaField = z.infer<typeof CustomerSchemaFieldSchema>;

export const OrderSchema = z.object({
  id: z.number(),
  customerId: z.string(),
  employeeId: z.number(),
  orderDate: z.string(),
  requiredDate: z.string().optional(),
  shippedDate: z.string().optional(),
  shipVia: z.number().optional(),
  freight: z.number(),
  shipName: z.string(),
  shipAddress: z.string(),
  shipCity: z.string(),
  shipRegion: z.string().optional(),
  shipPostalCode: z.string(),
  shipCountry: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;
export const OrderSchemaFieldSchema = OrderSchema.keyof();
export type OrderSchemaField = z.infer<typeof OrderSchemaFieldSchema>;

export const QueryResponseSchema = <T extends object>(
  itemSchema: z.ZodType<T>
) =>
  z.object({
    offset: z.number(),
    total: z.number(),
    results: z.array(itemSchema),
    meta: z.record(z.string()),
  });
export type QueryResponse<T extends object> = z.infer<
  ReturnType<typeof QueryResponseSchema<T>>
>;

export const QueryBaseSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(25),
  meta: z.record(z.string()).optional(),
});

export const QueryCustomersRequestSchema = QueryBaseSchema.extend({
  orderBy: z.array(CustomerSchemaFieldSchema).optional().default([]),
  orderByDesc: z.array(CustomerSchemaFieldSchema).optional().default([]),
  include: z.array(z.string()).optional().default(["total"]),
  fields: z.array(CustomerSchemaFieldSchema).optional(),
  countryStartsWith: z.string().optional().default(""),
  ids: z.array(z.string()).optional().default([]),
  ...CustomerSchema.partial().shape,
});
export type QueryCustomersRequest = z.infer<typeof QueryCustomersRequestSchema>;

export const QueryOrdersRequestSchema = QueryBaseSchema.extend({
  orderBy: z.array(OrderSchemaFieldSchema).optional().default([]),
  orderByDesc: z.array(OrderSchemaFieldSchema).optional().default([]),
  include: z.array(z.string()).optional().default(["total"]),
  fields: z.array(OrderSchemaFieldSchema).optional(),
  ...OrderSchema.partial().shape,
});
export type QueryOrdersRequest = z.infer<typeof QueryOrdersRequestSchema>;

// GetCustomerDetails API schemas
export const OrderDetailSchema = z.object({
  orderId: z.number().optional(),
  productId: z.number().optional(),
  unitPrice: z.number().optional(),
  quantity: z.number().optional(),
  discount: z.number().optional(),
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export const CustomerOrderSchema = z.object({
  order: OrderSchema,
  orderDetails: z.array(OrderDetailSchema),
});
export type CustomerOrder = z.infer<typeof CustomerOrderSchema>;

export const ResponseStatusSchema = z.object({
  errorCode: z.string().optional(),
  message: z.string().optional(),
  stackTrace: z.string().optional(),
  errors: z
    .array(
      z.object({
        errorCode: z.string().optional(),
        fieldName: z.string().optional(),
        message: z.string().optional(),
        meta: z.record(z.string()).optional(),
      })
    )
    .optional(),
  meta: z.record(z.string()).optional(),
});
export type ResponseStatus = z.infer<typeof ResponseStatusSchema>;

export const CustomerDetailsResponseSchema = z.object({
  customer: CustomerSchema,
  orders: z.array(CustomerOrderSchema),
  responseStatus: ResponseStatusSchema,
});
export type CustomerDetailsResponse = z.infer<
  typeof CustomerDetailsResponseSchema
>;
