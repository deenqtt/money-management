import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "@money/shared";
import { loadDashboardOverview } from "../../../lib/dashboard";
import { requireDashboardUser } from "../../../lib/auth";

function statusTone(status: "safe" | "warning" | "over") {
  if (status === "over") return "danger";
  if (status === "warning") return "warning";
  return "success";
}

export default async function OverviewPage() {
  const user = await requireDashboardUser();
  const overview = await loadDashboardOverview(user.id);

  return (
    <section className="grid gap-6">
      <Card className="border-white/15 bg-black/20">
        <CardHeader>
          <CardTitle>This month</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-slate-400">Budget</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(overview.budget)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Spent</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(overview.spent)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(overview.remaining)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <Badge tone={statusTone(overview.status)} className="mt-2">
              {overview.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/15 bg-black/20">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>{overview.transactionCount} transactions recorded this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${Math.min(overview.progress * 100, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {Math.round(overview.progress * 100)}% of the monthly budget used.
          </p>
        </CardContent>
      </Card>

      <Card className="border-white/15 bg-black/20">
        <CardHeader>
          <CardTitle>Latest transactions</CardTitle>
          <CardDescription>Synced from the same database used by Telegram input.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overview.transactions.length === 0 ? (
              <p className="text-sm text-slate-400">No transactions recorded yet.</p>
            ) : (
              overview.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-slate-400">{transaction.note ?? "No note"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                    <p className="text-sm text-slate-400">{transaction.occurredAt.toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
