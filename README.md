# YSP RUN WITH ME - ระบบสมัครออนไลน์

โครงการ: YSP RUN WITH ME ครั้งที่ 3  
ถ้วยพระราชทานทูลกระหม่อมอุบลรัตนราชกัญญา สิริวัฒนาพรรณวดี  
จัดโดย ชมรม TO BE NUMBER ONE โรงเรียนยโสธรพิทยาคม  

Deployment: [Vercel](https://vercel.com)  
Database: [Supabase](https://supabase.com)  

---

## โครงสร้างระบบ

- **หน้าเว็บ**
  - `/` → Home
  - `/info` → ข้อมูลกิจกรรม
  - `/login` → Login (Google / เลขบัตรประชาชน)
  - `/search` → ตรวจสอบการสมัคร
- **หลัง Login**
  - `/data/add` → Dashboard
  - `/data/applicant` → กรอกข้อมูลผู้สมัคร
  - `/data/app` → สมัครวิ่ง
  - `/data/vip` → สมัคร VIP
  - `/data/payment` → อัปโหลดชำระเงิน

---

## การติดตั้ง

### 1. Clone Project
```bash
git clone <your_repo_url>
cd ysprun_v3_project
```

หรือแตกไฟล์ zip ที่ได้มา

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Supabase
สร้างไฟล์ `.env.local` และใส่ค่า
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Import Database Schema
นำไฟล์ `supabase_schema.sql` ไปสร้างตารางใน Supabase SQL Editor

### 5. รันบนเครื่องทดสอบ
```bash
npm run dev
```
เปิดเว็บ: http://localhost:5173

### 6. Deploy ขึ้น Vercel
```bash
npm run build
vercel deploy --prod
```

---

## วิธีใช้งาน

- ผู้ใช้สามารถ Login ได้ 2 วิธี
  1. **Google Login** (ผ่าน Supabase Auth)
  2. **เลขบัตรประชาชน** → ตรวจสอบกับตาราง `applicants`
- ค้นหาการสมัครได้จากหน้า `/search` โดยกรอกเลขบัตรประชาชน
- ข้อมูลทั้งหมดจะถูกเก็บใน Supabase (ตาราง applicants, app, vip, payments)

---

## โครงสร้างฐานข้อมูล (Supabase)

ไฟล์ `supabase_schema.sql` จะสร้างตาราง:
- `applicants` → ข้อมูลผู้สมัคร
- `app` → สมัครวิ่ง
- `vip` → สมัคร VIP
- `payments` → ชำระเงิน

---

## หมายเหตุ
- ต้องเปิด Supabase Authentication → Google Provider
- สำหรับ Login ด้วยบัตรประชาชน ไม่ต้องสมัคร Auth แค่เช็คตรง `applicants`

