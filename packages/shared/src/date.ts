import { format, startOfMonth, endOfMonth } from "date-fns";

export function monthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function monthRange(date: Date): { from: Date; to: Date } {
  return {
    from: startOfMonth(date),
    to: endOfMonth(date)
  };
}
