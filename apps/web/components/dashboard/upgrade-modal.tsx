"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS, PlanId, CreditPackId } from "@/lib/plans";

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function startCheckout(type: "subscription" | "credits", id: PlanId | CreditPackId) {
    setLoading(id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong starting checkout.");
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-base-700 bg-base-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink-100">Upgrade your plan</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-100">
            <X size={20} />
          </button>
        </div>

        <h3 className="mb-3 text-sm font-medium uppercase text-ink-700">Subscriptions</h3>
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
            <div key={id} className="rounded-lg border border-base-700 p-4">
              <p className="font-medium text-ink-100">{plan.name}</p>
              <p className="mt-1 text-2xl font-bold text-ink-100">
                ${plan.price}
                <span className="text-sm font-normal text-ink-500">/mo</span>
              </p>
              <button
                onClick={() => startCheckout("subscription", id as PlanId)}
                disabled={loading === id}
                className="mt-3 w-full rounded-md bg-purple-600 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
              >
                {loading === id ? "Loading..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <h3 className="mb-3 text-sm font-medium uppercase text-ink-700">Credit top-ups</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(CREDIT_PACKS).map(([id, pack]) => (
            <div key={id} className="rounded-lg border border-base-700 p-3 text-center">
              <p className="text-sm font-medium text-ink-100">{pack.name}</p>
              <p className="mt-1 text-lg font-bold text-ink-100">${pack.price}</p>
              <p className="mt-0.5 text-xs text-ink-500">{pack.credits} credits</p>
              <button
                onClick={() => startCheckout("credits", id as CreditPackId)}
                disabled={loading === id}
                className="mt-2 w-full rounded-md border border-purple-500 py-1.5 text-xs text-ink-100 transition hover:bg-purple-600 disabled:opacity-50"
              >
                {loading === id ? "..." : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
