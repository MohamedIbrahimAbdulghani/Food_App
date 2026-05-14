import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import type { Paginated, Restaurant } from '../types/models'
import { ApiError } from '../api/client'

export function RestaurantsPage() {
  const [data, setData] = useState<Paginated<Restaurant> | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    const ac = new AbortController()
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('page', '1')
      if (q.trim()) params.set('filter[name]', q.trim())
      void (async () => {
        try {
          const res = await apiFetch<Paginated<Restaurant>>(`/restaurants?${params.toString()}`, {
            signal: ac.signal,
          })
          setData(res)
          setErr(null)
        } catch (e) {
          if ((e as Error).name === 'AbortError') return
          setErr(e instanceof ApiError ? e.message : 'تعذر تحميل المطاعم')
        }
      })()
    }, 300)
    return () => {
      clearTimeout(t)
      ac.abort()
    }
  }, [q])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">المطاعم</h1>
        <p className="text-sm text-stone-500">GET /restaurants — جاهز للفلاتر من الـ API</p>
      </div>
      <input
        placeholder="بحث بالاسم…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-md rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-orange-400/30 focus:ring-4"
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((r) => (
          <Link
            key={r.id}
            to={`/restaurants/${r.id}`}
            className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-28 bg-gradient-to-br from-orange-200 to-amber-300" />
            <div className="space-y-1 p-4">
              <h2 className="font-display text-lg font-bold text-stone-900 group-hover:text-orange-700">{r.name}</h2>
              <p className="text-xs text-stone-500">{r.city ?? '—'}</p>
              <p className="text-sm font-semibold text-orange-600">رسوم التوصيل: {r.delivery_fee}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
