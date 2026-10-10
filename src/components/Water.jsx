import Fish from './Fish'

// Fish that really swim: they cross the screen, bob up and down, wag their tails,
// and blow bubbles. Three layers of waves rise from the bottom.
const FISH = [
  { top: '14%', size: 46, tone: 'accent', dir: 'r', dur: 19, delay: 0 },
  { top: '30%', size: 30, tone: 'warning', dir: 'l', dur: 15, delay: 3 },
  { top: '47%', size: 58, tone: 'pro', dir: 'r', dur: 26, delay: 7 },
  { top: '63%', size: 34, tone: 'success', dir: 'l', dur: 17, delay: 1 },
  { top: '76%', size: 24, tone: 'accent', dir: 'r', dur: 13, delay: 5 },
  { top: '84%', size: 26, tone: 'warning', dir: 'r', dur: 14.5, delay: 6.2 },
]

const WAVE = 'M0 14 Q25 2 50 14 T100 14 T150 14 T200 14 T250 14 T300 14 T350 14 T400 14 V60 H0Z'

export default function Water() {
  return (
    <div className="water" aria-hidden="true">
      {FISH.map((f, i) => (
        <span
          key={i}
          className={`swimmer ${f.dir === 'r' ? 'to-right' : 'to-left'}`}
          style={{ top: f.top, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
        >
          <span className="bob" style={{ animationDuration: `${2.4 + (i % 3) * 0.7}s` }}>
            <span className="face" style={{ transform: f.dir === 'l' ? 'scaleX(-1)' : undefined, display: 'inline-block' }}>
              <Fish size={f.size} tone={f.tone} />
            </span>
            <i className="fb" style={{ [f.dir === 'r' ? 'right' : 'left']: 0, animationDelay: `${i * 0.4}s` }} />
            <i className="fb small" style={{ [f.dir === 'r' ? 'right' : 'left']: 4, animationDelay: `${i * 0.4 + 0.9}s` }} />
          </span>
        </span>
      ))}

      <div className="waves-bottom">
        <svg className="wl slow" viewBox="0 0 400 60" preserveAspectRatio="none"><path d={WAVE} fill="var(--accent)" opacity=".14" /></svg>
        <svg className="wl mid" viewBox="0 0 400 60" preserveAspectRatio="none"><path d={WAVE} fill="var(--accent)" opacity=".2" /></svg>
        <svg className="wl fast" viewBox="0 0 400 60" preserveAspectRatio="none"><path d={WAVE} fill="var(--accent)" opacity=".28" /></svg>
      </div>
    </div>
  )
}
