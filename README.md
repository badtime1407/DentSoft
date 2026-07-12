# 🦷 DentSoft — Dental Clinic Management System

ระบบจัดการคลินิกทันตกรรม พัฒนาด้วย Next.js 14 สำหรับโปรเจคจบการศึกษา

---

## 👥 ผู้พัฒนา

| รหัสนักศึกษา | ชื่อ-นามสกุล |
|---|---|
| 67022513 | กัลย์ธรินทร์ พรีทัตเวชกุล |
| 67023660 | ปฏิภาณ กันต์นิกูล |
| 67022603 | ณัฏฐกิตติ์ กล่อมจิต |

ที่ปรึกษาโครงการ: **อาจารย์เมธยา ราชคมน์**

---

## 📋 เกี่ยวกับโปรเจค

DentSoft คือระบบบริหารจัดการคลินิกทันตกรรมในรูปแบบ Web Application ที่ช่วยอำนวยความสะดวกให้กับคนไข้ ทันตแพทย์ และผู้ดูแลระบบ ในการจัดการข้อมูลคนไข้ การนัดหมาย และประวัติการรักษา

---

## ✨ Features

### 👤 คนไข้ (Patient)
- สมัครสมาชิกและเข้าสู่ระบบ (Email / Username / Google / Facebook)
- แก้ไขข้อมูลส่วนตัว
- ดูบริการทางทันตกรรมทั้งหมด
- จองนัดหมายโดยเลือกบริการ วัน และเวลา
- ยกเลิกนัดหมาย
- ดูประวัติการรักษาแบบสรุป
- รับการแจ้งเตือนก่อนถึงวันนัดหมาย
- ใช้งานระบบแชท AI เพื่อสอบถามข้อมูลเบื้องต้น

### 🦷 ทันตแพทย์ (Dentist)
- ดูรายการนัดหมายของตนเอง
- ค้นหานัดหมายตามวันและเวลา
- ดูข้อมูลคนไข้ที่เข้ารับบริการ
- บันทึกข้อมูลการรักษา เช่น ฟันที่รักษา ปัญหาที่พบ และแนวทางการรักษา

### ⚙️ ผู้ดูแลระบบ (Admin)
- จัดการบัญชีทันตแพทย์ (เพิ่ม แก้ไข ลบ)
- ดูรายชื่อคนไข้ทั้งหมด
- จัดการตารางการทำงานของทันตแพทย์
- ดูและจัดการนัดหมายทั้งหมด
- แก้ไขสถานะ วัน เวลา หรือทันตแพทย์สำหรับนัดหมาย
- ดูรายงานและสถิติ เช่น จำนวนคนไข้รายเดือน บริการยอดนิยม และรายได้

---

## 🛠️ Tech Stack

| หมวด | เทคโนโลยี |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Deploy | Vercel |

---

## 🚀 การติดตั้งและรันโปรเจค

### 1. Clone โปรเจค

```bash
git clone https://github.com/badtime1407/DentSoft.git
cd DentSoft
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่าไฟล์ `.env`

สร้างไฟล์ `.env` แล้วใส่ค่าดังนี้

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

### 4. Push Schema ขึ้น Database

```bash
npx prisma db push
npx prisma generate
```

### 5. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 📁 โครงสร้างโปรเจค

```
DENTSOFT/
├── app/
│   ├── (auth)/         # Login, Register
│   ├── (patient)/      # หน้าสำหรับคนไข้
│   ├── (dentist)/      # หน้าสำหรับทันตแพทย์
│   ├── (admin)/        # หน้าสำหรับ Admin
│   └── api/            # API Routes
├── components/
│   ├── ui/             # UI Components
│   ├── forms/          # Form Components
│   └── layouts/        # Layout Components
├── lib/
│   ├── prisma.ts       # Prisma Client
│   ├── auth.ts         # NextAuth Config
│   └── utils.ts        # Helper Functions
└── prisma/
    └── schema.prisma   # Database Schema
```

---

## 📄 License

โปรเจคนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น