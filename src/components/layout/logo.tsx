export function GlobeTrotterLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="GlobeTrotter Emblem"
        >
          {/* Outer Ring */}
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-white opacity-95 transition-opacity group-hover:opacity-100"
          />
          {/* Latitude & Longitude Geometrics */}
          <ellipse
            cx="20"
            cy="20"
            rx="8"
            ry="17"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
            className="text-zinc-400 opacity-70"
          />
          <line
            x1="3"
            y1="20"
            x2="37"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
            className="text-zinc-500 opacity-70"
          />
          {/* Dynamic Travel Trajectory Route */}
          <path
            d="M8 27 C13 11, 25 9, 32 13"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Origin and Destination Pin Nodes */}
          <circle cx="8" cy="27" r="2.25" fill="white" />
          <circle cx="32" cy="13" r="2.75" fill="white" />
          <circle
            cx="32"
            cy="13"
            r="5.5"
            stroke="white"
            strokeWidth="0.75"
            className="animate-ping opacity-75"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-[0.24em] text-white uppercase select-none font-mono">
          GLOBETROTTER
        </span>
        <span className="text-[9px] tracking-[0.2em] text-zinc-400 uppercase -mt-0.5 select-none font-sans">
          Expedition OS
        </span>
      </div>
    </div>
  )
}
