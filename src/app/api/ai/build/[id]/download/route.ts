import archiver from "archiver";
import { PassThrough } from "stream";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { getWorkspacePaths } from "@/lib/ai/paths";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const build = await prisma.build.findUnique({ where: { id: params.id } });
  if (!build || build.userId !== user.id) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  const paths = getWorkspacePaths(build.id);
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  archive.directory(paths.repo, false);
  archive.finalize();
  archive.pipe(stream);

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=omega-build-${build.id}.zip`,
    },
  });
}
