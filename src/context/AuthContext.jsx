import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// DEMO LOGIN: this only stores a name in the browser. It does not check passwords.
// To make it real, replace signIn() with a call to Firebase Auth, Supabase, or your own API.
const AuthContext = createContext(null)
const KEY = 'sf_user'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load)

  const save = useCallback((u) => {
    setUser(u)
    try {
      if (u) localStorage.setItem(KEY, JSON.stringify(u))
      else localStorage.removeItem(KEY)
    } catch {
      /* storage can be blocked; the session just won't persist */
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      signIn(email) {
        const raw = email.split('@')[0]
        save({ name: raw.charAt(0).toUpperCase() + raw.slice(1), guest: false })
      },
      signGuest() {
        save({ name: 'Guest', guest: true })
      },
      signOut() {
        save(null)
      },
    }),
    [user, save]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
