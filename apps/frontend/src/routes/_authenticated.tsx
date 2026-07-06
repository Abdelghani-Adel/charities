import React from "react";
import { createRoute, redirect, Outlet } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { SidebarContent } from "@components/sidebar";
import { Header } from "@components/header";

function AuthenticatedLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen" dir="rtl">
      <aside className="hidden lg:flex shrink-0 h-full">
        <SidebarContent
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          variant="desktop"
        />
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
