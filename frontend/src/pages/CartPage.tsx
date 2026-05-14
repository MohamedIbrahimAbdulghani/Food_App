import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { ApiError } from '../api/client'
import type { Cart, Order } from '../types/models'

export function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<Cart | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const c = await apiFetch<Cart>('/cart')
      setCart(c)
      setErr(null)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'تعذر تحميل السلة')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function updateQty(lineId: number, quantity: number) {
    setBusy(true)
    try {
      const c = await apiFetch<Cart>(`/cart/items/${lineId}`, {
        method: 'PATCH',
        json: { quantity },
      })
      setCart(c)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'فشل التحديث')
    } finally {
      setBusy(false)
    }
  }

  async function removeLine(lineId: number) {
    setBusy(true)
    try {
      const c = await apiFetch<Cart>(`/cart/items/${lineId}`, { method: 'DELETE' })
      setCart(c)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'فشل الحذف')
    } finally {
      setBusy(false)
    }
  }

  async function checkout() {
    setBusy(true)
    setErr(null)
    try {
      const order = await apiFetch<Order>('/orders', {
        method: 'POST',
        json: {
          delivery_address: address,
          notes: notes || null,
          payment_method: paymentMethod,
        },
      })
      setCheckoutOpen(false)
      await load()
      navigate(`/orders/${order.id}`)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'فشل إنشاء الطلب')
    } finally {
      setBusy(false)
    }
  }

  if (!cart) return <p className="text-stone-500">جاري التحميل…</p>

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">السلة</h1>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {cart.items.length === 0 ? (
        <p className="text-stone-600">
          السلة فارغة.{' '}
          <Link className="font-semibold text-orange-600 hover:underline" to="/restaurants">
            تصفح المطاعم
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((line) => (
            <div
              key={line.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">{line.product?.name ?? 'منتج'}</p>
                <p className="text-xs text-stone-500">السطر: {line.line_total ?? '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={busy || line.quantity <= 1}
                  className="rounded-lg border px-2 py-1 text-sm"
                  onClick={() => void updateQty(line.id, line.quantity - 1)}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-lg border px-2 py-1 text-sm"
                  onClick={() => void updateQty(line.id, line.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-600"
                  onClick={() => void removeLine(line.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900 p-4 text-white">
            <div>
              <p className="text-xs text-stone-300">الإجمالي التقريبي</p>
              <p className="font-display text-xl font-bold">{cart.subtotal}</p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold shadow hover:bg-orange-600"
            >
              إتمام الطلب
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 md:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold">بيانات التوصيل</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium">العنوان</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">ملاحظات (اختياري)</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">طريقة الدفع</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')}
                >
                  <option value="cod">عند الاستلام</option>
                  <option value="card">بطاقة (اختبار)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl border py-3 text-sm font-semibold"
                onClick={() => setCheckoutOpen(false)}
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={busy || !address.trim()}
                className="flex-1 rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white disabled:opacity-50"
                onClick={() => void checkout()}
              >
                تأكيد الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
