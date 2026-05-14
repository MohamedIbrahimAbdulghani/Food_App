# Broast Meshwar — React frontend

تطبيق **Vite + React + TypeScript + Tailwind v4** يتصل بـ Laravel API (`/api/v1`) عبر `fetch` ويخزّن توكن **Sanctum** في `localStorage`.

> التصميم هنا نمط **تطبيق توصيل / بروست** (برتقالي، بطاقات، RTL). لم يُستورد Stitch تلقائياً: انسخ الألوان والمسافات من مشروع **Broast Delivery App** في Stitch إلى `tailwind` وملفات الصفحات عند الحاجة.

## التشغيل مع الـ backend

1. شغّل الـ API (مثلاً من مجلد `backend`):

   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

2. انسخ الإعدادات:

   ```bash
   cd frontend
   cp .env.example .env
   ```

   تأكد أن `VITE_API_URL` يشير إلى نفس الـ host/port، مثلاً:

   `VITE_API_URL=http://127.0.0.1:8000/api/v1`

3. في `backend/.env` أضف أصل الواجهة ضمن CORS (مثال):

   `CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173`

4. شغّل الواجهة:

   ```bash
   npm install
   npm run dev
   ```

## الصفحات

| مسار | الوصف |
|------|--------|
| `/` | رئيسية |
| `/login`, `/register` | دخول / تسجيل |
| `/restaurants` | قائمة مطاعم من API |
| `/restaurants/:id` | تفاصيل + قائمة منتجات + إضافة للسلة |
| `/cart` | سلة + إتمام طلب (يتطلب تسجيل دخول) |
| `/orders`, `/orders/:id` | الطلبات |
| `/admin` | جدول الطلبات وتحديث الحالة (حساب admin فقط) |

## بناء الإنتاج

```bash
npm run build
npm run preview
```
