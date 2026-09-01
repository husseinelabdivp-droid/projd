import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    features: ["5 Shorts / month", "Watermark", "Standard processing", "720p export"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€19",
    period: "/month",
    features: [
      "100 Shorts / month",
      "No watermark",
      "1080p export",
      "Priority processing",
      "Premium captions",
      "AI hooks",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "€49",
    period: "/month",
    features: [
      "500 Shorts / month",
      "Multiple projects",
      "Priority processing",
      "Advanced features",
      "Team features (soon)",
    ],
    cta: "Go Agency",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-base-950 px-6 py-20 text-ink-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl">Pricing</h1>
        <p className="mt-3 max-w-md text-ink-500">
          Prices are introductory and may change as the product matures.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 ${
                plan.highlighted
                  ? "border-bronze-500 bg-base-900"
                  : "border-base-600 bg-base-900/60"
              }`}
            >
              <h2 className="font-display text-xl">{plan.name}</h2>
              <p className="mt-4">
                <span className="font-display text-4xl">{plan.price}</span>
                <span className="text-ink-500">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink-300">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block rounded-md px-4 py-2 text-center text-sm font-medium ${
                  plan.highlighted
                    ? "bg-bronze-500 text-base-950 hover:bg-bronze-400"
                    : "border border-base-600 hover:border-ink-500"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
