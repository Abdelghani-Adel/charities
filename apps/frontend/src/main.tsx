import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./lib/auth-context";
import { App } from "./App";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
