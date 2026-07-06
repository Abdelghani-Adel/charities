import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRootRoute, createRouter } from "@tanstack/react-router";
import { LoginPage } from "./pages/Login";
import { RootLayout } from "./layouts/RootLayout";
import "./i18n";

const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <LoginPage />
    </RootLayout>
  ),
});

const routeTree = rootRoute;
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
