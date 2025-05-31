# Customer & Orders Management System

A modern React application for managing customers and orders with advanced filtering, sorting, and pagination capabilities.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query (React Query v5)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI + Tailwind)
- **Build Tool**: Vite
- **Testing**: Vitest
- **Package Manager**: pnpm

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components (Button, Card, etc.)
│   ├── DataTable.tsx    # Advanced data table with sorting/pagination
│   └── Header.tsx       # Navigation header
├── hooks/               # Custom React hooks
│   └── useDebounce.ts   # Debounced search functionality
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Home page
│   ├── customers/       # Customer routes
│   └── orders/          # Order routes
├── services/            # API services and utilities
│   └── api.ts           # API client and data fetching
├── types/               # TypeScript type definitions
│   └── api.ts           # API response types
└── styles.css           # Global styles and Tailwind imports
```

## Features

### 🏠 **Home Dashboard**
- Clean card-based interface
- Quick navigation to customers and orders

### 👥 **Customer Management**
- **Server-side pagination** with configurable page sizes
- **Debounced search** by country and customer ID
- **Sortable columns** with visual indicators
- **Customer detail views** with order history
- **Responsive design** with mobile-friendly layout

### 📋 **Order Management**
- **Advanced filtering** by freight amount with decimal support
- **Server-side sorting** on all columns
- **Real-time search** with 500ms debounce
- **Order detail pages** with customer information
- **Export-ready data tables**

### 🔧 **Technical Features**
- **Type-safe API integration** with TypeScript
- **Optimistic UI updates** with loading states
- **Error handling** with user-friendly messages
- **URL state management** for bookmarkable searches
- **Component reusability** with design system
- **Performance optimization** with React Query caching

## API Integration

The application integrates with the Occupass Test API:
- **Base URL**: `https://uitestapi.occupass.com`
- **Endpoints**: 
  - `/query/customers` - Customer search and pagination
  - `/query/orders` - Order search and filtering
  - `/customers/{id}` - Customer details with orders

## Development Guidelines

### Adding New Routes

TanStack Router uses file-based routing. Add new routes by creating files in `src/routes/`:

```
src/routes/
├── products.tsx           # /products
├── products.$id.tsx       # /products/:id
└── products.index.tsx     # /products (index route)
```

### Adding UI Components

Use Shadcn components for consistency:

```bash
pnpx shadcn@latest add [component-name]
```

### Custom Hooks

Follow the pattern in `src/hooks/useDebounce.ts` for reusable logic:

```typescript
export function useCustomHook() {
  // Hook implementation
  return { data, loading, error };
}
```

### API Services

Extend `src/services/api.ts` for new endpoints:

```typescript
export const newApi = {
  async getData(): Promise<DataType> {
    // API call implementation
  },
};
```

## Performance Optimizations

- **Debounced search inputs** (500ms delay)
- **Server-side pagination** to handle large datasets
- **React Query caching** with intelligent cache invalidation
- **Code splitting** via route-based chunks
- **Optimized re-renders** with useCallback and useMemo
