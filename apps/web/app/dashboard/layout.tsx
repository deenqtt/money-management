import Link from "next/link";
import { requireDashboardUser } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import { logoutAction } from "./actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardUser();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Private dashboard</p>
          <h1 className="text-2xl font-semibold">Money management overview</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href="/dashboard/overview" className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700">
            Overview
          </Link>
          <Link href="/dashboard/transactions" className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700">
            Transactions
          </Link>
          <Link href="/dashboard/settings" className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700">
            Settings
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost">
              Logout
            </Button>
          </form>
        </nav>
      </header>
      {children}
    </main>
  );
}
