"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/services/userService";
import type { SpringBootError } from "@/types";
import { AxiosError } from "axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

const roleOptions = ["admin", "user"] as const;

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    roles: z.array(z.enum(roleOptions)).min(1, "Select at least one role"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      roles: ["admin"],
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setApiError(null);
    setLoading(true);

    try {
      await registerUser({
        username: values.username,
        password: values.password,
        roles: values.roles,
      });
      router.push("/login");
    } catch (err) {
      const axiosErr = err as AxiosError<SpringBootError>;
      const message =
        axiosErr.response?.data?.message ??
        "Registration failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-6">
      <div className="w-full max-w-[400px] bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-9 py-10 shadow-[var(--shadow-lg)] animate-scale-in">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-500)] text-white flex items-center justify-center font-bold text-base">
            W
          </div>
          <h1 className="text-[1.3rem] font-bold text-[var(--text-primary)] tracking-[-0.02em]">
            WorkStack
          </h1>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-7">Create your account</p>

        {/* API error banner */}
        {apiError && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-100 text-red-800 text-[0.8125rem] font-medium mb-5 animate-fade-in-up">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
          <Input
            label="Username"
            placeholder="Choose a username"
            error={errors.username?.message}
            autoComplete="username"
            {...register("username")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          <div className="flex flex-col gap-2">
            <p className="text-[0.8125rem] font-semibold text-[var(--text-secondary)]">
              Roles
            </p>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={role}
                    className="h-4 w-4 accent-[var(--accent-500)]"
                    {...register("roles")}
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
            {errors.roles?.message && (
              <span className="text-xs font-medium text-[var(--danger)]">
                {errors.roles.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.8125rem] text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent-500)] font-semibold no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
