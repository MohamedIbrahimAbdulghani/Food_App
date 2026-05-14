import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { ReactNode } from 'react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-stone-500">جاري التحميل…</div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-stone-500">جاري التحميل…</div>
    )
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
