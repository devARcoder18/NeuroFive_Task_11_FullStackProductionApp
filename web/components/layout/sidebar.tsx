"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="group hidden shrink-0 flex-col border-r border-border bg-surface-raised transition-all duration-200 md:flex md:w-[68px] md:hover:w-56">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-coral text-coral-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <span className="hidden font-display text-sm font-semibold group-hover:inline whitespace-nowrap">
          FocusFlow
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-coral/10 text-coral" : "text-muted-foreground hover:bg-muted hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden whitespace-nowrap group-hover:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
