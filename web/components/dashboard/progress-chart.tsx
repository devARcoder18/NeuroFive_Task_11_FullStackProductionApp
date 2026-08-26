"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function ProgressChart({ completed, remaining }: { completed: number; remaining: number }) {
  const total = completed + remaining;
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining || (total === 0 ? 1 : 0) },
  ];
  const colors = ["hsl(var(--moss))", "hsl(var(--border))"];

  return (
    <div className="relative h-40 w-40">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={52} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [value, name]}
            contentStyle={{ background: "hsl(var(--surface-raised))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold text-ink">{total ? Math.round((completed / total) * 100) : 0}%</span>
        <span className="text-xs text-muted-foreground">done</span>
      </div>
    </div>
  );
}
