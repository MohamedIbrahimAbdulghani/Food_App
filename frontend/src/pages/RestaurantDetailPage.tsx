import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { ApiError } from '../api/client'
import type { Paginated, Product, Restaurant } from '../types/models'
import { useAuth } from '../auth/AuthContext'

export function RestaurantDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    void (async () => {
      try {
        const r = await apiFetch<Restaurant>(`/restaurants/${id}`)
        setRestaurant(r)
        const p = await apiFetch<Paginated<Product>>(`/products?filter[restaurant_id]=${id}&per_page=50`)
        setProducts(p.items)
        setErr(null)
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : 'تعذر التحميل')
      }
    })()
  }, [id])

  async function addToCart(productId: number) {
    if (!user) {
      setMsg('سجّل الدخول لإضافة للسلة')
      return
    }
    setMsg(null)
    try {
      await apiFetch<unknown>('/cart/items', {
        method: 'POST',
        json: { product_id: productId, quantity: 1 },
      })
      setMsg('تمت الإضافة للسلة')
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : 'تعذرت الإضافة')
    }
  }

  if (err) return <p className="text-red-600">{err}</p>
  if (!restaurant) return <p className="text-stone-500">جاري التحميل…</p>

  return (
    <div className="space-y-6">
      <Link to="/restaurants" className="text-sm font-medium text-orange-600 hover:underline">
        ← العودة للمطاعم
      </Link>
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow">
        <div className="h-40 bg-gradient-to-r from-orange-400 to-amber-500" />
        <div className="space-y-2 p-6">
          <h1 className="font-display text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-stone-600">{restaurant.address ?? restaurant.city}</p>
        </div>
      </div>
      {msg && <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-800">{msg}</p>}
      <h2 className="font-display text-xl font-bold">القائمة</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-orange-50 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-stone-900">{p.name}</p>
              <p className="text-xs text-stone-500">{p.category}</p>
              <p className="mt-1 text-sm font-bold text-orange-600">{p.price}</p>
            </div>
            <button
              type="button"
              disabled={!p.is_available}
              onClick={() => void addToCart(p.id)}
              className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {p.is_available ? 'أضف' : 'غير متوفر'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
