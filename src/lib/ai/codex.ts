import OpenAI from "openai";

export async function callCodex(prompt: string) {
  const apiKey = process.env.CODEX_API_KEY;
  const model = process.env.CODEX_MODEL || "gpt-5";
  if (!apiKey) {
    throw new Error("Missing CODEX_API_KEY");
  }
  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model,
    input: prompt,
    max_output_tokens: 4000,
  });
  return response.output_text || "";
}
