export type User = {
  id: number
  name: string
  email: string
  is_admin: boolean
}

export type Restaurant = {
  id: number
  name: string
  slug: string
  city: string | null
  address: string | null
  phone: string | null
  delivery_fee: string
  is_active: boolean
  image_url: string | null
}

export type Product = {
  id: number
  restaurant_id: number
  name: string
  slug: string
  description: string | null
  price: string
  category: string | null
  is_available: boolean
  image_url: string | null
  restaurant?: Restaurant
}

export type CartItem = {
  id: number
  quantity: number
  options: Record<string, unknown> | null
  line_total?: string
  product?: Product
}

export type Cart = {
  id: number
  subtotal: string
  items: CartItem[]
}

export type OrderItem = {
  id: number
  product_id: number | null
  product_name: string
  unit_price: string
  quantity: number
  options: Record<string, unknown> | null
  line_total?: string
}

export type Order = {
  id: number
  user_id: number
  restaurant_id: number
  status: string
  delivery_address: string
  notes: string | null
  subtotal: string
  delivery_fee: string
  total: string
  placed_at: string | null
  restaurant?: Restaurant
  items?: OrderItem[]
  payments?: Payment[]
}

export type Payment = {
  id: number
  order_id: number
  method: string
  status: string
  amount: string
  provider: string | null
  provider_ref: string | null
  meta: Record<string, unknown> | null
}

export type Paginated<T> = {
  items: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}
