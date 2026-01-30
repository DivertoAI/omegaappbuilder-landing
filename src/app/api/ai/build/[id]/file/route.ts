import fs from "fs/promises";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { getWorkspacePaths } from "@/lib/ai/paths";
import { validateRelativePath } from "@/lib/ai/workspace";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const build = await prisma.build.findUnique({ where: { id } });
  if (!build || build.userId !== user.id) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const filePath = url.searchParams.get("path");
  if (!filePath || !validateRelativePath(filePath)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const paths = getWorkspacePaths(build.id);
  const fullPath = path.join(paths.repo, filePath);
  try {
    const content = await fs.readFile(fullPath, "utf8");
    return NextResponse.json({ path: filePath, content });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
