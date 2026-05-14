import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setPending(true)
    try {
      await login(email, password)
      navigate(loc.state?.from ?? '/', { replace: true })
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'تعذر تسجيل الدخول')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-orange-100 bg-white p-6 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-stone-900">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-stone-500">بياناتك تُرسل إلى الـ API (Sanctum token).</p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-stone-700">البريد</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none ring-orange-400/40 focus:ring-4"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">كلمة المرور</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none ring-orange-400/40 focus:ring-4"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? 'جاري الدخول…' : 'دخول'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-600">
        ليس لديك حساب؟{' '}
        <Link className="font-semibold text-orange-600 hover:underline" to="/register">
          سجّل الآن
        </Link>
      </p>
    </div>
  )
}
