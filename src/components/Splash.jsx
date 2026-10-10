import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Fish from './Fish'

// Intro: water fills the screen while a fish swims across, then the name appears.
export default function Splash({ onDone }) {
  const [p, setP] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let raf = 0
    let t0 = null
    const step = (ts) => {
      if (t0 === null) t0 = ts
      const t = Math.min((ts - t0) / 2600, 1)
      setP(1 - Math.pow(1 - t, 2))
      if (t < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(onDone, 1000)
    return () => clearTimeout(t)
  }, [done, onDone])

  return (
    <motion.div className="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={onDone} role="status" aria-label="Loading">
      <div className="splash-water" style={{ transform: `translateY(${(1 - p) * 100}%)` }}>
        <div className="splash-wave"><svg viewBox="0 0 400 10" preserveAspectRatio="none"><path d="M0 5 Q25 -2 50 5 T100 5 T150 5 T200 5 T250 5 T300 5 T350 5 T400 5 V10 H0Z" fill="var(--accent)" opacity=".55" /></svg></div>
        <div className="splash-fill" />
      </div>
      <span className="splash-fish" style={{ left: `${p * 108 - 12}%`, transform: `translateY(${Math.sin(p * 14) * 10}px)` }}>
        <Fish size={64} tone="accent" />
      </span>
      <div className="splash-center" style={{ opacity: done ? 0 : 1 }}>
        <p className="splash-num">{Math.round(p * 100)}%</p>
        <p>Loading ocean data</p>
      </div>
      <div className="splash-center" style={{ opacity: done ? 1 : 0, transform: done ? 'scale(1)' : 'scale(.85)' }}>
        <p className="splash-title">Smart Fishing</p>
        <p>Welcome aboard</p>
      </div>
    </motion.div>
  )
}
