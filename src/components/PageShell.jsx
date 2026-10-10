import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { motion } from 'framer-motion'

// Wraps every page: slide-and-fade transition, its own vertical scrolling,
// and a draggable scroll bar. Scrolling stays inside the page, so swiping up
// and down never moves the whole browser or app.
const PageShell = forwardRef(function PageShell({ children, onScroll }, ref) {
  const scroller = useRef(null)
  const track = useRef(null)
  const thumb = useRef(null)
  const idle = useRef(0)
  useImperativeHandle(ref, () => scroller.current)

  const update = useCallback(() => {
    const el = scroller.current
    const tr = track.current
    const th = thumb.current
    if (!el || !tr || !th) return
    const H = el.clientHeight
    const S = el.scrollHeight
    if (S <= H + 2) {
      tr.style.opacity = 0
      return
    }
    tr.style.opacity = 1
    const room = tr.clientHeight
    const h = Math.max(28, (room * H) / S)
    th.style.height = h + 'px'
    th.style.transform = `translateY(${(el.scrollTop / (S - H)) * (room - h)}px)`
  }, [])

  useEffect(() => {
    update()
    const ro = new ResizeObserver(update)
    ro.observe(scroller.current)
    if (scroller.current.firstElementChild) ro.observe(scroller.current.firstElementChild)
    return () => ro.disconnect()
  }, [update])

  const handleScroll = () => {
    update()
    thumb.current.classList.add('active')
    clearTimeout(idle.current)
    idle.current = setTimeout(() => thumb.current && thumb.current.classList.remove('active'), 900)
    onScroll && onScroll(scroller.current)
  }

  const startDrag = (e) => {
    const el = scroller.current
    const th = thumb.current
    const y0 = e.clientY
    const t0 = el.scrollTop
    th.setPointerCapture(e.pointerId)
    th.classList.add('active')
    const move = (ev) => {
      const room = Math.max(1, track.current.clientHeight - th.offsetHeight)
      el.scrollTop = t0 + ((ev.clientY - y0) * (el.scrollHeight - el.clientHeight)) / room
    }
    const up = () => {
      th.removeEventListener('pointermove', move)
      th.removeEventListener('pointerup', up)
      th.classList.remove('active')
    }
    th.addEventListener('pointermove', move)
    th.addEventListener('pointerup', up)
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, x: 28, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -28, scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pg" ref={scroller} onScroll={handleScroll}>
        <div className="pg-in">{children}</div>
      </div>
      <div className="sb" ref={track} aria-hidden="true">
        <div className="sbt" ref={thumb} onPointerDown={startDrag} />
      </div>
    </motion.div>
  )
})

export default PageShell
