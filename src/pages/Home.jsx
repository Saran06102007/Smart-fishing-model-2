import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconBrain, IconCircleCheck, IconLock, IconRadar, IconShieldCheck } from '@tabler/icons-react'
import PageShell from '../components/PageShell'
import CountUp from '../components/CountUp'
import { useAuth } from '../context/AuthContext'
import { useStage } from '../context/StageContext'

const FEATURES = [
  { Icon: IconRadar, title: 'Live sensor data', text: 'Temperature, oxygen, and pH every minute' },
  { Icon: IconBrain, title: 'AI risk prediction', text: 'Healthy, moderate, or critical zones' },
  { Icon: IconShieldCheck, title: 'Safer fishing decisions', text: 'Weather, zones, and quota in one place' },
]

// Cards fade in as they scroll into view.
function useReveal(scrollRef) {
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { root, threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [scrollRef])
}

// The page scrolls itself down to the login card. Touching, scrolling, or dragging stops it.
function useAutoScroll(scrollRef, jumpToLogin, key) {
  useEffect(() => {
    const el = scrollRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let timer = 0
    let t0 = null
    let stopped = false
    const stop = () => {
      stopped = true
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown']
    events.forEach((e) => el.addEventListener(e, stop, { passive: true }))

    if (jumpToLogin) {
      timer = setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 350)
    } else {
      timer = setTimeout(() => {
        const max = el.scrollHeight - el.clientHeight
        if (max <= 0) return
        const step = (ts) => {
          if (stopped) return
          if (t0 === null) t0 = ts
          const t = Math.min((ts - t0) / 7000, 1)
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
          el.scrollTop = max * ease
          if (t < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      }, 900)
    }
    return () => {
      stop()
      events.forEach((e) => el.removeEventListener(e, stop))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

export default function Home() {
  const scrollRef = useRef(null)
  const loginRef = useRef(null)
  const frame = useRef(0)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signIn, signGuest, signOut } = useAuth()
  const { setProgress } = useStage()
  const notice = location.state && location.state.notice

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  useReveal(scrollRef)
  useAutoScroll(scrollRef, Boolean(notice), location.key)

  // Shake the login card when someone is sent back here.
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => {
      const el = loginRef.current
      if (!el) return
      el.classList.remove('shake')
      void el.offsetWidth
      el.classList.add('shake')
    }, 800)
    return () => clearTimeout(t)
  }, [location.key, notice])

  useEffect(() => () => setProgress(0), [setProgress])

  const handleScroll = (el) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
    })
  }

  const submit = () => {
    const next = {}
    const v = email.trim()
    if (!v) next.email = 'Enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next.email = 'Enter a valid email address'
    if (!password) next.password = 'Enter your password'
    else if (password.length < 6) next.password = 'Use at least 6 characters'
    setErrors(next)
    if (Object.keys(next).length) return
    signIn(v)
    setEmail('')
    setPassword('')
  }

  const doSignOut = () => {
    signOut()
    navigate('/', { state: { notice: 'You signed out. Sign in to continue.' } })
  }

  return (
    <PageShell ref={scrollRef} onScroll={handleScroll}>
      <p className="muted pop" style={{ '--d': 0, marginBottom: 4 }}>Marine extinction risk prediction</p>
      <h1 className="pop" style={{ '--d': 1 }}>Protect the ocean before the catch runs out</h1>

      <div className="grid2 pop" style={{ '--d': 2, marginBottom: 20 }}>
        <div className="card"><p className="muted">Zones monitored</p><p className="big"><CountUp to={12} /></p></div>
        <div className="card"><p className="muted">Model accuracy</p><p className="big"><CountUp to={94} />%</p></div>
      </div>

      <p className="muted" style={{ marginBottom: 8 }}>Why Smart Fishing</p>
      {FEATURES.map(({ Icon, title, text }) => (
        <div className="card feature reveal" key={title}>
          <Icon size={24} className="accent-text" />
          <div>
            <p className="title">{title}</p>
            <p className="muted">{text}</p>
          </div>
        </div>
      ))}

      <div className="card login reveal" ref={loginRef}>
        {!user ? (
          <>
            <p className="title lg">Join Smart Fishing</p>
            <p className="muted" style={{ marginBottom: 8 }}>Sign in to unlock predictions, weather, zones, and your catch log</p>
            {notice && (
              <p className="notice"><IconLock size={14} /> {notice}</p>
            )}
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-label="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: '' })) }}
            />
            {errors.email && <p className="err">{errors.email}</p>}
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              style={{ marginTop: 8 }}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: '' })) }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {errors.password && <p className="err">{errors.password}</p>}
            <button className="btn primary full" style={{ marginTop: 10 }} onClick={submit}>Sign in</button>
            <button className="btn ghost full" onClick={signGuest}>Continue as guest</button>
          </>
        ) : (
          <div className="welcome">
            <IconCircleCheck size={32} className="success-text" />
            <p className="title lg">Welcome, {user.name}</p>
            <p className="muted" style={{ marginBottom: 10 }}>{user.guest ? 'Browsing without an account' : 'You are signed in'}</p>
            <button className="btn primary full" onClick={() => navigate('/predict')}>Open the app</button>
            <button className="btn ghost full" onClick={doSignOut}>Sign out</button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
