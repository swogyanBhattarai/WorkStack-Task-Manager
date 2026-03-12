"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import { getUsers } from "@/services/userService";
import { getProjects } from "@/services/projectService";
import { getTasks } from "@/services/taskService";
import { getActivityLogs } from "@/services/activityService";
import type {
  ActivityResponse,
  PageResponse,
  ProjectResponse,
  TaskResponse,
  UserResponse,
  Activity,
  ProjectStatus,
  TaskStatus,
} from "@/types";

interface Stats {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
  totalActivity: number;
  projectBreakdown: Record<string, number>;
  taskBreakdown: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [users, projects, tasks, activity] = await Promise.all([
          getUsers({ pageNum: 1, pageSize: 1 }),
          getProjects({ pageNum: 1, pageSize: 100 }),
          getTasks({ pageNum: 1, pageSize: 100 }),
          getActivityLogs({ pageNum: 1, pageSize: 5, sortBy: "activityId", sortDir: "DESC" }),
        ]);

        const projectBreakdown: Record<string, number> = {};
        projects.content.forEach((p) => {
          projectBreakdown[p.projectStatus] =
            (projectBreakdown[p.projectStatus] ?? 0) + 1;
        });

        const taskBreakdown: Record<string, number> = {};
        tasks.content.forEach((t) => {
          taskBreakdown[t.taskStatus] =
            (taskBreakdown[t.taskStatus] ?? 0) + 1;
        });

        setStats({
          totalProjects: projects.totalElements,
          totalTasks: tasks.totalElements,
          totalUsers: users.totalElements,
          totalActivity: activity.totalElements,
          projectBreakdown,
          taskBreakdown,
        });
        setRecentActivity(activity.content);
      } catch {
        /* errors handled by apiClient interceptor */
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Overview of your workspace</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard
            label="Total Projects"
            value={stats?.totalProjects}
            loading={loading}
            icon={<FolderIcon />}
            color="var(--accent-500)"
          />
          <StatCard
            label="Total Tasks"
            value={stats?.totalTasks}
            loading={loading}
            icon={<CheckIcon />}
            color="var(--success)"
          />
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            loading={loading}
            icon={<UsersIcon />}
            color="var(--warning)"
          />
          <StatCard
            label="Recent Activity"
            value={stats?.totalActivity}
            loading={loading}
            icon={<ActivityIcon />}
            color="var(--danger)"
          />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Breakdowns */}
          <div className="flex flex-col gap-5">
            <BreakdownCard
              title="Projects by Status"
              breakdown={stats?.projectBreakdown}
              total={stats?.totalProjects ?? 0}
              loading={loading}
              colorMap={{ COMPLETED: "var(--success)", PENDING: "var(--warning)" }}
            />
            <BreakdownCard
              title="Tasks by Status"
              breakdown={stats?.taskBreakdown}
              total={stats?.totalTasks ?? 0}
              loading={loading}
              colorMap={{ COMPLETED: "var(--success)", ONGOING: "var(--accent-500)" }}
            />
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--border-default)]">
                {recentActivity.map((a) => (
                  <div key={a.activityId} className="flex items-start gap-3 py-3 animate-fade-in-up">
                    <div className="pt-1">
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{ background: activityColor(a.activity) }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">
                        <strong className="font-semibold">{a.username}</strong>{" "}
                        {a.activityDescription || a.activity}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(a.createdAt)}</p>
                    </div>
                    <Badge variant={activityBadgeVariant(a.activity)}>
                      {a.activity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ─── Stat Card ──────────────────────────────────────── */

function StatCard({
  label,
  value,
  loading,
  icon,
  color,
}: {
  label: string;
  value: number | undefined;
  loading: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        animation: "fadeInUp var(--transition-slow) both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: color + "14",
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: 32, width: 60 }} />
      ) : (
        <span
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          {value ?? 0}
        </span>
      )}
    </div>
  );
}

/* ─── Breakdown Card ─────────────────────────────────── */

function BreakdownCard({
  title,
  breakdown,
  total,
  loading,
  colorMap,
}: {
  title: string;
  breakdown: Record<string, number> | undefined;
  total: number;
  loading: boolean;
  colorMap: Record<string, string>;
}) {
  const entries = breakdown ? Object.entries(breakdown) : [];

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        animation: "fadeInUp var(--transition-slow) 0.1s both",
      }}
    >
      <h3
        className="text-subheading"
        style={{ marginBottom: 20 }}
      >
        {title}
      </h3>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="skeleton" style={{ height: 10, borderRadius: 99 }} />
          <div className="skeleton" style={{ height: 16, width: "60%" }} />
        </div>
      ) : total === 0 ? (
        <p className="text-caption">No data</p>
      ) : (
        <>
          {/* Bar */}
          <div
            style={{
              display: "flex",
              height: 10,
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
              background: "var(--bg-tertiary)",
              marginBottom: 16,
            }}
          >
            {entries.map(([key, count]) => (
              <div
                key={key}
                style={{
                  width: `${(count / total) * 100}%`,
                  background: colorMap[key] ?? "var(--gray-400)",
                  transition: "width var(--transition-slow)",
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {entries.map(([key, count]) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "var(--radius-full)",
                    background: colorMap[key] ?? "var(--gray-400)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  {key}
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────── */

function activityColor(activity: Activity): string {
  const map: Record<string, string> = {
    CREATE: "var(--success)",
    UPDATE: "var(--accent-500)",
    DELETE: "var(--danger)",
    READ: "var(--gray-400)",
    LOGIN: "var(--warning)",
  };
  return map[activity] ?? "var(--gray-400)";
}

function activityBadgeVariant(
  activity: Activity
): "default" | "success" | "warning" | "danger" | "accent" {
  const map: Record<string, "default" | "success" | "warning" | "danger" | "accent"> = {
    CREATE: "success",
    UPDATE: "accent",
    DELETE: "danger",
    READ: "default",
    LOGIN: "warning",
  };
  return map[activity] ?? "default";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Inline icons ───────────────────────────────────── */

function FolderIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13a2 2 0 002 2h16z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
