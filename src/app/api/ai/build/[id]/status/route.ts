import fs from "fs/promises";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { getWorkspacePaths } from "@/lib/ai/paths";
import { readLogTail } from "@/lib/ai/logs";
import { buildFileTree, listFiles } from "@/lib/ai/workspace";

export const runtime = "nodejs";

async function readJson(filePath: string) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

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
  const logs = await readLogTail(paths.log);
  const manifest = await readJson(paths.manifest);
  let fileList: string[] = [];
  if (Array.isArray(manifest?.files)) {
    fileList = manifest.files
      .map((file: { path?: string }) => file.path)
      .filter((filePath: string | undefined): filePath is string => Boolean(filePath));
  } else {
    try {
      fileList = await listFiles(paths.repo);
    } catch {
      fileList = [];
    }
  }
  const tree = buildFileTree(fileList);

  let readme = "";
  try {
    readme = await fs.readFile(path.join(paths.repo, "README.md"), "utf8");
  } catch {
    readme = "";
  }

  let envVars: string[] = [];
  try {
    const envExample = await fs.readFile(path.join(paths.repo, ".env.example"), "utf8");
    envVars = envExample
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=")[0]);
  } catch {
    envVars = [];
  }

  return NextResponse.json({
    id: build.id,
    status: build.status,
    logs,
    files: fileList,
    tree,
    readme,
    envVars,
    previewPort: build.previewPort,
  });
}
