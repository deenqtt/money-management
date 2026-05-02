import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Money Management MVP</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Track spending from Telegram, review monthly budget pressure in one dashboard.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Manual expenses go into PostgreSQL through a shared service layer. Telegram is the input channel; the dashboard is the monitor.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Open dashboard
            </Link>
            <a
              href="#architecture"
              className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700"
            >
              See architecture
            </a>
          </div>
        </div>
        <Card className="border-white/15 bg-black/20">
          <CardHeader>
            <CardTitle>Bootstrap scope</CardTitle>
            <CardDescription>Expense only, monthly budget, shared logic between bot and web.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Telegram flow</p>
              <p className="text-lg font-medium">"/expense 15000 food lunch"</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Dashboard view</p>
              <p className="text-lg font-medium">Budget remaining and recent transactions</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section id="architecture" className="mt-16 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm text-emerald-300">Shared domain</p>
            <p className="mt-2 text-slate-200">Parsing, validation, and monthly summary logic live in one package.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-emerald-300">Single source of truth</p>
            <p className="mt-2 text-slate-200">Prisma maps users, budgets, Telegram accounts, and transactions in PostgreSQL.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-emerald-300">Private dashboard</p>
            <p className="mt-2 text-slate-200">Cookie-backed login keeps the monitoring UI locked down.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
