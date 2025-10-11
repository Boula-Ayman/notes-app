"use client";

type AuroraBackgroundProps = {
  className?: string;
};

// Full-viewport animated aurora gradient background (pure CSS, very lightweight)
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      className={
        (className ? className + " " : "") +
        "fixed inset-0 z-0 overflow-hidden pointer-events-none"
      }
      aria-hidden
    >
      <div className="absolute inset-0 sunset-sky" />
      {/* Sun and glow */}
      <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[340px] h-[340px] rounded-full sunset-sun" />
      <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[620px] h-[620px] rounded-full sunset-glow" />
      {/* Moving clouds */}
      <div className="sunset-cloud cloud-1" />
      <div className="sunset-cloud cloud-2" />
      <div className="sunset-cloud cloud-3" />
      <style jsx>{`
        .sunset-sky {
          background: linear-gradient(
            180deg,
            #0f172a 0%,
            #1e293b 25%,
            #334155 45%,
            #f59e0b 70%,
            #f97316 78%,
            #ef4444 85%
          );
        }
        .sunset-sun {
          background: radial-gradient(
            circle at 50% 50%,
            #ffd27a 0%,
            #ffbb55 60%,
            rgba(255, 153, 68, 0.9) 100%
          );
          filter: blur(2px);
          box-shadow: 0 0 80px 30px rgba(255, 166, 72, 0.5);
        }
        .sunset-glow {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 201, 120, 0.35) 0%,
            rgba(255, 153, 68, 0.12) 60%,
            rgba(255, 153, 68, 0) 80%
          );
          filter: blur(10px);
        }
        .sunset-cloud {
          position: absolute;
          left: -30%;
          right: -30%;
          height: 200px;
          filter: blur(32px);
          opacity: 0.25;
          background: radial-gradient(
              circle at 30% 50%,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.35) 30%,
              rgba(255, 255, 255, 0) 60%
            ),
            radial-gradient(
              circle at 60% 50%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.28) 30%,
              rgba(255, 255, 255, 0) 60%
            );
          animation: cloudDrift 39s linear infinite;
        }
        .cloud-1 {
          top: 18%;
        }
        .cloud-2 {
          top: 36%;
          animation-duration: 51s;
          opacity: 0.28;
        }
        .cloud-3 {
          top: 54%;
          animation-duration: 59s;
          opacity: 0.22;
        }

        @keyframes cloudDrift {
          0% {
            transform: translateX(-15%) translateY(0px);
          }
          50% {
            transform: translateX(15%) translateY(-10px);
          }
          100% {
            transform: translateX(-15%) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
