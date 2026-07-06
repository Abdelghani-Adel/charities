import { createRoute } from "@tanstack/react-router";
import { Route as authenticatedRoute } from "./_authenticated";

function DashboardPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome! You are logged in.</p>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: DashboardPage,
});
