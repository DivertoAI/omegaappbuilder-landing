import path from "path";

export const WORKSPACE_ROOT = process.env.AI_BUILDER_ROOT || "/tmp/omega-builds";

export function getWorkspacePaths(buildId: string) {
  const root = path.join(WORKSPACE_ROOT, buildId);
  return {
    root,
    repo: path.join(root, "repo"),
    log: path.join(root, "build.log"),
    previewLog: path.join(root, "preview.log"),
    manifest: path.join(root, "build-manifest.json"),
    config: path.join(root, "build-config.json"),
  };
}
