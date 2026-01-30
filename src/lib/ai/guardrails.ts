const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
  /api[_-]?key\s*[:=]\s*[A-Za-z0-9-_]{16,}/i,
  /secret\s*[:=]\s*[A-Za-z0-9-_]{16,}/i,
  /password\s*[:=]\s*\S{8,}/i,
];

export function checkPromptSafety(prompt: string) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(prompt)) {
      return { ok: false, reason: "Prompt appears to include secrets. Remove sensitive data." };
    }
  }
  return { ok: true };
}
