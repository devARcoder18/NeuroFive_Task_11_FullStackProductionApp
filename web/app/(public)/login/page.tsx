"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login.mutateAsync(values);
    } catch (err) {
      setError("root", { message: err instanceof ApiError ? err.message : "Something went wrong." });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-coral text-coral-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold">FocusFlow</span>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised p-6">
          <h1 className="font-display text-lg font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to keep your projects moving.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Email</label>
              <Input type="email" {...register("email")} placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <Input type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
            </div>
            {errors.root && <p className="text-xs text-coral">{errors.root.message}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Log in
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/register" className="font-medium text-coral hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
