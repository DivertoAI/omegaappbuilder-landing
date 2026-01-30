import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export type FileBundle = { path: string; content: string }[];

export type FileNode = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: FileNode[];
};

export function validateRelativePath(filePath: string) {
  if (filePath.includes("..") || path.isAbsolute(filePath)) {
    return false;
  }
  return true;
}

export async function writeFileSafe(root: string, filePath: string, content: string) {
  if (!validateRelativePath(filePath)) {
    throw new Error(`Invalid path: ${filePath}`);
  }
  const fullPath = path.join(root, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf8");
}

export async function writeFileBundle(root: string, files: FileBundle) {
  for (const file of files) {
    await writeFileSafe(root, file.path, file.content);
  }
}

export function extractEnvVars(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=")[0])
    .filter(Boolean);
}

export async function ensureEnvFiles(root: string) {
  const envPath = path.join(root, ".env");
  const examplePath = path.join(root, ".env.example");

  const envExists = await fileExists(envPath);
  const exampleExists = await fileExists(examplePath);

  const baseVars = ["APP_NAME", "DATABASE_URL", "NEXT_PUBLIC_APP_NAME"];

  if (!exampleExists) {
    const exampleContent = baseVars.map((v) => `${v}=DUMMY_VALUE`).join("\n") + "\n";
    await fs.writeFile(examplePath, exampleContent, "utf8");
  }

  if (!envExists) {
    const envContent = baseVars.map((v) => `${v}=DUMMY_VALUE`).join("\n") + "\n";
    await fs.writeFile(envPath, envContent, "utf8");
  }

  const exampleContent = await fs.readFile(examplePath, "utf8");
  const envContent = await fs.readFile(envPath, "utf8");
  const exampleVars = new Set(extractEnvVars(exampleContent));
  const envVars = new Set(extractEnvVars(envContent));

  for (const v of envVars) exampleVars.add(v);

  const merged = Array.from(exampleVars).sort();
  const mergedContent = merged.map((v) => `${v}=DUMMY_VALUE`).join("\n") + "\n";
  await fs.writeFile(examplePath, mergedContent, "utf8");
  await fs.writeFile(envPath, mergedContent, "utf8");

  return merged;
}

export async function listFiles(root: string, base = ""): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath, relPath)));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

export async function buildManifest(workspaceRoot: string, repoRoot: string) {
  const files = await listFiles(repoRoot);
  const manifest = [];
  for (const filePath of files) {
    const content = await fs.readFile(path.join(repoRoot, filePath), "utf8");
    manifest.push({
      path: filePath,
      hash: hashContent(content),
    });
  }
  await fs.writeFile(
    path.join(workspaceRoot, "build-manifest.json"),
    JSON.stringify({ files: manifest }, null, 2),
    "utf8"
  );
  return manifest;
}

export function buildFileTree(filePaths: string[]): FileNode[] {
  const root: FileNode[] = [];

  for (const filePath of filePaths) {
    const parts = filePath.split("/").filter(Boolean);
    let current = root;
    let currentPath = "";
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let node = current.find((n) => n.name === part);
      if (!node) {
        node = {
          name: part,
          path: currentPath,
          type: index === parts.length - 1 ? "file" : "dir",
          children: index === parts.length - 1 ? undefined : [],
        };
        current.push(node);
      }
      if (node.type === "dir" && node.children) {
        current = node.children;
      }
    });
  }

  return root;
}

export function hashContent(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
