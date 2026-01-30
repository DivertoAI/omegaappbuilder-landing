import fs from "fs/promises";
import path from "path";
import os from "os";
import { describe, expect, it } from "vitest";
import { ensureEnvFiles, validateRelativePath } from "@/lib/ai/workspace";
import { parseCodexBundle } from "@/lib/ai/parse";

describe("validateRelativePath", () => {
  it("accepts safe relative paths", () => {
    expect(validateRelativePath("src/index.ts")).toBe(true);
  });

  it("rejects absolute paths", () => {
    expect(validateRelativePath("/etc/passwd")).toBe(false);
  });

  it("rejects path traversal", () => {
    expect(validateRelativePath("../secret.txt")).toBe(false);
  });
});

describe("ensureEnvFiles", () => {
  it("creates .env and .env.example with dummy values", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "omega-env-"));
    const vars = await ensureEnvFiles(dir);
    const env = await fs.readFile(path.join(dir, ".env"), "utf8");
    const example = await fs.readFile(path.join(dir, ".env.example"), "utf8");
    expect(env).toContain("DUMMY_VALUE");
    expect(example).toContain("DUMMY_VALUE");
    expect(vars.length).toBeGreaterThan(0);
  });
});

describe("parseCodexBundle", () => {
  it("parses valid JSON bundle", () => {
    const raw = JSON.stringify({ files: [{ path: "README.md", content: "Hello" }] });
    const files = parseCodexBundle(raw);
    expect(files[0].path).toBe("README.md");
  });

  it("parses JSON bundle with extra text", () => {
    const raw = `some text\n${JSON.stringify({ files: [{ path: "a.txt", content: "x" }] })}\nend`;
    const files = parseCodexBundle(raw);
    expect(files[0].content).toBe("x");
  });
});
