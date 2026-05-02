"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    setLoading(false);
    if (!response.ok) {
      setError("Login failed");
      return;
    }

    router.push("/dashboard/overview");
    router.refresh();
  }

  return (
    <Card className="w-full border-white/15 bg-black/20">
      <CardHeader>
        <CardTitle>Private dashboard login</CardTitle>
        <CardDescription>Sign in to view this month spending and budget status.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
