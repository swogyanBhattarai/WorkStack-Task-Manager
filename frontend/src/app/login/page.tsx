"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setToken } from "@/lib/auth";
import { login } from "@/services/userService";
import type { SpringBootError } from "@/types";
import { AxiosError } from "axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setApiError(null);
    setLoading(true);

    try {
      const token = await login(values.username, values.password);
      setToken(token);
      router.push("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<SpringBootError>;
      const message =
        axiosErr.response?.data?.message ??
        "Login failed. Please check your credentials.";
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

        <p className="text-sm text-[var(--text-secondary)] mb-7">Sign in to your account</p>

        {/* API error banner */}
        {apiError && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-100 text-red-800 text-[0.8125rem] font-medium mb-5 animate-fade-in-up">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
          <Input
            label="Username"
            placeholder="Enter your username"
            error={errors.username?.message}
            autoComplete="username"
            {...register("username")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />

          <Button
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.8125rem] text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[var(--accent-500)] font-semibold no-underline hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
