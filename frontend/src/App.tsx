import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AppShell } from './components/AppShell'
import { RequireAdmin, RequireAuth } from './components/RequireAuth'
import { AdminPage } from './pages/AdminPage'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { OrdersPage } from './pages/OrdersPage'
import { RegisterPage } from './pages/RegisterPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { RestaurantsPage } from './pages/RestaurantsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
            <Route
              path="cart"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />
            <Route
              path="orders"
              element={
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              }
            />
            <Route
              path="orders/:id"
              element={
                <RequireAuth>
                  <OrderDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="admin"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
