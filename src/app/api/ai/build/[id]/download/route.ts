import archiver from "archiver";
import { PassThrough, Readable } from "stream";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { getWorkspacePaths } from "@/lib/ai/paths";

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

  const paths = getWorkspacePaths(build.id);
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  archive.directory(paths.repo, false);
  archive.finalize();
  archive.pipe(stream);

  const body = Readable.toWeb(stream) as ReadableStream<Uint8Array>;
  return new Response(body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=omega-build-${build.id}.zip`,
    },
  });
}
