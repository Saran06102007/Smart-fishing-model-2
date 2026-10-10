import { useEffect, useState } from 'react'

export default function CountUp({ to, duration = 900 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    let t0 = null
    const step = (ts) => {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{v}</>
}
