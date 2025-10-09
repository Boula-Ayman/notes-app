"use client";

import { useEffect, useRef } from "react";

type Notes3DBackgroundProps = {
  className?: string;
};

// Lightweight 3D-ish animated notes background using CSS transforms and a tiny JS parallax.
export function Notes3DBackground({ className }: Notes3DBackgroundProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * 6; // rotateX
      const ry = -((e.clientX - rect.left) / rect.width - 0.5) * 6; // rotateY
      el.style.setProperty("--rotateX", `${rx}deg`);
      el.style.setProperty("--rotateY", `${ry}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className={
        (className ? className + " " : "") +
        "fixed inset-0 z-0 overflow-hidden pointer-events-none"
      }
      style={{ perspective: 1000 as any }}
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 w-[1600px] h-[1200px] -translate-x-1/2 -translate-y-1/2 transform-gpu"
        style={{
          transform:
            "rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) scale(1.02)",
          transition: "transform 200ms ease-out",
        }}
      >
        {/* Layered note cards */}
        <div className="relative w-full h-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const x = (i % 8) * 200 + (i % 2 === 0 ? 20 : -20);
            const y = Math.floor(i / 8) * 240 + (i % 3 === 0 ? 10 : -10);
            const r = ((i * 7) % 12) - 6;
            const color = i % 5;
            const bg = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#FBCFE8", "#FCA5A5"][
              color
            ];
            return (
              <div
                key={i}
                className="absolute w-[160px] h-[110px] rounded-md shadow-md"
                style={{
                  left: x,
                  top: y,
                  backgroundColor: bg,
                  transform: `translateZ(${
                    (i % 4) * 20 - 20
                  }px) rotate(${r}deg)`,
                  opacity: 0.46,
                }}
              >
                <div className="absolute inset-x-3 top-4 h-2 rounded bg-black/10" />
                <div className="absolute inset-x-3 top-8 h-2 rounded bg-black/10" />
                <div className="absolute inset-x-3 top-12 h-2 rounded bg-black/10 w-2/3" />
              </div>
            );
          })}
        </div>
      </div>
      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </div>
  );
}
