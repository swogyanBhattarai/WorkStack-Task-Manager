"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { updateUser } from "@/services/userService";
import { useRouter, useParams } from "next/navigation";

export default function EditUserForm({ user }: { user: any }) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [username, setUsername] = useState(user?.username || "");
  const [roles, setRoles] = useState(user?.roles?.join(", ") || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parseRoles(raw: string): string[] {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateUser(Number(id), {
        username,
        roles: parseRoles(roles),
        projectIds: [],
      });
      router.push("/users");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <h2 className="text-display">Edit User</h2>
      {error && <ErrorBanner message={error} />}
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Roles (comma-separated)"
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
        placeholder="USER, ADMIN"
        required
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        background: "#fee2e2",
        color: "#991b1b",
        fontSize: "0.8125rem",
        fontWeight: 500,
      }}
    >
      {message}
    </div>
  );
}
