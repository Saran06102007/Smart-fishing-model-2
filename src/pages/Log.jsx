import { useState } from 'react'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import PageShell from '../components/PageShell'
import { ZONES } from '../data/zones'

const KEY = 'sf_catches'
const QUOTA = 100
const SPECIES = ['Sardine', 'Mackerel', 'Anchovy', 'Tuna', 'Pomfret']
const START = [
  { id: 1, species: 'Sardine', zone: 1, kg: 24 },
  { id: 2, species: 'Mackerel', zone: 7, kg: 38 },
  { id: 3, species: 'Anchovy', zone: 2, kg: 18 },
  { id: 4, species: 'Tuna', zone: 6, kg: 12 },
  { id: 5, species: 'Pomfret', zone: 1, kg: 9 },
]

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || START
  } catch {
    return START
  }
}

export default function Log() {
  const [catches, setCatches] = useState(load)
  const [species, setSpecies] = useState(SPECIES[0])
  const [zone, setZone] = useState(1)
  const [kg, setKg] = useState('')
  const [error, setError] = useState('')

  const save = (list) => {
    setCatches(list)
    try {
      localStorage.setItem(KEY, JSON.stringify(list))
    } catch {
      /* storage blocked: the log just won't persist */
    }
  }

  const total = catches.reduce((s, c) => s + c.kg, 0)
  const pct = Math.min(100, Math.round((total / QUOTA) * 100))

  const add = () => {
    const n = Number(kg)
    if (!n || n <= 0) return setError('Enter the weight in kg')
    if (total + n > QUOTA) return setError(`That goes over the weekly quota. You have ${Math.max(0, QUOTA - total)} kg left.`)
    setError('')
    setKg('')
    save([{ id: Date.now(), species, zone: Number(zone), kg: n }, ...catches])
  }

  return (
    <PageShell>
      <h2 className="pop" style={{ '--d': 0 }}>Catch log</h2>

      <div className="card pop" style={{ '--d': 1 }}>
        <div className="muted row"><span>Weekly quota used</span><span>{total} of {QUOTA} kg</span></div>
        <div className="bar"><i className={pct > 85 ? 'danger' : 'accent'} style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="card stack pop" style={{ '--d': 2 }}>
        <p className="title">Add a catch</p>
        <select value={species} onChange={(e) => setSpecies(e.target.value)} aria-label="Species">
          {SPECIES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Zone">
          {ZONES.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <input type="number" inputMode="decimal" min="0" placeholder="Weight in kg" aria-label="Weight in kg" value={kg} onChange={(e) => setKg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        {error && <p className="err">{error}</p>}
        <button className="btn primary full" onClick={add}><IconPlus size={16} /> Add catch</button>
      </div>

      <div className="card pop" style={{ '--d': 3 }}>
        <p className="title" style={{ marginBottom: 8 }}>This week</p>
        {catches.map((c) => (
          <div className="row item" key={c.id}>
            <span>{c.species}, Zone {c.zone}</span>
            <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {c.kg} kg
              <button className="icon-btn" aria-label={`Remove ${c.species}`} onClick={() => save(catches.filter((x) => x.id !== c.id))}><IconTrash size={16} /></button>
            </span>
          </div>
        ))}
      </div>

      <div className="card pop" style={{ '--d': 4 }}>
        <p className="title" style={{ marginBottom: 4 }}>Breeding season ban</p>
        <p className="muted">Apr 15 to Jun 14. Fishing is paused to let stocks recover.</p>
      </div>
    </PageShell>
  )
}
