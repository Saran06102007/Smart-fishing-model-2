// A small fish drawn as SVG. It faces right; the tail wags with CSS.
export default function Fish({ size = 40, tone = 'accent' }) {
  return (
    <svg
      className="fish-svg"
      width={size}
      height={size / 2}
      viewBox="0 0 64 32"
      style={{ color: `var(--${tone})` }}
      aria-hidden="true"
    >
      <g className="tail">
        <path d="M13 16 L1 5 Q5 16 1 27 Z" fill="currentColor" />
      </g>
      <path d="M10 16 C18 3 40 3 52 16 C40 29 18 29 10 16 Z" fill="currentColor" />
      <path d="M24 8 Q30 2 36 7" fill="none" stroke="var(--surface-2)" strokeWidth="1.5" opacity=".55" />
      <path d="M30 16 Q36 20 30 23" fill="none" stroke="var(--surface-2)" strokeWidth="1.5" opacity=".55" />
      <circle cx="43" cy="14" r="2.4" fill="var(--surface-2)" />
      <circle cx="43.6" cy="14" r="1" fill="var(--text)" />
    </svg>
  )
}
