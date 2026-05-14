import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import { ApiError } from '../api/client'
import type { Order, Paginated } from '../types/models'

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] as const

export function AdminPage() {
  const [data, setData] = useState<Paginated<Order> | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = async () => {
    try {
      const res = await apiFetch<Paginated<Order>>('/orders?per_page=30&sort=id&direction=desc')
      setData(res)
      setErr(null)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'تعذر التحميل')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function setStatus(orderId: number, status: string) {
    setBusyId(orderId)
    try {
      await apiFetch<unknown>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        json: { status },
      })
      await load()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'فشل تحديث الحالة')
    } finally {
      setBusyId(null)
    }
  }

  if (err) return <p className="text-red-600">{err}</p>
  if (!data) return <p className="text-stone-500">جاري التحميل…</p>

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">لوحة الإدارة</h1>
      <p className="text-sm text-stone-500">PATCH /orders/:id/status — يتطلب حساب admin على الـ API</p>
      <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-orange-50 text-stone-700">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">المستخدم</th>
              <th className="px-3 py-2">الحالة</th>
              <th className="px-3 py-2">الإجمالي</th>
              <th className="px-3 py-2">تحديث</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((o) => (
              <tr key={o.id} className="border-t border-orange-50">
                <td className="px-3 py-2 font-mono">{o.id}</td>
                <td className="px-3 py-2">{o.user_id}</td>
                <td className="px-3 py-2">{o.status}</td>
                <td className="px-3 py-2 font-semibold">{o.total}</td>
                <td className="px-3 py-2">
                  <select
                    className="rounded-lg border px-2 py-1 text-xs"
                    disabled={busyId === o.id}
                    value={o.status}
                    onChange={(e) => void setStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
