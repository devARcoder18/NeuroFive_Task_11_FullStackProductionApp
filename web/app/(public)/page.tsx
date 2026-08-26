import Link from "next/link";
import { ArrowRight, Sparkles, Target, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-coral text-coral-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-semibold">FocusFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> AI-assisted planning
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Turn a blurry goal into a
          <span className="text-coral"> sharp </span>
          list of tasks.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          FocusFlow organizes your goals into projects and tasks, and its AI Breakdown Assistant
          does the hard part of figuring out where to start.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/register">
            <Button size="md">
              Start for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="md">I already have an account</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-3">
        {[
          { icon: Target, title: "Goals → Tasks", body: "Describe a goal, get a focused breakdown you can act on immediately." },
          { icon: LayoutGrid, title: "Organized by project", body: "Every task lives inside a project, with status, priority and due dates." },
          { icon: Sparkles, title: "Built to stay out of the way", body: "A calm, minimal interface — dark mode included, no clutter." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-lg border border-border bg-surface-raised p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-coral/10 text-coral">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
