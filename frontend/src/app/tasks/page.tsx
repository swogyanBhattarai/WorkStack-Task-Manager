"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "@/services/taskService";
import type { TaskResponse, PageResponse, TaskStatus } from "@/types";

type ModalMode = "add" | "edit" | "delete" | null;

interface TaskForm {
  taskName: string;
  taskDescription: string;
  taskStatus: string;
  dueDate: string;
  taskLabels: string;
}

const EMPTY_FORM: TaskForm = {
  taskName: "",
  taskDescription: "",
  taskStatus: "ONGOING",
  dueDate: "",
  taskLabels: "",
};

export default function TasksPage() {
  const router = useRouter();
  const [data, setData] = useState<PageResponse<TaskResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("taskId");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks({
        pageNum: page,
        pageSize,
        sortBy,
        sortDir,
        taskName: search || undefined,
      });
      setData(res);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortDir, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setApiError(null);
    setModalMode("add");
  }

  function openEdit(task: TaskResponse) {
    setSelectedTask(task);
    setForm({
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      taskStatus: task.taskStatus,
      dueDate: task.dueDate,
      taskLabels: task.takLabels?.join(", ") ?? "",
    });
    setApiError(null);
    setModalMode("edit");
  }

  function openDelete(task: TaskResponse) {
    setSelectedTask(task);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedTask(null);
    setApiError(null);
  }

  function parseLabels(raw: string): string[] {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setApiError(null);
    try {
      await addTask({
        taskName: form.taskName,
        taskDescription: form.taskDescription,
        taskStatus: form.taskStatus,
        dueDate: form.dueDate,
        taskLabels: parseLabels(form.taskLabels),
      });
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to add task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await updateTask(selectedTask.taskId, {
        taskName: form.taskName,
        taskDescription: form.taskDescription,
        taskStatus: form.taskStatus as TaskStatus,
        dueDate: form.dueDate,
        taskLabels: parseLabels(form.taskLabels),
      });
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to update task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await deleteTask(selectedTask.taskId);
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to delete task.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<TaskResponse>[] = [
    { key: "taskId", header: "ID", sortable: true },
    {
      key: "taskName",
      header: "Name",
      sortable: true,
      render: (row) => (
        <span
          style={{
            color: "var(--accent-500)",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => router.push(`/tasks/${row.taskId}`)}
        >
          {row.taskName}
        </span>
      ),
    },
    {
      key: "taskStatus",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.taskStatus === "COMPLETED" ? "success" : "accent"}>
          {row.taskStatus}
        </Badge>
      ),
    },
    { key: "dueDate", header: "Due Date", sortable: true },
    {
      key: "project",
      header: "Project",
      render: (row) => (
        <span style={{ color: "var(--text-secondary)" }}>
          {row.project?.projectName ?? "—"}
        </span>
      ),
    },
    {
      key: "takLabels",
      header: "Labels",
      render: (row) =>
        row.takLabels?.length ? (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {row.takLabels.map((l) => (
              <Badge key={l} variant="default">
                {l}
              </Badge>
            ))}
          </div>
        ) : (
          <span style={{ color: "var(--text-tertiary)" }}>—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => openDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 className="text-display" style={{ marginBottom: 4 }}>
              Tasks
            </h1>
            <p className="text-caption">Manage your tasks</p>
          </div>
          <Button onClick={openAdd}>+ Add Task</Button>
        </div>

        {/* Table */}
        <DataTable<TaskResponse>
          columns={columns}
          data={data}
          loading={loading}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir); }}
          onSearchChange={(s) => { setSearch(s); setPage(1); }}
          currentPage={page}
          pageSize={pageSize}
          sortBy={sortBy}
          sortDir={sortDir}
          searchValue={search}
          rowKey={(r) => r.taskId}
        />
      </div>

      {/* ─── Add Modal ───────────────────────────────── */}
      <Modal open={modalMode === "add"} onClose={closeModal} title="Add Task" width={520}>
        <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apiError && <ErrorBanner message={apiError} />}
          <Input
            label="Task Name"
            value={form.taskName}
            onChange={(e) => setForm({ ...form, taskName: e.target.value })}
            required
          />
          <TextareaField
            label="Description"
            value={form.taskDescription}
            onChange={(v) => setForm({ ...form, taskDescription: v })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <SelectField
              label="Status"
              value={form.taskStatus}
              onChange={(v) => setForm({ ...form, taskStatus: v })}
              options={[
                { value: "ONGOING", label: "Ongoing" },
                { value: "COMPLETED", label: "Completed" },
              ]}
            />
            <Input
              label="Due Date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>
          <Input
            label="Labels (comma-separated)"
            value={form.taskLabels}
            onChange={(e) => setForm({ ...form, taskLabels: e.target.value })}
            placeholder="bug, frontend, urgent"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Edit Modal ──────────────────────────────── */}
      <Modal open={modalMode === "edit"} onClose={closeModal} title="Edit Task" width={520}>
        <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apiError && <ErrorBanner message={apiError} />}
          <Input
            label="Task Name"
            value={form.taskName}
            onChange={(e) => setForm({ ...form, taskName: e.target.value })}
            required
          />
          <TextareaField
            label="Description"
            value={form.taskDescription}
            onChange={(v) => setForm({ ...form, taskDescription: v })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <SelectField
              label="Status"
              value={form.taskStatus}
              onChange={(v) => setForm({ ...form, taskStatus: v })}
              options={[
                { value: "ONGOING", label: "Ongoing" },
                { value: "COMPLETED", label: "Completed" },
              ]}
            />
            <Input
              label="Due Date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>
          <Input
            label="Labels (comma-separated)"
            value={form.taskLabels}
            onChange={(e) => setForm({ ...form, taskLabels: e.target.value })}
            placeholder="bug, frontend, urgent"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Modal ────────────────────────────── */}
      <Modal open={modalMode === "delete"} onClose={closeModal} title="Delete Task" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apiError && <ErrorBanner message={apiError} />}
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedTask?.taskName}
            </strong>
            ? This action cannot be undone.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" disabled={submitting} onClick={handleDelete}>
              {submitting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

/* ─── Shared field helpers ───────────────────────────── */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
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

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{
          padding: "9px 12px",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-sans)",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          outline: "none",
          resize: "vertical",
        }}
      />
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
