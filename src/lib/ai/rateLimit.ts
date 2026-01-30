const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = buckets.get(key) || [];
  const recent = timestamps.filter((ts) => ts > windowStart);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return { allowed: false, remaining: 0, resetAt: recent[0] + windowMs };
  }
  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true, remaining: limit - recent.length, resetAt: now + windowMs };
}
