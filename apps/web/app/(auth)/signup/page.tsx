"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-950 px-6 text-ink-100">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-2xl">Check your email</h1>
          <p className="mt-3 text-sm text-ink-500">
            We sent a confirmation link to {email}. Follow it to activate your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-950 px-6 text-ink-100">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg">ClipForge AI</Link>
        <h1 className="mt-8 font-display text-2xl">Create your account</h1>
        <p className="mt-2 text-sm text-ink-500">5 free Shorts a month, no card required.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-ink-500" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-base-600 bg-base-900 px-3 py-2 text-sm outline-none focus:border-bronze-500"
            />
          </div>
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
              minLength={8}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs text-ink-700">
          <div className="h-px flex-1 bg-base-700" />
          or
          <div className="h-px flex-1 bg-base-700" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="mt-4 w-full rounded-md border border-base-600 px-4 py-2 text-sm hover:border-ink-500"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="text-bronze-400 hover:text-bronze-300">Log in</Link>
        </p>
      </div>
    </main>
  );
}
