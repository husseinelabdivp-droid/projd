import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS, PlanId, CreditPackId } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const { type, id } = (await req.json()) as
    | { type: "subscription"; id: PlanId }
    | { type: "credits"; id: CreditPackId };

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  let priceId: string;
  let mode: "subscription" | "payment";

  if (type === "subscription") {
    const plan = SUBSCRIPTION_PLANS[id];
    if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    priceId = plan.priceId;
    mode = "subscription";
  } else {
    const pack = CREDIT_PACKS[id];
    if (!pack) return NextResponse.json({ error: "Unknown credit pack" }, { status: 400 });
    priceId = pack.priceId;
    mode = "payment";
  }

  // Reuse existing Stripe customer if we have one on file.
  const { data: existingSub } = await supabaseAdminLookup(user.id);

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    customer: existingSub?.stripe_customer_id ?? undefined,
    customer_email: existingSub?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    metadata: { user_id: user.id, type, plan_or_pack_id: id },
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}

// Lightweight lookup so returning customers reuse their Stripe customer id
// instead of Stripe creating a duplicate customer every checkout.
async function supabaseAdminLookup(userId: string) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  return supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
}
