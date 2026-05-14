import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 p-8 text-white shadow-xl md:p-12">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-100">Broast Delivery App</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
            بروست ساخن… ومشوار يوصلك بسرعة
          </h1>
          <p className="text-orange-50/95">
            واجهة React جاهزة للربط مع Laravel API. صمّم الشاشات على Stitch ثم طابق الألوان والمسافات هنا بسهولة
            (Tailwind).
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/restaurants"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-orange-600 shadow hover:bg-orange-50"
            >
              تصفح المطاعم
            </Link>
            <Link
              to="/register"
              className="rounded-2xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { t: 'توصيل لحد البيت', d: 'عنوان واضح وملاحظات للطلب.' },
          { t: 'سلة ذكية', d: 'تضيف من المنتجات وتربط مباشرة بـ API السلة.' },
          { t: 'دفع عند الاستلام أو بطاقة', d: 'نفس مسارات الدفع في الـ backend.' },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg font-bold text-stone-900">{x.t}</h3>
            <p className="mt-2 text-sm text-stone-600">{x.d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
