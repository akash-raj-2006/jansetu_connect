import { Link } from "@tanstack/react-router";
import { BarChart3, FileSearch, Home, Mic } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { AmbientBackdrop } from "@/components/jansetu/AmbientBackdrop";
import { ThemeToggle } from "@/components/jansetu/ThemeToggle";
import { Logo } from "@/components/jansetu/Logo";

const NAV = [
  { to: "/", label: "Overview", icon: Home, code: "00", tint: "var(--nav-overview)" },
  { to: "/report", label: "File a report", icon: Mic, code: "01", tint: "var(--nav-report)" },
  { to: "/track", label: "Track a case", icon: FileSearch, code: "02", tint: "var(--nav-track)" },
  { to: "/dashboard", label: "Policy data", icon: BarChart3, code: "03", tint: "var(--nav-data)" },
] as const;


/**
 * Dashboard-style shell: fixed ruled sidebar on the left, document content on the right.
 */
export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent lg:flex">
      <AmbientBackdrop />
      <aside className="border-b border-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block">
          <Link to="/" className="block">
            <Logo className="h-10" />
            <span className="label-mono mt-1 block">जनसेतु / civic data desk</span>
          </Link>

          <ThemeToggle className="hidden lg:mt-5 lg:inline-flex" />

          <nav className="flex gap-1.5 overflow-x-auto lg:mt-5 lg:flex-col lg:gap-1.5 lg:overflow-visible">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                style={{ "--tint": item.tint } as CSSProperties}
                className="group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-lg border border-transparent px-3 py-2.5 text-sm whitespace-nowrap text-muted-foreground transition-all hover:border-[color-mix(in_oklab,var(--tint)_35%,transparent)] hover:bg-[color-mix(in_oklab,var(--tint)_10%,transparent)] hover:text-[var(--tint)]"
                activeProps={{
                  className:
                    "border-[color-mix(in_oklab,var(--tint)_45%,transparent)] bg-[color-mix(in_oklab,var(--tint)_14%,transparent)] text-[var(--tint)] font-semibold shadow-[inset_3px_0_0_0_var(--tint)]",
                }}
              >
                <span
                  className="flex size-6 items-center justify-center rounded-md text-[var(--tint)]"
                  style={{ background: "color-mix(in oklab, var(--tint) 16%, transparent)" }}
                >
                  <item.icon className="size-3.5" strokeWidth={2} />
                </span>
                <span className="hidden lg:inline font-mono text-[10px] opacity-60">{item.code}</span>
                {item.label}
              </Link>
            ))}
          </nav>

        </div>

        <div className="hidden border-t border-border px-5 py-4 lg:block">
          <p className="label-mono">Method</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Priority = (volume × urgency weight) + (residents affected ÷ infra score)
          </p>
          <Link to="/admin/login" className="mt-3 inline-block text-xs font-medium text-accent hover:underline">
            Official sign-in →
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-border-strong bg-background/95 px-5 py-5 backdrop-blur sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle className="lg:hidden" />
              {actions}
            </div>
          </div>
        </header>
        <main className="px-5 py-6 sm:px-8">{children}</main>
        <footer className="border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8">
          JanSetu · a digital public good prototype for citizen-to-policy infrastructure feedback.
        </footer>
      </div>
    </div>
  );
}
