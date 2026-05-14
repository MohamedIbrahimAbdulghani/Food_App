import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-orange-500 text-white shadow' : 'text-stone-700 hover:bg-orange-100'}`

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-black text-white shadow-md">
              ب
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold tracking-tight text-stone-900">Broast Meshwar</p>
              <p className="text-xs text-stone-500">بروست مشوار · توصيل سريع</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/restaurants" className={linkClass}>
              المطاعم
            </NavLink>
            <NavLink to="/cart" className={linkClass}>
              السلة
            </NavLink>
            <NavLink to="/orders" className={linkClass}>
              طلباتي
            </NavLink>
            {user?.is_admin && (
              <NavLink to="/admin" className={linkClass}>
                لوحة التحكم
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden max-w-[10rem] truncate text-sm text-stone-600 sm:inline">{user.name}</span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-orange-100"
                >
                  دخول
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
                >
                  حساب جديد
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-orange-100 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] ${isActive ? 'font-semibold text-orange-600' : 'text-stone-600'}`
          }
        >
          <span className="text-lg">⌂</span>
          الرئيسية
        </NavLink>
        <NavLink
          to="/restaurants"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] ${isActive ? 'font-semibold text-orange-600' : 'text-stone-600'}`
          }
        >
          <span className="text-lg">🍗</span>
          المطاعم
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] ${isActive ? 'font-semibold text-orange-600' : 'text-stone-600'}`
          }
        >
          <span className="text-lg">🛒</span>
          السلة
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] ${isActive ? 'font-semibold text-orange-600' : 'text-stone-600'}`
          }
        >
          <span className="text-lg">📦</span>
          الطلبات
        </NavLink>
      </nav>
    </div>
  )
}
