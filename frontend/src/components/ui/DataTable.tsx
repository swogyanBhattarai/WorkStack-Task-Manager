"use client";

import { useState, useCallback, useEffect } from "react";
import type { PageResponse } from "@/types";

/* ─── Column definition ──────────────────────────────── */

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

/* ─── Props ──────────────────────────────────────────── */

interface DataTableProps<T> {
  columns: Column<T>[];
  data: PageResponse<T> | null;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sortBy: string, sortDir: "ASC" | "DESC") => void;
  onSearchChange: (search: string) => void;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDir: "ASC" | "DESC";
  searchValue: string;
  rowKey: (row: T) => string | number;
}

const PAGE_SIZES = [5, 10, 20, 50];

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearchChange,
  currentPage,
  pageSize,
  sortBy,
  sortDir,
  searchValue,
  rowKey,
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState(searchValue);

  // Keep searchInput in sync with searchValue prop (from parent)
  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // Debounce search, but only call onSearchChange if value actually changed
  useEffect(() => {
    if (searchInput !== searchValue) {
      const handler = setTimeout(() => {
        onSearchChange(searchInput);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchInput, searchValue, onSearchChange]);

  function handleSort(key: string) {
    if (sortBy === key) {
      onSortChange(key, sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      onSortChange(key, "ASC");
    }
  }

  function getCellValue(row: T, key: string): React.ReactNode {
    return (row as Record<string, unknown>)[key] as React.ReactNode;
  }

  // Removed unused handleSearchSubmit

  return (
    <div className="bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg overflow-hidden animate-fade-in-up">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-default)] gap-3">
        <div className="flex flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-default)] rounded-md text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-100)] transition"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-secondary)]">{totalElements} results</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-[var(--border-default)] rounded-md text-xs bg-[var(--bg-primary)] text-[var(--text-primary)] cursor-pointer"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  className={
                    (col.sortable ? "cursor-pointer transition text-[var(--text-secondary)] hover:text-[var(--text-primary)] " : "text-[var(--text-secondary)] ") +
                    "text-xs font-semibold uppercase tracking-wide bg-[var(--bg-secondary)] border-b border-[var(--border-default)] px-5 py-2 select-none text-left"
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.key && <SortArrow dir={sortDir} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-[var(--border-default)]">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3">
                        <div className="skeleton h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                      </td>
                    ))}
                  </tr>
                ))
              : data && data.content.length > 0
                ? data.content.map((row) => (
                    <tr key={rowKey(row)} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-secondary)] transition">
                      {columns.map((col) => (
                        <td key={col.key} className="px-5 py-3 text-sm text-[var(--text-primary)]">
                          {col.render ? col.render(row) : getCellValue(row, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                : (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
                          <EmptyIcon />
                          <p>No data found</p>
                        </div>
                      </td>
                    </tr>
                  )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-[var(--border-default)]">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 border border-[var(--border-default)] rounded-md text-xs font-medium bg-[var(--bg-primary)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] transition"
          >
            Previous
          </button>
          <span className="text-xs text-[var(--text-secondary)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 border border-[var(--border-default)] rounded-md text-xs font-medium bg-[var(--bg-primary)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Tiny inline icons ──────────────────────────────── */

function SortArrow({ dir }: { dir: "ASC" | "DESC" }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: dir === "DESC" ? "rotate(180deg)" : undefined,
        transition: "transform 150ms ease",
      }}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.4 }}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
    </svg>
  );
}
