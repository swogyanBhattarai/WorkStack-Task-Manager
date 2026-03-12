type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const colors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "var(--gray-100)", text: "var(--gray-600)" },
  success: { bg: "#dcfce7", text: "#166534" },
  warning: { bg: "#fef3c7", text: "#92400e" },
  danger: { bg: "#fee2e2", text: "#991b1b" },
  accent: { bg: "var(--accent-100)", text: "var(--accent-700)" },
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const { bg, text } = colors[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        fontSize: "0.75rem",
        fontWeight: 600,
        borderRadius: "var(--radius-full)",
        background: bg,
        color: text,
        whiteSpace: "nowrap",
        lineHeight: 1.6,
      }}
    >
      {children}
    </span>
  );
}
