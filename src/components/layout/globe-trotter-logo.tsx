import Link from "next/link"

export function GlobeTrotterLogo({
  className = "w-6 h-6",
  textClassName = "text-sm",
  showSubtext = true,
  href = "/",
}: {
  className?: string
  textClassName?: string
  showSubtext?: boolean
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative flex items-center justify-center shrink-0">
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
            strokeWidth="2"
            className="text-zinc-900 dark:text-white transition-opacity group-hover:opacity-100"
          />
          {/* Latitude & Longitude Geometrics */}
          <ellipse
            cx="20"
            cy="20"
            rx="8"
            ry="17"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="text-zinc-400 dark:text-zinc-500"
          />
          <line
            x1="3"
            y1="20"
            x2="37"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="text-zinc-400 dark:text-zinc-500"
          />
          {/* Dynamic Travel Trajectory Route */}
          <path
            d="M8 27 C13 11, 25 9, 32 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-zinc-900 dark:text-white"
          />
          {/* Origin and Destination Pin Nodes */}
          <circle cx="8" cy="27" r="2.25" fill="currentColor" className="text-zinc-900 dark:text-white" />
          <circle cx="32" cy="13" r="2.75" fill="currentColor" className="text-zinc-900 dark:text-white" />
          <circle
            cx="32"
            cy="13"
            r="5.5"
            stroke="currentColor"
            strokeWidth="0.75"
            className="animate-ping opacity-60 text-zinc-900 dark:text-white"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-mono font-bold tracking-[0.24em] text-zinc-950 dark:text-white uppercase leading-none ${textClassName}`}>
          GLOBETROTTER
        </span>
        {showSubtext && (
          <span className="text-[9px] tracking-[0.22em] text-zinc-400 dark:text-zinc-500 uppercase mt-0.5 font-mono leading-none">
            EXPEDITION OS
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
