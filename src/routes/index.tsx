import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Customer & Orders Management
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your customers and orders efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Customers Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              View and manage customer information, contact details, and
              addresses.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/customers">
              <Button className="w-full">View Customers</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Track and manage orders, shipping information, and order history.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/orders">
              <Button className="w-full">View Orders</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
