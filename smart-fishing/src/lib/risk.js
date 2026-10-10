import { API_URL } from '../config'

export const FEATURE_IMPORTANCE = [
  { label: 'Oxygen', value: 38, tone: 'accent' },
  { label: 'Temperature', value: 27, tone: 'pro' },
  { label: 'pH', value: 21, tone: 'success' },
  { label: 'Salinity', value: 14, tone: 'warning' },
]

export function labelFor(risk) {
  if (risk < 35) return { label: 'Healthy', tone: 'success' }
  if (risk < 65) return { label: 'Moderate risk', tone: 'warning' }
  return { label: 'Critical', tone: 'danger' }
}

// Simple stand-in so the site works with no backend.
// Higher temperature, lower oxygen, and drifting pH or salinity all raise the risk.
export function localPredict({ temperature, oxygen, ph, salinity }) {
  const raw =
    Math.max(0, temperature - 20) * 3 +
    Math.max(0, 7 - oxygen) * 14 +
    Math.abs(ph - 8.1) * 10 +
    Math.abs(salinity - 35) * 1.5
  const risk = Math.max(0, Math.min(100, Math.round(raw)))
  return { risk, ...labelFor(risk) }
}

// If VITE_API_URL is set, ask your Python backend (the RandomForestClassifier).
// Expected request:  POST {API_URL}/predict  { temperature, oxygen, ph, salinity }
// Expected response: { "risk": 0-100 }   (optionally "label")
export async function predict(values) {
  if (!API_URL) return localPredict(values)
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error('Bad response')
    const data = await res.json()
    const risk = Math.max(0, Math.min(100, Math.round(Number(data.risk))))
    return { risk, ...labelFor(risk) }
  } catch {
    return { ...localPredict(values), offline: true }
  }
}
