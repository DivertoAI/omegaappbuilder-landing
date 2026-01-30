import { z } from "zod";
import type { FileBundle } from "@/lib/ai/workspace";

const BundleSchema = z.object({
  files: z.array(
    z.object({
      path: z.string().min(1),
      content: z.string(),
    })
  ),
});

export function parseCodexBundle(raw: string): FileBundle {
  const jsonText = raw.trim();
  try {
    return BundleSchema.parse(JSON.parse(jsonText)).files;
  } catch {
    const start = jsonText.indexOf("{");
    const end = jsonText.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const slice = jsonText.slice(start, end + 1);
      return BundleSchema.parse(JSON.parse(slice)).files;
    }
    throw new Error("Invalid Codex output");
  }
}
