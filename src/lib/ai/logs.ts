import fs from "fs/promises";
import path from "path";
import { getWorkspacePaths } from "@/lib/ai/paths";

export async function appendBuildLog(buildId: string, message: string) {
  const { log } = getWorkspacePaths(buildId);
  const line = `[${new Date().toISOString()}] ${message}\n`;
  await fs.mkdir(path.dirname(log), { recursive: true });
  await fs.appendFile(log, line, "utf8");
}

export async function readLogTail(logPath: string, maxBytes = 60_000) {
  try {
    const stats = await fs.stat(logPath);
    const size = stats.size;
    const start = Math.max(0, size - maxBytes);
    const fh = await fs.open(logPath, "r");
    const buffer = Buffer.alloc(size - start);
    await fh.read(buffer, 0, buffer.length, start);
    await fh.close();
    return buffer.toString("utf8");
  } catch {
    return "";
  }
}
