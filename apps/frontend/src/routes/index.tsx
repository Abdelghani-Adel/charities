import { createRoute, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

function DashboardPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome! You are logged in.</p>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});
