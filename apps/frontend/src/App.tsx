import React from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./lib/auth-context";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ auth: { isAuthenticated } }}
    />
  );
}
