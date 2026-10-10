import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages other than Home need a signed-in user. Anyone else is sent back to the
// login card on Home, with a message saying which page they tried to open.
export default function ProtectedRoute({ label, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace state={{ notice: `Sign in to open ${label}` }} />
  return children
}
