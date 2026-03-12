import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--accent-500)",
    color: "#fff",
    border: "1px solid var(--accent-600)",
  },
  secondary: {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-default)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--danger)",
    color: "#fff",
    border: "1px solid var(--danger)",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: "0.8125rem" },
  md: { padding: "8px 16px", fontSize: "0.875rem" },
  lg: { padding: "10px 20px", fontSize: "0.9375rem" },
};

export default function Button({
  variant = "primary",
  size = "md",
  style,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = disabled ? "0.5" : "1";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
