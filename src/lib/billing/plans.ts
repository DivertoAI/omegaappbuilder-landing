export type PlanKey = "starter" | "pro" | "scale";

export const PLAN_CONFIG: Record<PlanKey, {
  key: PlanKey;
  name: string;
  priceLabel: string;
  creditsMonthly: number;
  dailyBuildLimit: number;
  razorpayPlanEnv: string;
}> = {
  starter: {
    key: "starter",
    name: "Starter",
    priceLabel: "$29/mo",
    creditsMonthly: 30,
    dailyBuildLimit: 10,
    razorpayPlanEnv: "RAZORPAY_PLAN_ID_STARTER",
  },
  pro: {
    key: "pro",
    name: "Pro",
    priceLabel: "$79/mo",
    creditsMonthly: 120,
    dailyBuildLimit: 25,
    razorpayPlanEnv: "RAZORPAY_PLAN_ID_PRO",
  },
  scale: {
    key: "scale",
    name: "Scale",
    priceLabel: "$199/mo",
    creditsMonthly: 400,
    dailyBuildLimit: 100,
    razorpayPlanEnv: "RAZORPAY_PLAN_ID_SCALE",
  },
};

export const TOPUP_PACKS = {
  "20": { credits: 20, amount: 1000 },
  "60": { credits: 60, amount: 2500 },
  "150": { credits: 150, amount: 5000 },
};

export const DEFAULT_CURRENCY = "USD";
