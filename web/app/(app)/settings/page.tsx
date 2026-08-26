"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const logout = useLogout();

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <h2 className="font-display text-xl font-semibold text-ink">Settings</h2>

      <Card className="p-5">
        <p className="mb-3 text-sm font-medium text-ink">Profile</p>
        {isLoading || !user ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 font-mono text-sm font-semibold text-coral">
              {initials(user.name)}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-sm font-medium text-ink">Appearance</p>
        <div className="flex gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-md border py-3 text-xs font-medium",
                theme === value ? "border-coral bg-coral/5 text-coral" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-sm font-medium text-ink">Session</p>
        <Button variant="danger" size="sm" onClick={() => logout.mutate()}>
          <LogOut className="h-3.5 w-3.5" /> Log out
        </Button>
      </Card>
    </div>
  );
}
