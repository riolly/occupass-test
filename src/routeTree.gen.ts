/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as OrdersIndexImport } from './routes/orders.index'
import { Route as CustomersIndexImport } from './routes/customers.index'
import { Route as CustomerIdImport } from './routes/customer.$id'
import { Route as OrdersCustomerIdIndexImport } from './routes/orders.$customerId.index'
import { Route as OrdersCustomerIdOrderIdImport } from './routes/orders.$customerId.$orderId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const OrdersIndexRoute = OrdersIndexImport.update({
  id: '/orders/',
  path: '/orders/',
  getParentRoute: () => rootRoute,
} as any)

const CustomersIndexRoute = CustomersIndexImport.update({
  id: '/customers/',
  path: '/customers/',
  getParentRoute: () => rootRoute,
} as any)

const CustomerIdRoute = CustomerIdImport.update({
  id: '/customer/$id',
  path: '/customer/$id',
  getParentRoute: () => rootRoute,
} as any)

const OrdersCustomerIdIndexRoute = OrdersCustomerIdIndexImport.update({
  id: '/orders/$customerId/',
  path: '/orders/$customerId/',
  getParentRoute: () => rootRoute,
} as any)

const OrdersCustomerIdOrderIdRoute = OrdersCustomerIdOrderIdImport.update({
  id: '/orders/$customerId/$orderId',
  path: '/orders/$customerId/$orderId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/customer/$id': {
      id: '/customer/$id'
      path: '/customer/$id'
      fullPath: '/customer/$id'
      preLoaderRoute: typeof CustomerIdImport
      parentRoute: typeof rootRoute
    }
    '/customers/': {
      id: '/customers/'
      path: '/customers'
      fullPath: '/customers'
      preLoaderRoute: typeof CustomersIndexImport
      parentRoute: typeof rootRoute
    }
    '/orders/': {
      id: '/orders/'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof OrdersIndexImport
      parentRoute: typeof rootRoute
    }
    '/orders/$customerId/$orderId': {
      id: '/orders/$customerId/$orderId'
      path: '/orders/$customerId/$orderId'
      fullPath: '/orders/$customerId/$orderId'
      preLoaderRoute: typeof OrdersCustomerIdOrderIdImport
      parentRoute: typeof rootRoute
    }
    '/orders/$customerId/': {
      id: '/orders/$customerId/'
      path: '/orders/$customerId'
      fullPath: '/orders/$customerId'
      preLoaderRoute: typeof OrdersCustomerIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customers': typeof CustomersIndexRoute
  '/orders': typeof OrdersIndexRoute
  '/orders/$customerId/$orderId': typeof OrdersCustomerIdOrderIdRoute
  '/orders/$customerId': typeof OrdersCustomerIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customers': typeof CustomersIndexRoute
  '/orders': typeof OrdersIndexRoute
  '/orders/$customerId/$orderId': typeof OrdersCustomerIdOrderIdRoute
  '/orders/$customerId': typeof OrdersCustomerIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customers/': typeof CustomersIndexRoute
  '/orders/': typeof OrdersIndexRoute
  '/orders/$customerId/$orderId': typeof OrdersCustomerIdOrderIdRoute
  '/orders/$customerId/': typeof OrdersCustomerIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/customer/$id'
    | '/customers'
    | '/orders'
    | '/orders/$customerId/$orderId'
    | '/orders/$customerId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/customer/$id'
    | '/customers'
    | '/orders'
    | '/orders/$customerId/$orderId'
    | '/orders/$customerId'
  id:
    | '__root__'
    | '/'
    | '/customer/$id'
    | '/customers/'
    | '/orders/'
    | '/orders/$customerId/$orderId'
    | '/orders/$customerId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CustomerIdRoute: typeof CustomerIdRoute
  CustomersIndexRoute: typeof CustomersIndexRoute
  OrdersIndexRoute: typeof OrdersIndexRoute
  OrdersCustomerIdOrderIdRoute: typeof OrdersCustomerIdOrderIdRoute
  OrdersCustomerIdIndexRoute: typeof OrdersCustomerIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CustomerIdRoute: CustomerIdRoute,
  CustomersIndexRoute: CustomersIndexRoute,
  OrdersIndexRoute: OrdersIndexRoute,
  OrdersCustomerIdOrderIdRoute: OrdersCustomerIdOrderIdRoute,
  OrdersCustomerIdIndexRoute: OrdersCustomerIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/customer/$id",
        "/customers/",
        "/orders/",
        "/orders/$customerId/$orderId",
        "/orders/$customerId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/customer/$id": {
      "filePath": "customer.$id.tsx"
    },
    "/customers/": {
      "filePath": "customers.index.tsx"
    },
    "/orders/": {
      "filePath": "orders.index.tsx"
    },
    "/orders/$customerId/$orderId": {
      "filePath": "orders.$customerId.$orderId.tsx"
    },
    "/orders/$customerId/": {
      "filePath": "orders.$customerId.index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
