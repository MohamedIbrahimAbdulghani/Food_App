import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setPending(true)
    try {
      await register(name, email, password, password_confirmation)
      navigate('/', { replace: true })
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        const first = Object.values(e.errors)[0]?.[0]
        setErr(first ?? e.message)
      } else {
        setErr(e instanceof ApiError ? e.message : 'تعذر التسجيل')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-orange-100 bg-white p-6 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-stone-900">حساب جديد</h1>
      <p className="mt-1 text-sm text-stone-500">يُنشأ حساب عبر POST /auth/register على الـ backend.</p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-stone-700">الاسم</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none ring-orange-400/40 focus:ring-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">البريد</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none ring-orange-400/40 focus:ring-4"
            type="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">تأكيد كلمة المرور</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none ring-orange-400/40 focus:ring-4"
            type="password"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? 'جاري إنشاء الحساب…' : 'تسجيل'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-600">
        لديك حساب؟{' '}
        <Link className="font-semibold text-orange-600 hover:underline" to="/login">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  )
}
