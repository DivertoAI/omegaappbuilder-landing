export function logTelemetry(event: "build_started" | "build_succeeded" | "build_failed", payload: Record<string, unknown>) {
  console.log(`[telemetry] ${event}`, payload);
}
