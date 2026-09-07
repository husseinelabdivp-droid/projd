import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { findPlanByPriceId, findCreditPackByPriceId, CREDIT_PACKS } from "@/lib/plans";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body — required for signature verification
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id ?? session.client_reference_id;
      if (!userId) break;

      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId ? findPlanByPriceId(priceId) : null;

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            plan: plan ?? "unknown",
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          },
          { onConflict: "user_id" }
        );
      }

      if (session.mode === "payment") {
        const priceId = session.metadata?.plan_or_pack_id
          ? CREDIT_PACKS[session.metadata.plan_or_pack_id as keyof typeof CREDIT_PACKS]?.priceId
          : null;
        const pack = priceId ? findCreditPackByPriceId(priceId) : null;
        if (pack) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("credits")
            .eq("id", userId)
            .single();
          const currentCredits = profile?.credits ?? 0;
          await supabaseAdmin
            .from("profiles")
            .update({ credits: currentCredits + CREDIT_PACKS[pack].credits })
            .eq("id", userId);
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
