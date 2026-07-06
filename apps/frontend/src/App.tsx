import React from "react";
import { useAuth } from "./lib/auth-context";
import { LoginPage } from "./pages/Login";
import { RootLayout } from "./layouts/RootLayout";

function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>
    </div>
  );
}

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <RootLayout>
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
    </RootLayout>
  );
}
