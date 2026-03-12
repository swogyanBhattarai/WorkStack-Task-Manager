"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/services/projectService";
import type { ProjectResponse, PageResponse, ProjectStatus } from "@/types";

type ModalMode = "add" | "edit" | "delete" | null;

interface ProjectForm {
  projectName: string;
  description: string;
  projectStatus: string;
}

const EMPTY_FORM: ProjectForm = {
  projectName: "",
  description: "",
  projectStatus: "PENDING",
};

export default function ProjectsPage() {
  const router = useRouter();
  const [data, setData] = useState<PageResponse<ProjectResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("projectId");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects({
        pageNum: page,
        pageSize,
        sortBy,
        sortDir,
        projectSearch: search || undefined,
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

  function openEdit(project: ProjectResponse) {
    setSelectedProject(project);
    setForm({
      projectName: project.projectName,
      description: project.description,
      projectStatus: project.projectStatus,
    });
    setApiError(null);
    setModalMode("edit");
  }

  function openDelete(project: ProjectResponse) {
    setSelectedProject(project);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedProject(null);
    setApiError(null);
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setApiError(null);
    try {
      await addProject({
        projectName: form.projectName,
        description: form.description,
        projectStatus: form.projectStatus,
      });
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to add project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await updateProject(selectedProject.projectId, {
        projectName: form.projectName,
        projectDescription: form.description,
        projectStatus: form.projectStatus as ProjectStatus,
        userIds: selectedProject.users.map((u) => u.id),
        taskIds: selectedProject.tasks.map((t) => t.taskId),
      });
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to update project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await deleteProject(selectedProject.projectId);
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to delete project.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<ProjectResponse>[] = [
    { key: "projectId", header: "ID", sortable: true },
    {
      key: "projectName",
      header: "Name",
      sortable: true,
      render: (row) => (
        <span
          style={{
            color: "var(--accent-500)",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => router.push(`/projects/${row.projectId}`)}
        >
          {row.projectName}
        </span>
      ),
    },
    {
      key: "projectStatus",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.projectStatus === "COMPLETED" ? "success" : "warning"}>
          {row.projectStatus}
        </Badge>
      ),
    },
    {
      key: "users",
      header: "Members",
      render: (row) => <span>{row.users.length}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" variant="ghost" onClick={() => window.location.href = `/projects/edit/${row.projectId}` }>
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
              Projects
            </h1>
            <p className="text-caption">Manage your projects</p>
          </div>
          <Button onClick={() => window.location.href = "/projects/add"}>+ Add Project</Button>
        </div>

        {/* Table */}
        <DataTable<ProjectResponse>
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
          rowKey={(r) => r.projectId}
        />
      </div>

      {/* ─── Delete Modal ────────────────────────────── */}
      <Modal open={modalMode === "delete"} onClose={closeModal} title="Delete Project" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apiError && <ErrorBanner message={apiError} />}
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedProject?.projectName}
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

/* ─── Small helpers ──────────────────────────────────── */

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
