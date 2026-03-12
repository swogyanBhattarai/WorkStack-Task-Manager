"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "var(--sidebar-width)",
          flex: 1,
          padding: "32px 40px",
          background: "var(--bg-secondary)",
          minHeight: "100vh",
        }}
        className="animate-fade-in"
      >
        {children}
      </main>
    </div>
  );
}
