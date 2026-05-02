import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { requireDashboardUser } from "../../../lib/auth";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { updateBudgetAction } from "../actions";

export default async function SettingsPage() {
  await requireDashboardUser();

  return (
    <Card className="border-white/15 bg-black/20">
      <CardHeader>
        <CardTitle>Budget settings</CardTitle>
        <CardDescription>Set the monthly target used by both Telegram and the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex max-w-md gap-3" action={updateBudgetAction}>
          <Input name="amount" type="number" min="0" step="1000" placeholder="1000000" />
          <Button type="submit">Save</Button>
        </form>
        <p className="mt-3 text-sm text-slate-400">This writes the monthly target using the same repository as Telegram input.</p>
      </CardContent>
    </Card>
  );
}
