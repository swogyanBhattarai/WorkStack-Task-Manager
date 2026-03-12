import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, style, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            padding: "9px 12px",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            fontFamily: "var(--font-sans)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
            outline: "none",
            width: "100%",
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--danger)"
              : "var(--accent-500)";
            e.currentTarget.style.boxShadow = `0 0 0 3px ${
              error ? "rgba(239,68,68,0.15)" : "var(--accent-100)"
            }`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--danger)"
              : "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...rest}
        />
        {error && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--danger)",
              fontWeight: 500,
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
