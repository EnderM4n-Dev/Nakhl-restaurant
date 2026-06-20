# 🌴 رستوران نخل — Nakhl Restaurant

وب‌اپلیکیشن کامل رستوران ایرانی با منوی دیجیتال، رزرو آنلاین و پنل مدیریت.

### 👉 [مشاهده‌ی دموی زنده — Live Demo](https://EnderM4n-Dev.github.io/Nakhl-restaurant/) ▶️

[![Live Demo](https://img.shields.io/badge/▶_LIVE_DEMO-334132?style=for-the-badge&logo=github&logoColor=white)](https://EnderM4n-Dev.github.io/Nakhl-restaurant/)
[![HTML](https://img.shields.io/badge/HTML-Vanilla-E0913C?style=for-the-badge&logo=html5&logoColor=white)](#)
[![RTL](https://img.shields.io/badge/فارسی-RTL-C8513B?style=for-the-badge)](#)

---

یک وب‌اپلیکیشن کامل رستوران (prototype) — کاملاً فارسی و RTL — شامل صفحه‌ی اصلی، منوی رستوران، سبد خرید، شبیه‌سازی ثبت سفارش، علاقه‌مندی‌ها، رزرو میز، پنل مشتری و پنل مدیریت.

## ✨ امکانات

- 🍔 **منوی رستوران** با ۱۲۶ آیتم در ۱۹ دسته و ۳ بخش (فست‌فود / دریایی / ایرانی)
- 🛒 **سبد خرید** انیمیشن‌دار و ثبت سفارش با کد پیگیری
- 📅 **رزرو میز** با تقویم شمسی و ساعت فارسی
- ❤️ **علاقه‌مندی‌ها** synced بین منو و پنل مشتری
- 👤 **پنل مشتری** (سفارشات با وضعیت لحظه‌ای، نظرات، رزروها)
- ⚙️ **پنل مدیریت** (مدیریت منو، نظرات، سفارشات، تخفیف، آمار)
- 🎬 **هیروی پارالاکس** با collapse هنگام اسکرول
- ⭐ **سیستم نظر و امتیازدهی** ۵ ستاره‌ای با تأیید ادمین
- 📱 **کاملاً واکنش‌گرا** (موبایل تا دسکتاپ)

## اجرای محلی (Local)

این پروژه استاتیک است و نیازی به build ندارد. فقط باید با یک وب‌سرور ساده اجرا شود (به‌خاطر بارگذاری ES Modules).

ساده‌ترین راه‌ها:

```bash
# روش ۱: با پایتون
python3 -m http.server 8000
# سپس باز کن: http://localhost:8000

# روش ۲: با Node.js
npx serve .

# روش ۳: VS Code → افزونه‌ی Live Server → کلیک راست روی index.html
```

## انتشار روی GitHub Pages

1. ریپو را روی GitHub push کنید
2. در **Settings → Pages** برید:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `root`
3. چند دقیقه صبر کنید — سایت در این آدرس فعال می‌شود:
   ```
   https://EnderM4n-Dev.github.io/Nakhl-restaurant/
   ```

> فایل `.nojekyll` از پیش موجود است تا GitHub Pages فایل‌های با نام فارسی را درست سرو کند.

## 🎨 سیستم طراحی

| | |
|---|---|
| **رنگ اصلی** | `#334132` سبز تیره |
| **رنگ ثانویه** | `#7FA69C` مِیج / `#5E9C8B` فیروزه‌ای |
| **پس‌زمینه** | `#F3FFFC` |
| **CTA** | `#E0913C` نارنجی |
| **هشدار** | `#C8513B` آجری |
| **فونت متن** | [Vazirmatn](https://fonts.google.com/specimen/Vazirmatn) (300–800) |
| **فونت عناوین** | [Lalezar](https://fonts.google.com/specimen/Lalezar) |

## 🗂 ساختار فایل‌ها

```
Nakhl-restaurant/
├── index.html                       ← Redirect به صفحه‌ی اصلی
│
├── صفحه اصلی نخل.dc.html           ← لندینگ پیج (هیرو پارالاکس)
├── منوی نخل.dc.html                ← منو + سبد خرید + نظرات
├── رزرو میز.dc.html                 ← رزرو آنلاین با تقویم شمسی
├── پنل مشتری نخل.dc.html          ← پنل مشتری
├── پنل مدیریت نخل.dc.html         ← پنل ادمین
│
├── nakhl-store.js                   ← Shared State (key: nakhl_store_v3)
├── menu-data.js                     ← داده‌ی ۱۲۶ آیتم منو
├── support.js                       ← Runtime engine
│
└── assets/
    ├── logo.png · hero.jpg
    └── icons/                       ← آیکون‌های دسته‌بندی
```

### لایه‌ی داده

همه‌ی صفحات از یک Store مشترک در `localStorage` (key: `nakhl_store_v3`) استفاده می‌کنند:

```js
{
  items:        [...],   // آیتم‌های منو با قیمت، تخفیف، تعداد سفارش
  cart:         [...],   // سبد خرید
  orders:       [...],   // سفارشات با وضعیت
  comments:     [...],   // نظرات با تأیید
  reservations: [...]    // رزروها
}
```

## 📄 مجوز

MIT — آزادانه استفاده، ویرایش و توزیع کنید.
