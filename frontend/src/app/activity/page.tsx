"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { getActivityLogs } from "@/services/activityService";
import type { ActivityResponse, PageResponse, Activity } from "@/types";

export default function ActivityPage() {
  const [data, setData] = useState<PageResponse<ActivityResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("activityId");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getActivityLogs({
        pageNum: page,
        pageSize,
        sortBy,
        sortDir,
        userSearch: search || undefined,
        activitySearch: undefined,
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

  const columns: Column<ActivityResponse>[] = [
    { key: "activityId", header: "ID", sortable: true },
    { key: "username", header: "User", sortable: true },
    {
      key: "activity",
      header: "Type",
      sortable: true,
      render: (row) => (
        <Badge variant={activityBadgeVariant(row.activity)}>
          {row.activity}
        </Badge>
      ),
    },
    {
      key: "activityDescription",
      header: "Description",
      render: (row) => (
        <span style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
          {row.activityDescription}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      render: (row) => (
        <span
          title={new Date(row.createdAt).toLocaleString()}
          style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}
        >
          {relativeTime(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="text-display" style={{ marginBottom: 4 }}>
            Activity Log
          </h1>
          <p className="text-caption">
            Track all actions across your workspace
          </p>
        </div>

        {/* Table */}
        <DataTable<ActivityResponse>
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
          rowKey={(r) => r.activityId}
        />
      </div>
    </DashboardLayout>
  );
}

/* ─── Helpers ────────────────────────────────────────── */

function activityBadgeVariant(
  activity: Activity
): "default" | "success" | "warning" | "danger" | "accent" {
  switch (activity) {
    case "CREATE":
      return "success";
    case "UPDATE":
      return "accent";
    case "DELETE":
      return "danger";
    case "LOGIN":
      return "warning";
    case "READ":
    default:
      return "default";
  }
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}