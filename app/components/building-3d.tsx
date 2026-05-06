"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/cn";

function DataLabel({ x, y, text, delay = 0, accent = false }: { x: number; y: number; text: string; delay?: number; accent?: boolean }) {
  return (
    <div
      className={cn(
        "absolute whitespace-nowrap rounded-lg border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] backdrop-blur-md",
        accent ? "border-[var(--accent)] text-[var(--accent-2)] shadow-[0_0_18px_var(--accent-glow)]" : "border-white/10 text-[var(--fg-2)]"
      )}
      style={{
        left: x,
        top: y,
        animation: `omega-float 4s ease-in-out ${delay}s infinite`,
      }}
    >
      <span className={cn("mr-2 inline-block size-1.5 rounded-full", accent ? "bg-[var(--accent)]" : "bg-[var(--good)]")} />
      {text}
    </div>
  );
}

export function Building3D() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState({ x: -18, y: 35 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const tick = () => {
      if (!cancelled && !dragging.current) {
        setRotation((current) => ({ x: current.x, y: current.y + 0.15 }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  const floors = 14;
  const w = 200;
  const d = 200;
  const floorHeight = 28;
  const totalHeight = floors * floorHeight;
  const sides = [
    { rot: "rotateY(0deg)", tx: 0, tz: d / 2, width: w },
    { rot: "rotateY(90deg)", tx: w / 2, tz: 0, width: d },
    { rot: "rotateY(180deg)", tx: 0, tz: -d / 2, width: w },
    { rot: "rotateY(-90deg)", tx: -w / 2, tz: 0, width: d },
  ];

  return (
    <div
      ref={ref}
      className="relative h-full w-full select-none"
      style={{ perspective: 1400, cursor: dragging.current ? "grabbing" : "grab" }}
      onMouseDown={(event) => {
        dragging.current = true;
        last.current = { x: event.clientX, y: event.clientY };
      }}
      onMouseMove={(event) => {
        if (!dragging.current) return;
        const dx = event.clientX - last.current.x;
        const dy = event.clientY - last.current.y;
        last.current = { x: event.clientX, y: event.clientY };
        setRotation((current) => ({ x: Math.max(-60, Math.min(20, current.x - dy * 0.4)), y: current.y + dx * 0.4 }));
      }}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div
          className="absolute"
          style={{
            width: 600,
            height: 600,
            left: -300,
            top: totalHeight / 2,
            transform: "rotateX(90deg)",
            background: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0/40px 40px,
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0/40px 40px,
              radial-gradient(circle at center, rgba(140,90,255,0.18), transparent 50%)
            `,
          }}
        />
        {sides.map((side, sideIndex) => (
          <div
            key={side.rot}
            className="absolute overflow-hidden rounded-sm border border-white/10"
            style={{
              width: side.width,
              height: totalHeight,
              left: -side.width / 2,
              top: -totalHeight / 2,
              transform: `translate3d(${side.tx}px, 0, ${side.tz}px) ${side.rot}`,
              background: "linear-gradient(180deg, #18181d 0%, #0e0e12 100%)",
            }}
          >
            {Array.from({ length: floors }).map((_, floorIndex) => (
              <div
                key={floorIndex}
                className="absolute left-1.5 right-1.5"
                style={{ top: floorIndex * floorHeight + 6, height: floorHeight - 12 }}
              >
                <div className="grid h-full gap-1" style={{ gridTemplateColumns: `repeat(${Math.floor(side.width / 22)}, 1fr)` }}>
                  {Array.from({ length: Math.floor(side.width / 22) }).map((_, windowIndex) => {
                    const lit = (floorIndex * 7 + windowIndex * 13 + sideIndex * 5) % 9 < 4;
                    const purple = (floorIndex * 3 + windowIndex * 11 + sideIndex) % 17 === 0;
                    return (
                      <div
                        key={windowIndex}
                        className="rounded-[1px]"
                        style={{
                          background: lit ? (purple ? "oklch(0.78 0.18 290)" : "oklch(0.92 0.05 80)") : "rgba(20,20,28,0.9)",
                          opacity: lit ? (purple ? 0.95 : 0.7) : 0.6,
                          boxShadow: lit ? `0 0 6px ${purple ? "oklch(0.7 0.22 290 / 0.9)" : "oklch(0.9 0.05 80 / 0.5)"}` : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {Array.from({ length: floors + 1 }).map((_, lineIndex) => (
              <div
                key={lineIndex}
                className="absolute left-0 right-0 h-px bg-white/5"
                style={{ top: lineIndex * floorHeight - 1 }}
              />
            ))}
          </div>
        ))}
        <div
          className="absolute border border-white/10"
          style={{
            width: w,
            height: d,
            left: -w / 2,
            top: -totalHeight / 2,
            transform: `translateY(0) rotateX(90deg) translateZ(${totalHeight / 2}px)`,
            background: "linear-gradient(135deg, #1a1a22, #0a0a0e)",
          }}
        >
          <div className="absolute left-[30px] top-[30px] h-[40px] w-[60px] border border-white/10 bg-[#0a0a0e]" />
          <div className="absolute right-[30px] top-[50px] h-[30px] w-[30px] border border-white/10 bg-[#0a0a0e]" />
          <div className="absolute bottom-[28px] left-[60px] h-[12px] w-[80px] bg-[var(--accent)] shadow-[0_0_14px_var(--accent-glow)]" />
        </div>
        <DataLabel x={140} y={-totalHeight / 2 + 40} text="Unit 1402 · listed" />
        <DataLabel x={-180} y={-totalHeight / 2 + 140} text="$2.4M · 3BR/3BA" delay={0.4} />
        <DataLabel x={150} y={20} text="42 leads this week" delay={0.8} />
        <DataLabel x={-160} y={140} text="scan complete" delay={1.2} accent />
      </div>
    </div>
  );
}
