import { spawn } from "child_process";
import fs from "fs/promises";
import net from "net";
import path from "path";
import { prisma } from "@/lib/db";
import { appendBuildLog } from "@/lib/ai/logs";
import { getWorkspacePaths } from "@/lib/ai/paths";

const previewProcesses = new Map<string, ReturnType<typeof spawn>>();
const previewPorts = new Map<string, number>();

export async function startPreview(buildId: string) {
  if (previewProcesses.has(buildId)) {
    return previewPorts.get(buildId) || null;
  }

  const paths = getWorkspacePaths(buildId);
  const repo = paths.repo;
  await appendBuildLog(buildId, "Starting preview server");

  await prisma.build.update({
    where: { id: buildId },
    data: { status: "preview_starting" },
  });

  try {
    const port = await findFreePort(3001, 3999);
    previewPorts.set(buildId, port);

    const nodeModulesPath = path.join(repo, "node_modules");
    const hasNodeModules = await fs
      .access(nodeModulesPath)
      .then(() => true)
      .catch(() => false);

    if (!hasNodeModules) {
      await appendBuildLog(buildId, "Installing dependencies (npm install)");
      await runCommand("npm", ["install", "--no-audit", "--no-fund"], repo, buildId);
    }

    await appendBuildLog(buildId, "Launching dev server");
    const child = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
      cwd: repo,
      env: { ...process.env, PORT: String(port), HOSTNAME: "127.0.0.1" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    previewProcesses.set(buildId, child);

    child.stdout?.on("data", (data) => appendBuildLog(buildId, data.toString()));
    child.stderr?.on("data", (data) => appendBuildLog(buildId, data.toString()));
    child.on("exit", () => {
      previewProcesses.delete(buildId);
    });

    const ready = await waitForPort(port, 30_000);
    if (ready) {
      await prisma.build.update({
        where: { id: buildId },
        data: { status: "ready", previewPort: port },
      });
      await appendBuildLog(buildId, `Preview ready on port ${port}`);
      return port;
    }

    await prisma.build.update({
      where: { id: buildId },
      data: { status: "preview_failed" },
    });
    await appendBuildLog(buildId, "Preview failed to start");
    return null;
  } catch (error: any) {
    await prisma.build.update({
      where: { id: buildId },
      data: { status: "preview_failed" },
    });
    await appendBuildLog(buildId, `Preview error: ${error?.message || "Unknown error"}`);
    return null;
  }
}

export async function restartPreview(buildId: string) {
  await stopPreview(buildId);
  return startPreview(buildId);
}

export async function stopPreview(buildId: string) {
  const proc = previewProcesses.get(buildId);
  if (proc) {
    proc.kill("SIGTERM");
    previewProcesses.delete(buildId);
  }
}

export function getPreviewPort(buildId: string) {
  return previewPorts.get(buildId) || null;
}

async function runCommand(cmd: string, args: string[], cwd: string, buildId: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout?.on("data", (data) => appendBuildLog(buildId, data.toString()));
    child.stderr?.on("data", (data) => appendBuildLog(buildId, data.toString()));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

async function findFreePort(min: number, max: number) {
  for (let i = 0; i < 20; i++) {
    const port = Math.floor(Math.random() * (max - min + 1)) + min;
    const available = await isPortAvailable(port);
    if (available) return port;
  }
  throw new Error("No free port available");
}

function isPortAvailable(port: number) {
  return new Promise<boolean>((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function waitForPort(port: number, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await isPortOpen(port);
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function isPortOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" });
    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
  });
}
