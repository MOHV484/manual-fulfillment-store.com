# Manual Fulfillment Store

متجر الكتروني لبيع الخدمات الرقمية (شحن ألعاب، اشتراكات) بنظام التسليم اليدوي المُدار بواجهة إدارة كاملة.

## Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS  |
| Backend  | Express + TypeScript                    |
| Database | Supabase (PostgreSQL + Auth + Storage)  |
| Auth     | Supabase JWT (verified server-side)     |

---

## Setup

### 1. Supabase

1. أنشئ مشروع جديد على [supabase.com](https://supabase.com).
2. شغّل السكريبتات بالترتيب في **SQL Editor**:
   - `backend/migrations/001_init_schema.sql`
   - `backend/migrations/002_row_level_security.sql`
3. في **Storage → Buckets** أنشئ bucket اسمه `receipts` واضبطه على **Private**.
4. عشان تعمل أول حساب `super_admin`:
   - سجّل دخول عادي عبر الموقع.
   - افتح **Table Editor → users** وعدّل الصف الخاص بك يدويًا: غيّر `role` إلى `super_admin`.
   - من هناك تقدر تضيف مشرفين من داخل لوحة التحكم.

---

### 2. Backend (`/backend`)

```bash
cd backend
cp .env.example .env
# عدّل القيم في .env
npm install
npm run dev
```

**متغيرات `.env` المطلوبة:**

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=same-jwt-secret-as-supabase-project
CLIENT_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3000
RECEIPTS_BUCKET=receipts
RECEIPT_SIGNED_URL_TTL=300
```

---

### 3. Frontend (`/frontend`)

```bash
cd frontend
cp .env.local.example .env.local
# عدّل القيم في .env.local
npm install
npm run dev
```

**متغيرات `.env.local` المطلوبة:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Pages & Features

### Client
| Route | Description |
|-------|-------------|
| `/` | الصفحة الرئيسية |
| `/products` | تصفح الخدمات المتاحة |
| `/orders` | طلباتي |
| `/wallet` | رصيد المحفظة |
| `/login` | تسجيل الدخول / إنشاء حساب |

### Admin (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | لوحة التحكم الرئيسية |
| `/admin/orders` | قائمة الطلبات (حجز + تنفيذ + رفض) |
| `/admin/orders/[id]` | تفاصيل الطلب وعرض الإيصال |
| `/admin/products` | إدارة الخدمات والأسعار |
| `/admin/moderators` | إضافة/تعطيل المشرفين |
| `/admin/analytics` | إحصائيات المبيعات |
| `/admin/audit-logs` | سجل العمليات |

---

## Security

- **RLS (Row Level Security):** كل جدول محمي بسياسات Supabase — المستخدم يشوف طلباته فقط.
- **Private Storage:** bucket الإيصالات خاص تمامًا؛ لا يوجد رابط عام — فقط Signed URLs مؤقتة (5 دقائق).
- **Magic-byte validation:** نتحقق من bytes الملف الفعلية مش الامتداد أو Content-Type.
- **Rate Limiting:** حد عام 200 طلب/15 دقيقة؛ وحد أصعب 20 عملية/15 دقيقة على العمليات الحساسة (رفع طلب، رفضه، ضبط الرصيد، إضافة مشرف).
- **Zod Validation:** كل body مُدخل يمر على schema تتحقق من الأنواع والحدود وتحذف الحقول الزيادة.
- **Password Policy (مشرفين):** 10 أحرف على الأقل + حرف كبير + حرف صغير + رقم.
- **Helmet + CORS:** Headers أمنية ومنع الطلبات من origins غير مصرح بها.
- **No stack traces in production:** الـ error handler يُخفي التفاصيل الداخلية في الـ production.
- **Audit Logs:** كل عملية حساسة (حجز طلب، تنفيذ، رفض، تعديل رصيد) تُسجَّل مع IP وهوية المشرف.
