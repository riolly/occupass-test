import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-4 bg-primary text-white shadow-lg">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">
            <Link to="/" className="hover:text-blue-200">
              Customer & Orders Management
            </Link>
          </div>

          <div className="flex gap-6">
            <Link
              to="/"
              className="hover:text-blue-200 font-medium"
              activeProps={{
                className: "text-blue-200 border-b-2 border-blue-200",
              }}
            >
              Home
            </Link>
            <Link
              to="/customers"
              className="hover:text-blue-200 font-medium"
              activeProps={{
                className: "text-blue-200 border-b-2 border-blue-200",
              }}
            >
              Customers
            </Link>
            <Link
              to="/orders"
              className="hover:text-blue-200 font-medium"
              activeProps={{
                className: "text-blue-200 border-b-2 border-blue-200",
              }}
            >
              Orders
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
