"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getUserById } from "@/services/userService";
import { UserModel } from "@/types";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getUserById(Number(id));
        setUser(data);
      } catch {
        setError("User not found.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
          <div className="skeleton" style={{ height: 32, width: 200 }} />
          <div className="skeleton" style={{ height: 18, width: 120 }} />
          <div className="skeleton" style={{ height: 100 }} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in" style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: 16 }}>
            {error ?? "User not found."}
          </p>
          <Button variant="secondary" onClick={() => router.push("/users")}>Back to Users</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 720 }}>
        {/* Back */}
        <button
          onClick={() => router.push("/users")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            marginBottom: 24,
            padding: 0,
          }}
        >
          ← Back to Users
        </button>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <h1 className="text-display" style={{ marginBottom: 8 }}>
              {user.username}
            </h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {user.roles.map((role) => (
                <Badge key={role} variant={role === "ADMIN" ? "accent" : "default"}>{role}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Detail cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <DetailCard label="ID" value={String(user.id)} />
          <DetailCard label="Created" value={formatDateTime(user.createdAt)} />
          <DetailCard label="Updated" value={formatDateTime(user.updatedAt)} />
        </div>

        {/* Password (hidden) */}
        <div
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            marginBottom: 20,
          }}
        >
          <h3
            className="text-subheading"
            style={{ marginBottom: 12, color: "var(--text-secondary)" }}
          >
            Password (hashed)
          </h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7, wordBreak: "break-all" }}>
            {user.password ? "••••••••••••••••••••••••••••••••••••••••" : "No password set."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}


function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
      }}
    >
      <span className="text-caption">{label}</span>
      <p style={{ fontSize: "0.9375rem", fontWeight: 600, marginTop: 4 }}>
        {value}
      </p>
    </div>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
