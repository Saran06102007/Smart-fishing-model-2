import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavLink, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  IconBrain,
  IconCloud,
  IconFish,
  IconHome,
  IconLock,
  IconMapPin,
  IconNotebook,
} from '@tabler/icons-react'
import Background from './components/Background'
import Water from './components/Water'
import Splash from './components/Splash'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { useStage } from './context/StageContext'
import { useWeather } from './context/WeatherContext'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Weather from './pages/Weather'
import Zones from './pages/Zones'
import Log from './pages/Log'

const TABS = [
  { path: '/', label: 'Home', Icon: IconHome, theme: 'accent' },
  { path: '/predict', label: 'Predict', Icon: IconBrain, theme: 'pro' },
  { path: '/weather', label: 'Weather', Icon: IconCloud, theme: 'warning' },
  { path: '/zones', label: 'Zones', Icon: IconMapPin, theme: 'success' },
  { path: '/log', label: 'Log', Icon: IconNotebook, theme: 'danger' },
]

// On Home the colour blends blue, purple, green as you scroll down.
function homeColor(p) {
  return p < 50
    ? `color-mix(in srgb, var(--pro) ${p * 2}%, var(--accent))`
    : `color-mix(in srgb, var(--success) ${(p - 50) * 2}%, var(--pro))`
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { progress } = useStage()
  const { condition } = useWeather()
  const [splash, setSplash] = useState(true)
  const [ripples, setRipples] = useState([])
  const touch = useRef(null)
  const stageRef = useRef(null)

  const index = Math.max(0, TABS.findIndex((t) => t.path === location.pathname))
  const tab = TABS[index]
  const home = index === 0
  const color = home ? homeColor(progress) : `var(--${tab.theme})`
  const bgc = `color-mix(in srgb, ${color} ${tab.theme === 'danger' ? 10 : 16}%, var(--surface-2))`

  // Swipe left or right on a page to move to the next or previous tab.
  // Vertical swipes only scroll the page, and never move the whole screen.
  const onTouchStart = (e) => {
    if (e.target.closest('input, select, textarea, button, a')) {
      touch.current = null
      return
    }
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const s = touch.current
    touch.current = null
    if (!s) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    if (Math.abs(dx) > 70 && Math.abs(dy) < 45 && Math.abs(dx) > Math.abs(dy) * 2) {
      const next = index + (dx < 0 ? 1 : -1)
      if (next >= 0 && next < TABS.length) navigate(TABS[next].path)
    }
  }

  // Ripple on the water wherever you tap.
  const onPointerDown = (e) => {
    const r = stageRef.current.getBoundingClientRect()
    const id = Date.now() + Math.random()
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples((list) => list.filter((x) => x.id !== id)), 900)
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="bobbing"><IconFish size={20} /></span>
          Smart Fishing
        </Link>
        <div className="top-right">
          <span className="alerts"><span className="dot" /> 2 alerts</span>
          {user && (
            <button className="avatar" onClick={() => { signOut(); navigate('/', { state: { notice: 'You signed out. Sign in to continue.' } }) }} aria-label={`Signed in as ${user.name}. Sign out`} title="Sign out">
              {user.name.charAt(0).toUpperCase()}
            </button>
          )}
        </div>
      </header>

      <div className="waves" aria-hidden="true">
        <svg viewBox="0 0 400 24" preserveAspectRatio="none"><path d="M0 12 Q25 3 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 V24 H0Z" fill="var(--accent)" opacity=".3" /></svg>
        <svg className="rev" viewBox="0 0 400 24" preserveAspectRatio="none"><path d="M0 15 Q25 7 50 15 T100 15 T150 15 T200 15 T250 15 T300 15 T350 15 T400 15 V24 H0Z" fill="var(--accent)" opacity=".5" /></svg>
      </div>

      <main
        ref={stageRef}
        className={`stage ${condition === 'sunny' ? '' : condition}`}
        style={{ '--bgc': bgc }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
      >
        <Background progress={progress} home={home} />
        <Water />
        {ripples.map((r) => (
          <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<ProtectedRoute label="Predict"><Predict /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute label="Weather"><Weather /></ProtectedRoute>} />
            <Route path="/zones" element={<ProtectedRoute label="Zones"><Zones /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute label="Log"><Log /></ProtectedRoute>} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>

      <nav className={`bottomnav ${user ? 'open' : ''}`} aria-label="Main">
        <span className="indicator" style={{ transform: `translateX(${index * 100}%)`, background: color }} />
        {TABS.map(({ path, label, Icon }) => (
          <NavLink key={path} to={path} end className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={22} />
            <span>{label}</span>
            {!user && path !== '/' && <IconLock className="lock" size={12} />}
          </NavLink>
        ))}
      </nav>

      <AnimatePresence>{splash && <Splash key="splash" onDone={() => setSplash(false)} />}</AnimatePresence>
    </div>
  )
}
