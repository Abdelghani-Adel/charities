import React from "react";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <div dir="auto" style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>{t("login")}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">{t("email")}</label>
          <input
            id="email"
            type="email"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            type="password"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 24px" }}>
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
