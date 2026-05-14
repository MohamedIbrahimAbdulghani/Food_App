import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiFetch, setToken, getToken } from '../api/client'
import type { User } from '../types/models'

type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

type LoginResponse = { user: User; token: string }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const t = getToken()
    if (!t) {
      setUser(null)
      return
    }
    try {
      const u = await apiFetch<User>('/auth/user')
      setUser(u)
    } catch {
      setToken(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      await refreshUser()
      setLoading(false)
    })()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      json: { email, password },
    })
    setToken(data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, password_confirmation: string) => {
      const data = await apiFetch<LoginResponse>('/auth/register', {
        method: 'POST',
        auth: false,
        json: { name, email, password, password_confirmation },
      })
      setToken(data.token)
      setUser(data.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await apiFetch<unknown>('/auth/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
