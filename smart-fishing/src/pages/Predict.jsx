import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { FEATURE_IMPORTANCE, labelFor, localPredict, predict } from '../lib/risk'
import { ZONES } from '../data/zones'

function Slider({ label, unit, min, max, step, value, onChange }) {
  return (
    <div>
      <div className="muted row"><span>{label}</span><span>{value} {unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
    </div>
  )
}

const rand = (a, b, d = 1) => Number((a + Math.random() * (b - a)).toFixed(d))
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Predict() {
  const [vals, setVals] = useState({ temperature: 24, oxygen: 5.2, ph: 8.0, salinity: 35 })
  const [res, setRes] = useState(() => localPredict(vals))
  const [history, setHistory] = useState(() => [
    { time: '10:00', zone: 'Zone 3', ...labelFor(48) },
    { time: '09:30', zone: 'Zone 4', ...labelFor(82) },
    { time: '09:00', zone: 'Zone 1', ...labelFor(18) },
  ])
  const set = (k) => (v) => setVals((x) => ({ ...x, [k]: v }))

  useEffect(() => {
    let live = true
    const t = setTimeout(() => predict(vals).then((r) => live && setRes(r)), 200)
    return () => {
      live = false
      clearTimeout(t)
    }
  }, [vals])

  const simulate = () => {
    const next = { temperature: rand(18, 34, 0), oxygen: rand(2.5, 8, 1), ph: rand(7.4, 8.4, 1), salinity: rand(30, 38, 0) }
    setVals(next)
    const r = localPredict(next)
    const zone = ZONES[Math.floor(Math.random() * ZONES.length)]
    setHistory((h) => [{ time: clock(), zone: `Zone ${zone.id}`, label: r.label, tone: r.tone }, ...h].slice(0, 6))
  }

  return (
    <PageShell>
      <h2 className="pop" style={{ '--d': 0 }}>Predict zone health</h2>

      <div className="card stack pop" style={{ '--d': 1 }}>
        <Slider label="Temperature" unit="C" min={0} max={40} step={1} value={vals.temperature} onChange={set('temperature')} />
        <Slider label="Oxygen" unit="mg/L" min={0} max={10} step={0.1} value={vals.oxygen} onChange={set('oxygen')} />
        <Slider label="pH" unit="" min={6} max={9} step={0.1} value={vals.ph} onChange={set('ph')} />
        <Slider label="Salinity" unit="ppt" min={25} max={40} step={1} value={vals.salinity} onChange={set('salinity')} />
        <button className="btn full" onClick={simulate}>Simulate new reading</button>
      </div>

      <div className="card pop" style={{ '--d': 2 }}>
        <p className="muted">Predicted status</p>
        <p className={`big ${res.tone}-text`}>{res.label}</p>
        <div className="bar"><i className={res.tone} style={{ width: `${res.risk}%` }} /></div>
        <p className="muted" style={{ marginTop: 6 }}>Risk score {res.risk} of 100{res.offline ? ' (backend offline, using estimate)' : ''}</p>
      </div>

      <div className="card pop" style={{ '--d': 3 }}>
        <p className="title" style={{ marginBottom: 8 }}>What drives the risk</p>
        {FEATURE_IMPORTANCE.map((f) => (
          <div key={f.label} style={{ marginBottom: 8 }}>
            <div className="muted row"><span>{f.label}</span><span>{f.value}%</span></div>
            <div className="bar"><i className={f.tone} style={{ width: `${f.value}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="card pop" style={{ '--d': 4 }}>
        <p className="title" style={{ marginBottom: 8 }}>Recent readings</p>
        {history.map((h, i) => (
          <div className="row item" key={i}>
            <span>{h.time}, {h.zone}</span>
            <span className={`badge ${h.tone}`}>{h.label.replace(' risk', '')}</span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
