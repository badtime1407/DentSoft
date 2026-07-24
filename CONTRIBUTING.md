# DentSoft — คู่มือสำหรับทีม

> โปรเจคนี้เป็นระบบจัดการคลินิกทันตกรรม สำหรับโปรเจคจบการศึกษา
> ที่ปรึกษา: อาจารย์เมธยา ราชคมน์

---

## 👥 ทีม

| รหัส | ชื่อ | หน้าที่ |
|---|---|---|
| 67022513 | กัลย์ธรินทร์ พรีทัตเวชกุล | - |
| 67023660 | ปฏิภาณ กันต์นิกูล | - |
| 67022603 | ณัฏฐกิตติ์ กล่อมจิต | - |

---

## 🚀 วิธี Setup โปรเจค

### 1. Clone โปรเจค
```bash
git clone https://github.com/badtime1407/DentSoft.git
cd DentSoft
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. สร้างไฟล์ `.env`
สร้างไฟล์ `.env` ที่ root แล้วขอค่าจากเจ้าของโปรเจค
```env
DATABASE_URL="..."
DIRECT_URL="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."
RESEND_API_KEY="..."
```

### 4. รัน Development Server
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 📁 โครงสร้างโปรเจค

```
DENTSOFT/
├── app/
│   ├── (auth)/          ← หน้า Login, Register, Forgot/Reset Password (ห้ามแก้ Logic)
│   ├── (admin)/         ← หน้าสำหรับ Admin (แก้ได้)
│   ├── (dentist)/       ← หน้าสำหรับ Dentist (แก้ได้)
│   ├── (patient)/       ← หน้าสำหรับ Patient (แก้ได้)
│   ├── api/             ← API Routes (ห้ามแก้)
│   ├── layout.tsx       ← Root Layout (ห้ามแก้)
│   └── page.tsx         ← Landing Page (แก้ได้)
├── components/
│   ├── layouts/         ← Navbar, Footer, SessionProvider (แก้ได้)
│   └── ui/              ← UI Components (แก้ได้)
├── lib/
│   ├── auth.ts          ← NextAuth config (ห้ามแก้)
│   └── prisma.ts        ← Prisma Client (ห้ามแก้)
├── prisma/
│   └── schema.prisma    ← Database Schema (ห้ามแก้)
├── middleware.ts         ← ปิดไว้ชั่วคราว (ห้ามแก้)
└── prisma.config.ts     ← Prisma v7 config (ห้ามแก้)
```

---

## ✅ สิ่งที่ทำเสร็จแล้ว

- [x] Database Schema + Supabase
- [x] Register / Login (Email, Username, Google, Facebook)
- [x] Reset Password ผ่าน Email
- [x] Redirect ตาม Role (PATIENT / DENTIST / ADMIN)
- [x] Middleware ควบคุมสิทธิ์ (ปิดชั่วคราวเพื่อทำ Frontend)
- [x] Landing Page (Demo) — ยังต้องปรับแต่งเพิ่ม
- [x] หน้า Login, Register, Forgot Password, Reset Password

---

## 🔲 สิ่งที่ต้องทำต่อ (Frontend)

### Admin
- [ ] `app/(admin)/dashboard/page.tsx` — ภาพรวมระบบ สถิติ
- [ ] `app/(admin)/dentists/page.tsx` — จัดการทันตแพทย์
- [ ] `app/(admin)/patients/page.tsx` — รายชื่อคนไข้
- [ ] `app/(admin)/appointments/page.tsx` — จัดการนัดหมาย
- [ ] `app/(admin)/reports/page.tsx` — รายงานสถิติ

### Dentist
- [ ] `app/(dentist)/dashboard/page.tsx` — ภาพรวมนัดหมายวันนี้
- [ ] `app/(dentist)/appointments/page.tsx` — รายการนัดหมาย
- [ ] `app/(dentist)/treatment/page.tsx` — บันทึกการรักษา

### Patient
- [ ] `app/(patient)/dashboard/page.tsx` — หน้าหลักคนไข้
- [ ] `app/(patient)/booking/page.tsx` — จองนัดหมาย
- [ ] `app/(patient)/history/page.tsx` — ประวัติการรักษา
- [ ] `app/(patient)/chat/page.tsx` — AI Chatbot

---

## 🚫 ไฟล์ที่ห้ามแก้

- `lib/auth.ts`
- `lib/prisma.ts`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `middleware.ts`
- `app/layout.tsx`
- `app/api/` — ทั้งโฟลเดอร์

---

## 🔐 คู่มือการแก้ไขหน้า Auth

> หน้าพวกนี้มี Logic สำคัญอยู่ข้างใน ให้แก้ได้แค่ **UI/Design เท่านั้น**

### หน้าที่แก้ UI ได้

| ไฟล์ | หน้า |
|---|---|
| `app/(auth)/login/page.tsx` | หน้าเข้าสู่ระบบ |
| `app/(auth)/register/page.tsx` | หน้าสมัครสมาชิก |
| `app/(auth)/forgot-password/page.tsx` | หน้าลืมรหัสผ่าน |
| `app/(auth)/reset-password/page.tsx` | หน้าตั้งรหัสผ่านใหม่ |

### ✅ แก้ได้
- สี, ขนาด, font, spacing
- Layout และจัดวาง element
- เพิ่ม icon หรือรูปภาพ
- ปรับ style ปุ่มและ input
- เพิ่ม animation หรือ transition

### 🚫 ห้ามแก้เด็ดขาด

**Login Page**
```tsx
// ❌ ห้ามแก้
const handleLogin = async () => { ... }
signIn('credentials', { ... })
signIn('google', { ... })
signIn('facebook', { ... })
// ห้ามแก้ชื่อ field: identifier, password
```

**Register Page**
```tsx
// ❌ ห้ามแก้
const handleRegister = async () => { ... }
fetch('/api/users', { ... })
// ห้ามแก้ชื่อ field: firstName, lastName, username, email, password, phone
```

**Forgot Password Page**
```tsx
// ❌ ห้ามแก้
const handleSubmit = async () => { ... }
fetch('/api/auth/reset-password', { ... })
```

**Reset Password Page**
```tsx
// ❌ ห้ามแก้
const handleSubmit = async () => { ... }
fetch('/api/auth/new-password', { ... })
const token = searchParams.get('token')
```

### ⚠️ ข้อควรระวัง
- อย่าลบ `useState`, `useRouter`, `signIn` ออก
- อย่าเปลี่ยนชื่อ `name` ของ input field
- อย่าลบ Error message และ Loading state
- ถ้าไม่แน่ใจให้ถามก่อนแก้

---

## 📝 ข้อตกลงการเขียนโค้ด

### Commit Message
```
feat: เพิ่ม feature ใหม่
fix: แก้ bug
ui: แก้ไข UI/UX
refactor: ปรับโครงสร้างโค้ด
docs: อัปเดตเอกสาร
```

### การตั้งชื่อ Component
- ใช้ **PascalCase** เช่น `PatientDashboard.tsx`
- ใช้ **camelCase** สำหรับตัวแปร เช่น `appointmentList`

### การใช้ Mock Data
ตอนทำ Frontend ให้ใช้ Mock Data ไปก่อน **อย่าเชื่อมต่อ API จริง**
```tsx
// ✅ ใช้แบบนี้ก่อน
const appointments = [
  { id: 1, date: '2024-08-01', dentist: 'ทพ. สมชาย', service: 'ขูดหินปูน' },
]

// ❌ ยังไม่ต้องทำแบบนี้
const { data } = await fetch('/api/appointments')
```

### Branch
ให้สร้าง branch แยกสำหรับแต่ละ feature
```bash
git checkout -b ui/admin-dashboard
git checkout -b ui/patient-booking
```

---

## 🛠️ Tech Stack

| หมวด | เทคโนโลยี |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| ORM | Prisma v7 |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth.js |
| Email | Resend |

---

## 🔗 Links
- GitHub: `github.com/badtime1407/DentSoft`
- Local: `http://localhost:3000`
