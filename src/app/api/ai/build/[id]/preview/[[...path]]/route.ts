import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, getUserFromToken } from "@/lib/auth/requireUser";
import { startPreview } from "@/lib/ai/preview";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { id: string; path?: string[] } }
) {
  let user = await getUserFromRequest(req);
  if (!user) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (token) {
      user = await getUserFromToken(token);
    }
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const build = await prisma.build.findUnique({ where: { id: params.id } });
  if (!build || build.userId !== user.id) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  let port = build.previewPort;
  if (!port) {
    port = await startPreview(build.id);
  }

  if (!port) {
    return NextResponse.json({ error: "Preview not available" }, { status: 503 });
  }

  const pathSuffix = params.path?.join("/") || "";
  const upstreamUrl = `http://127.0.0.1:${port}/${pathSuffix}`;

  const upstream = await fetch(upstreamUrl, {
    headers: {
      accept: req.headers.get("accept") || "*/*",
      "user-agent": req.headers.get("user-agent") || "OmegaAIBuilder",
    },
  });

  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
