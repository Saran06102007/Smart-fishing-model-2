import PageShell from '../components/PageShell'
import { TONE, ZONES } from '../data/zones'

export default function Zones() {
  const count = (s) => ZONES.filter((z) => z.status === s).length
  return (
    <PageShell>
      <h2 className="pop" style={{ '--d': 0 }}>Fishing zones</h2>

      <div className="card summary pop" style={{ '--d': 1 }}>
        <div><p className="big success-text">{count('Healthy')}</p><p className="muted">Healthy</p></div>
        <div><p className="big warning-text">{count('Moderate')}</p><p className="muted">Moderate</p></div>
        <div><p className="big danger-text">{count('Critical')}</p><p className="muted">Critical</p></div>
      </div>

      {ZONES.map((z, i) => (
        <div className="card row pop" style={{ '--d': i + 2 }} key={z.id}>
          <div>
            <p className="title">{z.name}</p>
            <p className="muted">Oxygen {z.oxygen.toFixed(1)} mg/L</p>
          </div>
          <span className={`badge ${TONE[z.status]} ${z.status === 'Critical' ? 'pulse' : ''}`}>{z.status}</span>
        </div>
      ))}
    </PageShell>
  )
}
