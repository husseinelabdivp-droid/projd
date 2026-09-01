"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-950 px-6 text-ink-100">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg">ClipForge AI</Link>
        <h1 className="mt-8 font-display text-2xl">Log in</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-ink-500" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-base-600 bg-base-900 px-3 py-2 text-sm outline-none focus:border-bronze-500"
            />
          </div>
          <div>
            <label className="text-sm text-ink-500" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-base-600 bg-base-900 px-3 py-2 text-sm outline-none focus:border-bronze-500"
            />
          </div>

          {error && <p className="text-sm text-signal-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-bronze-500 px-4 py-2 text-sm font-medium text-base-950 hover:bg-bronze-400 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs text-ink-700">
          <div className="h-px flex-1 bg-base-700" />
          or
          <div className="h-px flex-1 bg-base-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-md border border-base-600 px-4 py-2 text-sm hover:border-ink-500"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-ink-500">
          <Link href="/forgot-password" className="hover:text-ink-100">Forgot password?</Link>
        </p>
        <p className="mt-2 text-sm text-ink-500">
          No account?{" "}
          <Link href="/signup" className="text-bronze-400 hover:text-bronze-300">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
