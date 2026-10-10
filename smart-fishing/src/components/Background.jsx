import { useMemo } from 'react'
import { IconCloud } from '@tabler/icons-react'
import Fish from './Fish'

const BUBBLES = [
  { left: '8%', size: 14, dur: 9, delay: 0 },
  { left: '24%', size: 8, dur: 7, delay: 2 },
  { left: '41%', size: 18, dur: 11, delay: 1 },
  { left: '58%', size: 10, dur: 8, delay: 4 },
  { left: '74%', size: 16, dur: 10, delay: 3 },
  { left: '91%', size: 9, dur: 7.5, delay: 5 },
]

// Bubbles, clouds, rain and lightning. The stage class (rainy or storm) decides what shows.
export default function Background({ progress, home }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        left: Math.random() * 92 + 2,
        dur: 0.7 + Math.random() * 0.5,
        delay: Math.random() * 1.3,
      })),
    []
  )

  return (
    <>
      <div className="tint" />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bub"
          style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
      <span className="cl" style={{ top: 8, fontSize: 34, animationDuration: '22s' }}>
        <IconCloud size="1em" />
      </span>
      <span className="cl" style={{ top: 250, fontSize: 26, animationDuration: '32s', animationDelay: '6s' }}>
        <IconCloud size="1em" />
      </span>

      {/* Home page parallax: a fish and two bubbles move at different speeds as you scroll */}
      <span className="dec" style={{ top: 34, left: 0, opacity: home ? 1 : 0, transform: `translateX(${360 - progress * 3.8}px)` }}>
        <Fish size={34} tone="accent" />
      </span>
      <span className="dec bubble" style={{ left: '12%', top: 470, width: 14, height: 14, opacity: home ? 1 : 0, transform: `translateY(${-progress * 3.2}px)` }} />
      <span className="dec bubble" style={{ left: '84%', top: 490, width: 22, height: 22, opacity: home ? 1 : 0, transform: `translateY(${-progress * 3.8}px)` }} />

      <div className="rain">
        {drops.map((d, i) => (
          <span key={i} className="drop" style={{ left: `${d.left}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
        ))}
      </div>
      <div className="flash" />
    </>
  )
}
