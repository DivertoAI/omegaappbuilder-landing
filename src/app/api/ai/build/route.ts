import crypto from "crypto";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { PLAN_CONFIG } from "@/lib/billing/plans";
import { computeBuildCredits } from "@/lib/billing/credits";
import { getWorkspacePaths } from "@/lib/ai/paths";
import { runBuildPipeline } from "@/lib/ai/buildEngine";
import type { BuildConfig } from "@/lib/ai/types";
import { logTelemetry } from "@/lib/ai/telemetry";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import { checkPromptSafety } from "@/lib/ai/guardrails";

export const runtime = "nodejs";

const BuildSchema = z.object({
  config: z.object({
    websiteType: z.string().min(1),
    rendering: z.string().min(1),
    frontendStack: z.string().min(1),
    backendStack: z.string().min(1),
    database: z.string().min(1),
    auth: z.string().min(1),
    styling: z.string().min(1),
    deployment: z.string().min(1),
    appName: z.string().min(2),
  }),
  prompt: z.string().min(10).max(4000),
});

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rate = checkRateLimit(`build:${user.id}`, 5, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many build requests" }, { status: 429 });
    }

    const body = (await req.json()) as unknown;
    const parsed = BuildSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid build payload" }, { status: 400 });
    }

    const config = parsed.data.config as BuildConfig;
    const prompt = parsed.data.prompt;

    const safety = checkPromptSafety(prompt);
    if (!safety.ok) {
      return NextResponse.json({ error: safety.reason }, { status: 400 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "active" },
      orderBy: { updatedAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription required" }, { status: 402 });
    }

    const plan = PLAN_CONFIG[subscription.planKey as keyof typeof PLAN_CONFIG];
    const buildCount = await prisma.build.count({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (buildCount >= plan.dailyBuildLimit) {
      return NextResponse.json({ error: "Daily build limit reached" }, { status: 429 });
    }

    const creditsNeeded = computeBuildCredits(config);
    if (subscription.creditsRemaining < creditsNeeded) {
      return NextResponse.json({ error: "Insufficient credits. Upgrade or top up." }, { status: 402 });
    }

    const buildId = crypto.randomUUID();
    const paths = getWorkspacePaths(buildId);

    await fs.mkdir(paths.root, { recursive: true });
    await fs.writeFile(
      paths.config,
      JSON.stringify({ config, prompt }, null, 2),
      "utf8"
    );

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { creditsRemaining: subscription.creditsRemaining - creditsNeeded },
    });
    await prisma.creditLedger.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        type: "DEDUCT",
        amount: -creditsNeeded,
        reason: "build_start",
        buildId,
      },
    });

    await prisma.build.create({
      data: {
        id: buildId,
        userId: user.id,
        status: "queued",
        configJson: JSON.stringify(config),
        workspacePath: paths.repo,
        creditsHeld: creditsNeeded,
      },
    });

    logTelemetry("build_started", { buildId, userId: user.id });
    setTimeout(() => {
      runBuildPipeline(buildId, config, prompt)
        .then(() => logTelemetry("build_succeeded", { buildId, userId: user.id }))
        .catch(() => logTelemetry("build_failed", { buildId, userId: user.id }));
    }, 50);

    return NextResponse.json({ buildId, creditsUsed: creditsNeeded });
  } catch (error) {
    console.error("Build error", error);
    return NextResponse.json({ error: "Build failed" }, { status: 500 });
  }
}
