# YSP RUN WITH ME - ระบบสมัครออนไลน์

โครงการ: YSP RUN WITH ME ครั้งที่ 3  
ถ้วยพระราชทานทูลกระหม่อมอุบลรัตนราชกัญญา สิริวัฒนาพรรณวดี  
จัดโดย ชมรม TO BE NUMBER ONE โรงเรียนยโสธรพิทยาคม  

Deployment: [Vercel](https://vercel.com)  
Database: [Supabase](https://supabase.com)  

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

## หมายเหตุ
- ต้องเปิด Supabase Authentication → Google Provider
- สำหรับ Login ด้วยบัตรประชาชน ไม่ต้องสมัคร Auth แค่เช็คตรง `applicants`