import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { ApiError } from '../api/client'
import type { Order, Paginated } from '../types/models'

export function OrdersPage() {
  const [data, setData] = useState<Paginated<Order> | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<Paginated<Order>>('/orders?per_page=20')
        setData(res)
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : 'تعذر تحميل الطلبات')
      }
    })()
  }, [])

  if (err) return <p className="text-red-600">{err}</p>
  if (!data) return <p className="text-stone-500">جاري التحميل…</p>

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">طلباتي</h1>
      {data.items.length === 0 ? (
        <p className="text-stone-600">لا توجد طلبات بعد.</p>
      ) : (
        <ul className="space-y-2">
          {data.items.map((o) => (
            <li key={o.id}>
              <Link
                to={`/orders/${o.id}`}
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm hover:border-orange-200"
              >
                <span className="font-semibold">طلب #{o.id}</span>
                <span className="text-xs text-stone-500">{o.status}</span>
                <span className="text-sm font-bold text-orange-600">{o.total}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
