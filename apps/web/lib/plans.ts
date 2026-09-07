export type PlanId = "pro" | "agency";
export type CreditPackId = "spark" | "boost" | "power" | "mega";

export const SUBSCRIPTION_PLANS: Record<PlanId, { name: string; priceId: string; price: number }> = {
  pro: { name: "Pro Plan", priceId: "price_1UD6I5K53MuNowNXArWIu6Kg", price: 12 },
  agency: { name: "Agency Plan", priceId: "price_1UD6K5K53MuNowNX8gCT9ShR", price: 39 },
};

export const CREDIT_PACKS: Record<CreditPackId, { name: string; priceId: string; price: number; credits: number }> = {
  spark: { name: "Spark", priceId: "price_1UD6LAK53MuNowNXPuGDy1gN", price: 1, credits: 10 },
  boost: { name: "Boost", priceId: "price_1UD6LLK53MuNowNX1aSyjIUR", price: 5, credits: 60 },
  power: { name: "Power", priceId: "price_1UD6LWK53MuNowNXzP8eZiu1", price: 15, credits: 200 },
  mega: { name: "Mega", priceId: "price_1UD6M2K53MuNowNX1OwxjFRb", price: 40, credits: 600 },
};

export function findPlanByPriceId(priceId: string): PlanId | null {
  return (Object.keys(SUBSCRIPTION_PLANS) as PlanId[]).find((k) => SUBSCRIPTION_PLANS[k].priceId === priceId) ?? null;
}

export function findCreditPackByPriceId(priceId: string): CreditPackId | null {
  return (Object.keys(CREDIT_PACKS) as CreditPackId[]).find((k) => CREDIT_PACKS[k].priceId === priceId) ?? null;
}
