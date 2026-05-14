import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { ApiError } from '../api/client'
import type { Order } from '../types/models'

export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    void (async () => {
      try {
        const o = await apiFetch<Order>(`/orders/${id}`)
        setOrder(o)
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : 'تعذر التحميل')
      }
    })()
  }, [id])

  if (err) return <p className="text-red-600">{err}</p>
  if (!order) return <p className="text-stone-500">جاري التحميل…</p>

  return (
    <div className="space-y-4">
      <Link to="/orders" className="text-sm font-medium text-orange-600 hover:underline">
        ← كل الطلبات
      </Link>
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow">
        <h1 className="font-display text-2xl font-bold">طلب #{order.id}</h1>
        <p className="mt-1 text-sm text-stone-500">الحالة: {order.status}</p>
        <p className="mt-3 text-sm text-stone-700">{order.delivery_address}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span>
            المجموع الفرعي: <b>{order.subtotal}</b>
          </span>
          <span>
            التوصيل: <b>{order.delivery_fee}</b>
          </span>
          <span className="font-bold text-orange-600">الإجمالي: {order.total}</span>
        </div>
      </div>
      <div>
        <h2 className="font-display text-lg font-bold">الأصناف</h2>
        <ul className="mt-2 space-y-2">
          {(order.items ?? []).map((i) => (
            <li key={i.id} className="rounded-xl border border-orange-50 bg-white px-3 py-2 text-sm">
              {i.product_name} × {i.quantity} — {i.line_total ?? ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
