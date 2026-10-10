import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LOCATION } from '../config'

const WeatherContext = createContext(null)

const PRESETS = {
  sunny: { temp: 29, wind: 14, wave: 0.8, text: 'Partly sunny' },
  rainy: { temp: 25, wind: 24, wave: 1.6, text: 'Steady rain' },
  storm: { temp: 22, wind: 48, wave: 3.2, text: 'Thunderstorm warning' },
}

const SAMPLE_DAYS = [
  { label: 'Sat', condition: 'sunny', temp: 30 },
  { label: 'Sun', condition: 'cloudy', temp: 28 },
  { label: 'Mon', condition: 'rainy', temp: 26 },
  { label: 'Tue', condition: 'rainy', temp: 26 },
  { label: 'Wed', condition: 'sunny', temp: 29 },
]

// Open-Meteo weather codes: https://open-meteo.com/en/docs
export function codeToCondition(code) {
  if (code >= 95) return 'storm'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 71 && code <= 77)) return 'rainy'
  return 'sunny'
}

function codeText(code) {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code === 45 || code === 48) return 'Foggy'
  if (code >= 95) return 'Thunderstorm'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 51 && code <= 67) return 'Rain'
  return 'Mixed conditions'
}

function dayCondition(code) {
  const c = codeToCondition(code)
  if (c === 'sunny' && code > 0) return 'cloudy'
  return c
}

function safetyOf(v, condition) {
  if (v.wind > 40 || v.wave > 2.5 || condition === 'storm') return { tone: 'danger', text: 'Stay ashore, storm warning' }
  if (v.wind > 22 || v.wave > 1.4 || condition === 'rainy') return { tone: 'warning', text: 'Take care, rough water ahead' }
  return { tone: 'success', text: 'Safe to go out today' }
}

export function WeatherProvider({ children }) {
  const [mode, setMode] = useState('live') // live | sunny | rainy | storm
  const [live, setLive] = useState({ status: 'loading' })

  useEffect(() => {
    let off = false
    const w = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max&forecast_days=5&timezone=auto`
    const m = `https://marine-api.open-meteo.com/v1/marine?latitude=${LOCATION.marineLat}&longitude=${LOCATION.marineLon}&current=wave_height`

    async function load() {
      try {
        const [wr, mr] = await Promise.allSettled([
          fetch(w).then((r) => r.json()),
          fetch(m).then((r) => r.json()),
        ])
        const wd = wr.status === 'fulfilled' ? wr.value : null
        if (!wd || !wd.current) throw new Error('No weather data')
        const md = mr.status === 'fulfilled' ? mr.value : null
        const days = wd.daily
          ? wd.daily.time.map((t, i) => ({
              label: new Date(t + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }),
              condition: dayCondition(wd.daily.weather_code[i]),
              temp: Math.round(wd.daily.temperature_2m_max[i]),
            }))
          : null
        if (!off)
          setLive({
            status: 'ok',
            temp: Math.round(wd.current.temperature_2m),
            wind: Math.round(wd.current.wind_speed_10m),
            code: wd.current.weather_code,
            wave: md && md.current && md.current.wave_height != null ? md.current.wave_height : null,
            days,
          })
      } catch {
        if (!off) setLive({ status: 'error' })
      }
    }
    load()
    return () => {
      off = true
    }
  }, [])

  const value = useMemo(() => {
    const usingLive = mode === 'live' && live.status === 'ok'
    const condition = usingLive ? codeToCondition(live.code) : mode === 'live' ? 'sunny' : mode
    const base = PRESETS[condition]
    const view = usingLive
      ? { temp: live.temp, wind: live.wind, wave: live.wave ?? base.wave, text: codeText(live.code), days: live.days || SAMPLE_DAYS }
      : { ...base, days: SAMPLE_DAYS }
    return {
      mode,
      setMode,
      condition,
      view,
      usingLive,
      status: live.status,
      safety: safetyOf(view, condition),
    }
  }, [mode, live])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export const useWeather = () => useContext(WeatherContext)
