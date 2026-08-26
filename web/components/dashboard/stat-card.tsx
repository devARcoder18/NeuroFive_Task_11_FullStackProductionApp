import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "coral" | "moss";
}) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
      </div>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          tone === "coral" && "bg-coral/10 text-coral",
          tone === "moss" && "bg-moss/10 text-moss",
          tone === "default" && "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
    </Card>
  );
}
