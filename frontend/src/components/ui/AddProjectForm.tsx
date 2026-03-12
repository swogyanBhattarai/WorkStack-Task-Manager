"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { addProject } from "@/services/projectService";
import DashboardLayout from "@/components/layout/DashboardLayout";

const EMPTY_FORM = {
  projectName: "",
  description: "",
  projectStatus: "PENDING",
};

export default function AddProjectForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addProject({
        projectName: form.projectName,
        description: form.description,
        projectStatus: form.projectStatus,
      });
      window.location.href = "/projects";
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 420, margin: "0 auto", marginTop: 40 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 className="text-display">Add Project</h2>
          {error && <ErrorBanner message={error} />}
          <Input
            label="Project Name"
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <SelectField
            label="Status"
            value={form.projectStatus}
            onChange={(v) => setForm({ ...form, projectStatus: v })}
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "COMPLETED", label: "Completed" },
            ]}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "9px 12px",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-sans)",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
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
