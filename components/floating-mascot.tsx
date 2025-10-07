// Lottie React
"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type FloatingMascotProps = {
  className?: string;
  size?: number;
  jsonUrl?: string; // Optional remote Lottie JSON
  imageSrc?: string; // Static PNG/GIF alternative (e.g. "/anime.gif")
  side?: "left" | "right"; // Where to pin horizontally
};

export function FloatingMascot({
  className,
  size = 120,
  jsonUrl,
  imageSrc,
  side = "right",
}: FloatingMascotProps) {
  const [animationData, setAnimationData] = useState<any | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!jsonUrl) return; // Skip fetch if using static image
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(jsonUrl);
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setAnimationData(json);
      } catch {
        // Ignore load errors; just hide mascot
        if (mounted) setVisible(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [jsonUrl]);

  if (!visible) return null;

  return (
    <div
      className={
        "floating-mascot pointer-events-auto fixed z-30 select-none" +
        (className ? " " + className : "")
      }
      data-side={side}
      style={
        {
          bottom: 24,
          animation: "mascot-bounce 2.4s ease-in-out infinite",
        } as React.CSSProperties
      }
      aria-hidden
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="mascot"
          style={{ width: size, height: size }}
          className="object-contain"
        />
      ) : animationData ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: size, height: size }}
        />
      ) : null}
      <style jsx>{`
        @keyframes mascot-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .floating-mascot[data-side="left"] {
          left: 210px;
          right: auto;
        }
        .floating-mascot[data-side="right"] {
          right: 24px;
          left: auto;
        }
        @media (max-width: 640px) {
          .floating-mascot[data-side="left"] {
            left: 16px;
          }
          .floating-mascot[data-side="right"] {
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
