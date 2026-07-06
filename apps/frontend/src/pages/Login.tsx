import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../lib/auth-context";

export function LoginPage() {
  const { t } = useTranslation();
  const { login, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
    } catch {
      // error is set in auth-context
    }
  };

  return (
    <div dir="auto" style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>{t("login")}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">{t("email")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: 16,
              padding: 8,
              background: "#fff0f0",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !email || !password}
          style={{ padding: "8px 24px", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
}
