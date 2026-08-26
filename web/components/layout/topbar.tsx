"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileDrawer } from "./mobile-drawer";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { initials } from "@/lib/utils";

export function Topbar({ title }: { title: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface-raised px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-base font-semibold text-ink">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10 font-mono text-xs font-semibold text-coral">
                {initials(user.name)}
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout.mutate()} aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
