"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { getUsers, updateUser, deleteUser } from "@/services/userService";
import type { UserResponse, PageResponse } from "@/types";

type ModalMode = "edit" | "delete" | null;

interface UserForm {
  username: string;
  roles: string;
}

export default function UsersPage() {
  const [data, setData] = useState<PageResponse<UserResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<UserForm>({ username: "", roles: "" });
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        pageNum: page,
        pageSize,
        sortBy,
        sortDir,
        search: search || undefined,
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

  function openEdit(user: UserResponse) {
    setSelectedUser(user);
    setForm({
      username: user.username,
      roles: user.roles.join(", "),
    });
    setApiError(null);
    setModalMode("edit");
  }

  function openDelete(user: UserResponse) {
    setSelectedUser(user);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedUser(null);
    setApiError(null);
  }

  function parseRoles(raw: string): string[] {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await updateUser(selectedUser.id, {
        username: form.username,
        roles: parseRoles(form.roles),
        projectIds: [],
      });
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await deleteUser(selectedUser.id);
      closeModal();
      fetchData();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? "Failed to delete user.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<UserResponse>[] = [
    { key: "id", header: "ID", sortable: true },
    {
      key: "username",
      header: "Username",
      sortable: true,
      render: (row) => (
        <span
          style={{ color: "var(--accent-500)", cursor: "pointer", fontWeight: 500 }}
          onClick={() => window.location.href = `/users/${row.id}`}
        >
          {row.username}
        </span>
      ),
    },
    {
      key: "roles",
      header: "Roles",
      render: (row) => (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {row.roles.map((r) => (
            <Badge key={r} variant={r === "ADMIN" ? "accent" : "default"}>
              {r}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      render: (row) => formatDate(row.updatedAt),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" variant="ghost" onClick={() => window.location.href = `/users/edit/${row.id}`}>
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
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="text-display" style={{ marginBottom: 4 }}>
              Users
            </h1>
            <p className="text-caption">Manage user accounts</p>
          </div>
          <Button variant="primary" onClick={() => window.location.href = "/users/add"}>
            Add User
          </Button>
        </div>

        {/* Table */}
        <DataTable<UserResponse>
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
          rowKey={(r) => r.id}
        />
      </div>

      {/* ─── Delete Modal ────────────────────────────── */}
      <Modal open={modalMode === "delete"} onClose={closeModal} title="Delete User" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apiError && <ErrorBanner message={apiError} />}
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedUser?.username}
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

/* ─── Helpers ────────────────────────────────────────── */

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
