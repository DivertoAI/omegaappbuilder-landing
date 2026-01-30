import type { BuildConfig } from "@/lib/ai/types";

export function computeBuildCredits(config: BuildConfig): number {
  const type = config.websiteType.toLowerCase();
  const isLanding = type.includes("landing") || type.includes("marketing");
  const isEcom = type.includes("ecommerce") || type.includes("e-commerce");
  const isDashboard = type.includes("dashboard") || type.includes("app");
  const hasDb = config.database !== "None";
  const hasAuth = config.auth !== "None";

  if (isLanding && !hasDb && !hasAuth) return 1;
  if (isEcom) return 2;
  if (isDashboard || hasDb || hasAuth) return 2;
  return 2;
}
