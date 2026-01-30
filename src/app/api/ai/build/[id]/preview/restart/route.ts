import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { restartPreview } from "@/lib/ai/preview";
import { checkRateLimit } from "@/lib/ai/rateLimit";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const build = await prisma.build.findUnique({ where: { id } });
  if (!build || build.userId !== user.id) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  const rate = checkRateLimit(`preview:${user.id}`, 3, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Preview restart limit reached" }, { status: 429 });
  }

  const port = await restartPreview(build.id);
  return NextResponse.json({ ok: true, previewPort: port });
}
