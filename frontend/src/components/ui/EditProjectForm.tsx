"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DataTable, { Column } from "@/components/ui/DataTable";
import { updateProject, getProjectById } from "@/services/projectService";
import { getUsers } from "@/services/userService";
import { getTasks } from "@/services/taskService";
import { useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { ProjectResponse, UserResponse, ProjectUpdate, ProjectModel } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectModel | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskSearchInput, setTaskSearchInput] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    projectName: "",
    projectDescription: "",
    projectStatus: "PENDING",
    taskIds: [] as number[],
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const proj = await getProjectById(Number(id));
        setProject(proj);
        setForm({
          projectName: proj.projectName,
          projectDescription: proj.description,
          projectStatus: proj.projectStatus,
          taskIds: proj.tasks.map((t: any) => t.taskId),
        });
        setSelectedUserIds(proj.users.map((u: any) => u.id));
        setSelectedTaskIds(proj.tasks.map((t: any) => t.taskId));
        const userRes = await getUsers({ pageNum: 1, pageSize: 100, search: userSearch || undefined });
        setUsers(userRes.content);
        const taskRes = await getTasks({ pageNum: 1, pageSize: 100, taskName: taskSearch || undefined });
        setTasks(taskRes.content);
      } catch (e: any) {
        setError(e.response?.data?.message ?? "Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id, userSearch, taskSearch]);

  // Debounced user search
  useEffect(() => {
    const handler = setTimeout(() => {
      setUserSearch(userSearchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [userSearchInput]);

  // Debounced task search
  useEffect(() => {
    const handler = setTimeout(() => {
      setTaskSearch(taskSearchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [taskSearchInput]);
  function handleTaskSelect(taskId: number, checked: boolean) {
    setSelectedTaskIds((prev) => {
      if (checked) {
        if (!prev.includes(taskId)) {
          return [...prev, taskId];
        }
        return prev;
      } else {
        return prev.filter((id) => id !== taskId);
      }
    });
  }

  function handleUserSelect(userId: number, checked: boolean) {
    setSelectedUserIds((prev) => {
      if (checked) {
        // Add userId if not already present
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      } else {
        // Remove userId if present
        return prev.filter((id) => id !== userId);
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateProject(project.projectId, {
        projectName: form.projectName,
        projectDescription: form.projectDescription,
        projectStatus: form.projectStatus as ProjectUpdate["projectStatus"],
        userIds: selectedUserIds,
        taskIds: selectedTaskIds,
      });
      router.push("/projects");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to update project.");
    } finally {
      setSubmitting(false);
    }
  }
  const taskColumns: Column<any>[] = [
    {
      key: "select",
      header: "Select",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedTaskIds.includes(row.taskId)}
          onChange={(e) => handleTaskSelect(row.taskId, e.target.checked)}
        />
      ),
    },
    { key: "taskId", header: "ID" },
    { key: "taskName", header: "Task Name" },
    { key: "taskStatus", header: "Status" },
    {
      key: "project",
      header: "Project",
      render: (row) => row.project?.projectName || "-",
    },
  ];

  const userColumns: Column<UserResponse>[] = [
    {
      key: "select",
      header: "Select",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedUserIds.includes(row.id)}
          onChange={(e) => handleUserSelect(row.id, e.target.checked)}
        />
      ),
    },
    { key: "id", header: "ID" },
    { key: "username", header: "Username" },
    {
      key: "roles",
      header: "Roles",
      render: (row) => row.roles.join(", "),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 700, margin: "0 auto", marginTop: 40 }}>
        <h2 className="text-display mb-4">Edit Project</h2>
        {loading ? (
          <p>Loading...</p>
        ) : project ? (
          <>
            {/* Project Details */}
            <div style={{ marginBottom: 24, background: "var(--bg-primary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: 20 }}>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div>
                  <span className="text-caption">Project ID</span>
                  <div style={{ fontWeight: 600 }}>{project.projectId}</div>
                </div>
                <div>
                  <span className="text-caption">Created</span>
                  <div style={{ fontWeight: 600 }}>{formatDateTime(project.createdAt)}</div>
                </div>
                <div>
                  <span className="text-caption">Updated</span>
                  <div style={{ fontWeight: 600 }}>{formatDateTime(project.updatedAt)}</div>
                </div>
                <div>
                  <span className="text-caption">Status</span>
                  <div style={{ fontWeight: 600 }}>{project.projectStatus}</div>
                </div>
              </div>
            </div>

            {/* Editable Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && <ErrorBanner message={error} />}
              <Input
                label="Project Name"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                required
              />
              <Input
                label="Description"
                value={form.projectDescription}
                onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
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
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: 12 }}>Project Members</label>
                <div style={{ marginBottom: 8 }} />
                <DataTable<UserResponse>
                  columns={userColumns}
                  data={{ content: users, pageNumber: 1, pageSize: 100, numberOfElements: users.length, totalElements: users.length, totalPages: 1 }}
                  loading={false}
                  currentPage={1}
                  pageSize={100}
                  sortBy={"id"}
                  sortDir={"ASC"}
                  searchValue={userSearchInput}
                  rowKey={(r) => r.id}
                  onPageChange={() => {}}
                  onPageSizeChange={() => {}}
                  onSortChange={() => {}}
                  onSearchChange={setUserSearchInput}
                />
              </div>
              <div style={{ marginTop: 24 }}>
                <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: 12 }}>Project Tasks</label>
                <div style={{ marginBottom: 8 }} />
                <DataTable<any>
                  columns={taskColumns}
                  data={{ content: tasks, pageNumber: 1, pageSize: 100, numberOfElements: tasks.length, totalElements: tasks.length, totalPages: 1 }}
                  loading={false}
                  currentPage={1}
                  pageSize={100}
                  sortBy={"taskId"}
                  sortDir={"ASC"}
                  searchValue={taskSearchInput}
                  rowKey={(r) => r.taskId}
                  onPageChange={() => {}}
                  onPageSizeChange={() => {}}
                  onSortChange={() => {}}
                  onSearchChange={setTaskSearchInput}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Update Project"}
                </Button>
              </div>
            </form>

            {/* Tasks List */}
            <div style={{ marginTop: 32 }}>
              <h3 className="text-subheading" style={{ marginBottom: 12 }}>Tasks</h3>
              {project.tasks && project.tasks.length > 0 ? (
                <ul style={{ paddingLeft: 0, margin: 0 }}>
                  {project.tasks.map((task: any, idx: number) => (
                    <li
                      key={task.taskId}
                      style={{
                        marginBottom: idx === project.tasks.length - 1 ? 20 : 20,
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-default)",
                        borderRadius: 8,
                        padding: 16,
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{task.taskName}</div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 4 }}>{task.taskDescription}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: 2 }}>Status: {task.taskStatus}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Due: {formatDateTime(task.dueDate)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>No tasks for this project.</p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
function formatDateTime(iso: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
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
