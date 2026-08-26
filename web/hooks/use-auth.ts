"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { User } from "@/types";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validators";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<{ user: User }>("/api/auth/me").then((r) => r.user),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: LoginFormValues) => api.post<{ user: User; token: string }>("/api/auth/login", values),
    onSuccess: (data) => {
      qc.setQueryData(["me"], data.user);
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: RegisterFormValues) => api.post<{ user: User; token: string }>("/api/auth/register", values),
    onSuccess: (data) => {
      qc.setQueryData(["me"], data.user);
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/api/auth/logout"),
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      router.push("/login");
    },
  });
}
