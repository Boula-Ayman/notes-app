"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EyeTrackerMascotProps = {
  className?: string;
  size?: number; // overall scale
};

// Simple SVG mascot with two eyes that track the cursor.
export function EyeTrackerMascot({
  className,
  size = 140,
}: EyeTrackerMascotProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const { leftPupil, rightPupil } = useMemo(() => {
    // Eye centers in local SVG coordinates
    const leftCenter = { x: 50, y: 60 };
    const rightCenter = { x: 110, y: 60 };
    const maxOffset = 10; // pupil travel radius within eye

    function compute(
      target: { x: number; y: number },
      center: { x: number; y: number }
    ) {
      // Map global mouse to element space
      const el = ref.current;
      if (!el) return center;
      const rect = el.getBoundingClientRect();
      const local = { x: target.x - rect.left, y: target.y - rect.top };

      // Convert local to svg coordinate scale (viewBox 0..160 x 0..120)
      const scaleX = 160 / rect.width;
      const scaleY = 120 / rect.height;
      const svgPt = { x: local.x * scaleX, y: local.y * scaleY };

      // Direction vector from eye center to mouse
      const dx = svgPt.x - center.x;
      const dy = svgPt.y - center.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      return { x: center.x + ux * maxOffset, y: center.y + uy * maxOffset };
    }

    return {
      leftPupil: compute(mouse, leftCenter),
      rightPupil: compute(mouse, rightCenter),
    };
  }, [mouse]);

  return (
    <div
      ref={ref}
      className={"pointer-events-none select-none " + (className || "")}
      style={{ width: size, height: (size * 120) / 160 }}
      aria-hidden
    >
      <svg viewBox="0 0 160 120" width="100%" height="100%">
        {/* Body */}
        <defs>
          <linearGradient id="bodyGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.35)" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Ears for cuteness */}
        <g opacity="0.9" filter="url(#softShadow)">
          <circle cx="42" cy="24" r="12" fill="url(#bodyGrad)" />
          <circle cx="118" cy="24" r="12" fill="url(#bodyGrad)" />
        </g>
        <g filter="url(#softShadow)">
          <rect
            x="20"
            y="20"
            width="120"
            height="80"
            rx="18"
            fill="url(#bodyGrad)"
          />
          <rect
            x="20"
            y="20"
            width="120"
            height="80"
            rx="18"
            fill="transparent"
            stroke="currentColor"
            opacity="0.12"
          />
        </g>

        {/* Eyes */}
        <g>
          <ellipse cx="50" cy="60" rx="18" ry="14" fill="white" opacity="0.9" />
          <ellipse
            cx="110"
            cy="60"
            rx="18"
            ry="14"
            fill="white"
            opacity="0.9"
          />

          {/* Pupils (tracked) */}
          <circle cx={leftPupil.x} cy={leftPupil.y} r="6" fill="black" />
          <circle cx={rightPupil.x} cy={rightPupil.y} r="6" fill="black" />

          {/* Pupil highlights */}
          <circle
            cx={leftPupil.x - 2}
            cy={leftPupil.y - 2}
            r="2"
            fill="white"
            opacity="0.9"
          />
          <circle
            cx={rightPupil.x - 2}
            cy={rightPupil.y - 2}
            r="2"
            fill="white"
            opacity="0.9"
          />

          {/* Blush cheeks */}
          <ellipse
            cx="50"
            cy="78"
            rx="9"
            ry="5"
            fill="#ef476f"
            opacity="0.22"
          />
          <ellipse
            cx="110"
            cy="78"
            rx="9"
            ry="5"
            fill="#ef476f"
            opacity="0.22"
          />

          {/* Eyelids for blinking (animated via CSS) */}
          <rect
            className="eyelid-left"
            x="32"
            y="46"
            width="36"
            height="28"
            rx="12"
            fill="white"
            opacity="0.95"
          />
          <rect
            className="eyelid-right"
            x="92"
            y="46"
            width="36"
            height="28"
            rx="12"
            fill="white"
            opacity="0.95"
          />
        </g>

        {/* Mouth */}
        <path
          d="M60 85 Q80 95 100 85"
          stroke="currentColor"
          opacity="0.3"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <style jsx>{`
        @keyframes blink {
          0%,
          97%,
          100% {
            transform: translateY(-22px);
          }
          98% {
            transform: translateY(0px);
          }
          99% {
            transform: translateY(-22px);
          }
        }
        .eyelid-left {
          transform: translateY(-22px);
          transform-origin: 50% 50%;
          animation: blink 4.5s ease-in-out infinite;
        }
        .eyelid-right {
          transform: translateY(-22px);
          transform-origin: 50% 50%;
          animation: blink 4.5s ease-in-out infinite;
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
}
