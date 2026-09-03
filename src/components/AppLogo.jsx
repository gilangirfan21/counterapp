export default function AppLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="text-neutral-900 dark:text-white"
      role="img"
      aria-label="CounterDate"
    >
      <g transform="translate(50, 50)">
        <path
          d="M 0 -28 A 28 28 0 0 0 0 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="0" y1="0" x2="22" y2="0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="22" y1="0" x2="22" y2="18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4.5" fill="#ff6b35" />
      </g>
    </svg>
  )
}
