"use client";

import { useState } from "react";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS, PlanId, CreditPackId } from "@/lib/plans";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function startCheckout(type: "subscription" | "credits", id: PlanId | CreditPackId) {
    setLoading(id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (res.status === 401) {
        window.location.href = "/login?redirect=/pricing";
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong starting checkout.");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Plans & Pricing</h1>
      <p className="text-center text-gray-400 mb-12">Pick a plan, or top up with credits any time.</p>

      {/* Subscription tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Free tier */}
        <div className="rounded-2xl border border-gray-700 p-8 flex flex-col">
          <h2 className="text-xl font-semibold mb-1">Free</h2>
          <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-400">/mo</span></p>
          <p className="text-gray-400 mb-6 flex-1">Get started and try out the basics.</p>
          <button
            disabled
            className="rounded-lg border border-gray-600 py-2 text-gray-400 cursor-default"
          >
            Your current plan
          </button>
        </div>

        {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
          <div key={id} className="rounded-2xl border border-purple-500 p-8 flex flex-col">
            <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
            <p className="text-3xl font-bold mb-4">
              ${plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
            </p>
            <p className="text-gray-400 mb-6 flex-1">Everything you need to grow.</p>
            <button
              onClick={() => startCheckout("subscription", id as PlanId)}
              disabled={loading === id}
              className="rounded-lg bg-purple-600 hover:bg-purple-700 py-2 font-medium transition disabled:opacity-50"
            >
              {loading === id ? "Loading..." : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Credit top-ups */}
      <h2 className="text-2xl font-bold text-center mb-8">Need more credits?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(CREDIT_PACKS).map(([id, pack]) => (
          <div key={id} className="rounded-xl border border-gray-700 p-6 text-center flex flex-col">
            <h3 className="font-semibold mb-1">{pack.name}</h3>
            <p className="text-2xl font-bold mb-1">${pack.price}</p>
            <p className="text-sm text-gray-400 mb-4 flex-1">{pack.credits} credits</p>
            <button
              onClick={() => startCheckout("credits", id as CreditPackId)}
              disabled={loading === id}
              className="rounded-lg border border-purple-500 hover:bg-purple-600 py-2 text-sm transition disabled:opacity-50"
            >
              {loading === id ? "Loading..." : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
