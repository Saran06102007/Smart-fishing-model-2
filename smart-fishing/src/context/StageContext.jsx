import { createContext, useContext, useMemo, useState } from 'react'

// Lets the Home page tell the app how far it has scrolled (0 to 100),
// so the background colour can shift while you scroll.
const StageContext = createContext(null)

export function StageProvider({ children }) {
  const [progress, setProgress] = useState(0)
  const value = useMemo(() => ({ progress, setProgress }), [progress])
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>
}

export const useStage = () => useContext(StageContext)
