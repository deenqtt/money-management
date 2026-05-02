import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "@money/shared";
import { loadDashboardTransactions } from "../../../lib/dashboard";
import { requireDashboardUser } from "../../../lib/auth";

export default async function TransactionsPage() {
  const user = await requireDashboardUser();
  const transactions = await loadDashboardTransactions(user.id, 100);

  return (
    <Card className="border-white/15 bg-black/20">
      <CardHeader>
        <CardTitle>Transaction history</CardTitle>
        <CardDescription>Recent expense entries captured from Telegram or the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-400">No transactions found.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="grid gap-2 rounded-xl border border-white/10 px-4 py-3 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <p className="text-sm text-slate-400">{transaction.note ?? "No note"}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                  <p className="text-sm text-slate-400">{transaction.source} · {transaction.occurredAt.toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
