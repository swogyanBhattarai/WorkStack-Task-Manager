"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getTaskById } from "@/services/taskService";
import type { TaskResponse } from "@/types";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getTaskById(Number(id));
        setTask(data);
      } catch {
        setError("Task not found.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
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

  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in" style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: 16 }}>
            {error ?? "Task not found."}
          </p>
          <Button variant="secondary" onClick={() => router.push("/tasks")}>
            Back to Tasks
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 720 }}>
        {/* Back */}
        <button
          onClick={() => router.push("/tasks")}
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
          ← Back to Tasks
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
              {task.taskName}
            </h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge variant={task.taskStatus === "COMPLETED" ? "success" : "accent"}>
                {task.taskStatus}
              </Badge>
              {task.takLabels?.map((l) => (
                <Badge key={l} variant="default">
                  {l}
                </Badge>
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
          <DetailCard label="Due Date" value={task.dueDate} />
          <DetailCard label="Project" value={task.project?.projectName ?? "—"} />
          <DetailCard label="Created" value={formatDateTime(task.createdAt)} />
          <DetailCard label="Updated" value={formatDateTime(task.updatedAt)} />
        </div>

        {/* Description */}
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
            Description
          </h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {task.taskDescription || "No description provided."}
          </p>
        </div>

        {/* Project info */}
        {task.project && (
          <div
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
            }}
          >
            <h3
              className="text-subheading"
              style={{ marginBottom: 12, color: "var(--text-secondary)" }}
            >
              Project Details
            </h3>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <span className="text-caption">Name</span>
                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  {task.project.projectName}
                </p>
              </div>
              <div>
                <span className="text-caption">Status</span>
                <div style={{ marginTop: 2 }}>
                  <Badge
                    variant={
                      task.project.projectStatus === "COMPLETED"
                        ? "success"
                        : "warning"
                    }
                  >
                    {task.project.projectStatus}
                  </Badge>
                </div>
              </div>
            </div>
            {task.project.description && (
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  marginTop: 12,
                }}
              >
                {task.project.description}
              </p>
            )}
          </div>
        )}
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
