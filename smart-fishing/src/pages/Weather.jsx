import { IconCloud, IconCloudRain, IconCloudStorm, IconSun, IconWaveSine, IconWind, IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import PageShell from '../components/PageShell'
import { useWeather } from '../context/WeatherContext'
import { LOCATION } from '../config'

const ICON = { sunny: IconSun, cloudy: IconCloud, rainy: IconCloudRain, storm: IconCloudStorm }
const MODES = [
  ['live', 'Live'],
  ['sunny', 'Sunny'],
  ['rainy', 'Rainy'],
  ['storm', 'Stormy'],
]

export default function Weather() {
  const { mode, setMode, condition, view, usingLive, status, safety } = useWeather()
  const Main = ICON[condition]

  return (
    <PageShell>
      <h2 className="pop" style={{ '--d': 0, marginBottom: 8 }}>Weather and sea</h2>

      <div className="seg pop" style={{ '--d': 1 }} role="group" aria-label="Weather source">
        {MODES.map(([key, label]) => (
          <button key={key} className={mode === key ? 'on' : ''} onClick={() => setMode(key)}>{label}</button>
        ))}
      </div>
      <p className="muted pop" style={{ '--d': 1, margin: '6px 0 8px' }}>
        {mode !== 'live' ? 'Simulated weather. The whole app changes with it.' : usingLive ? `Live data for ${LOCATION.name}` : status === 'loading' ? 'Loading live data' : 'Live data is not available, showing a sample'}
      </p>

      <div className="card now pop" style={{ '--d': 2 }}>
        <span className={condition === 'sunny' ? 'spin warning-text' : 'bobbing accent-text'}><Main size={40} /></span>
        <div>
          <p className="big">{view.temp} C</p>
          <p className="muted">{view.text}, {LOCATION.name}</p>
        </div>
      </div>

      <div className="grid2 pop" style={{ '--d': 3 }}>
        <div className="card"><p className="muted"><IconWind size={14} /> Wind</p><p className="big">{view.wind} km/h</p></div>
        <div className="card"><p className="muted"><IconWaveSine size={14} /> Wave height</p><p className="big">{Number(view.wave).toFixed(1)} m</p></div>
      </div>

      <div className={`card tone ${safety.tone} pop`} style={{ '--d': 4 }}>
        <p className="title">{safety.text}</p>
      </div>

      <div className="days pop" style={{ '--d': 5 }}>
        {view.days.map((d) => {
          const I = ICON[d.condition] || IconSun
          return (
            <div className="card day" key={d.label}>
              <p className="muted">{d.label}</p>
              <I size={20} />
              <p>{d.temp}</p>
            </div>
          )
        })}
      </div>

      <div className="card pop" style={{ '--d': 6 }}>
        <p className="title" style={{ marginBottom: 8 }}>Tide times today (sample)</p>
        <div className="row item"><span><IconArrowUp size={14} /> High tide</span><span className="muted">06:42</span></div>
        <div className="row item"><span><IconArrowDown size={14} /> Low tide</span><span className="muted">12:58</span></div>
        <div className="row item"><span><IconArrowUp size={14} /> High tide</span><span className="muted">19:05</span></div>
      </div>
    </PageShell>
  )
}
