"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return null;
  }

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
