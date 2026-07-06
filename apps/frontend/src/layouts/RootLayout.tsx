import React from "react";

const styles = {
  minHeight: "100vh",
  direction: "rtl" as const,
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  return <div style={styles}>{children}</div>;
}
