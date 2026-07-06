import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { RootLayout } from "../layouts/RootLayout";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
