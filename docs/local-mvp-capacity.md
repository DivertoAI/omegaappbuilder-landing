# Local MVP Capacity Notes (M2 MacBook Air)

These are pragmatic guidelines for running the Omega AI Builder MVP on a single M2 MacBook Air (fanless) with the local agent + Codex CLI.

## Safe Defaults (Recommended)
- **Max concurrent builds:** 1
- **Queue size:** 5–10
- **Per-user build limit:** 1 at a time
- **Build timeout:** 10–15 minutes

## Expected Capacity (Realistic)
- **Active builds:** 1–3 concurrent (stable), 4–6 max before throttling
- **Interactive users (chat + preview + file tree):** ~20–60 if only a few are building
- **Read-only viewers:** ~50–150

## Throughput Estimates (Rough)
- **Small builds:** ~6–12 builds/hour
- **Medium builds:** ~3–6 builds/hour
- **Large builds:** ~1–3 builds/hour

## Why These Limits
- Codex builds are CPU + disk heavy.
- Fanless M2 throttles under sustained load.
- API + network latency becomes the bottleneck beyond 1–3 active builds.

## MVP Plan for 1–5 Users
- Run **single-build** mode with a visible queue.
- Keep the system responsive and professional.
- Scale to hosted infra once demand exceeds the queue.
