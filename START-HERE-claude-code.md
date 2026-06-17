# 🚀 เริ่มที่นี่ — นำเว็บ HSK ขึ้นระบบจริงด้วย Claude Code

เอกสารนี้คือ "ใบสั่งงาน" สำหรับ Claude Code เพื่อเปลี่ยนต้นแบบ (prototype) ในโฟลเดอร์นี้
ให้กลายเป็นเว็บแอปที่ใช้งานได้จริง มีระบบสมาชิก/ชำระเงิน และ deploy ขึ้นออนไลน์

> อ่าน `README.md` ในโฟลเดอร์นี้ก่อน — มีรายละเอียดดีไซน์ สี ฟอนต์ ทุกหน้าจอ และข้อมูลคำศัพท์ครบ
> ไฟล์ในโฟลเดอร์นี้เป็น **ต้นแบบอ้างอิง (HTML)** ไม่ใช่โค้ดที่จะนำไปใช้ตรง ๆ สำหรับฟีเจอร์ที่ต้องมี backend

## 🖼 ภาพหน้าจอต้นแบบ (โฟลเดอร์ `screens/`)

ใช้ภาพเหล่านี้เป็นเป้าหมายของหน้าตา (UI reference) ในการสร้างแต่ละหน้า:

| ไฟล์ | หน้าจอ |
|---|---|
| `screens/01-home.png` | หน้าแรก (hero + ค้นหา) |
| `screens/02-levels.png` | การ์ดเลือกระดับ HSK 1-9 (มีล็อกเฉพาะสมาชิก) |
| `screens/03-review.png` | ส่วน "คำศัพท์ที่ยังจำไม่ได้" |
| `screens/04-flashcard.png` | โหมดแฟลชการ์ด |
| `screens/05-quiz.png` | โหมดควิซ (มีตัวเลือก) |
| `screens/06-login.png` | Modal เข้าสู่ระบบ |
| `screens/07-upgrade.png` | Modal อัปเกรดสมาชิก (99 บาท/เดือน) |
| `screens/08-signup.png` | Modal สมัครสมาชิก |
| `screens/09-payment-qr.png` | หน้าชำระเงิน PromptPay QR |
| `screens/10-admin.png` | หน้าจัดการคำศัพท์ (Admin) |

---

## วิธีใช้: คัดลอกพรอมต์ด้านล่างนี้ไปวางใน Claude Code

```
ฉันมีโฟลเดอร์ design_handoff_hsk_vocab_app ที่เป็นต้นแบบเว็บฝึกคำศัพท์ HSK (ภาษาไทย)
ช่วยสร้างเว็บแอปจริงจากต้นแบบนี้ และเตรียมให้ deploy ขึ้นออนไลน์ได้

ขั้นตอน:
1. อ่าน README.md และ START-HERE-claude-code.md ในโฟลเดอร์นั้นให้ครบก่อน
2. ดึงข้อมูลคำศัพท์ทั้งหมดออกจาก `VOCAB = {` ใน "HSK คำศัพท์.dc.html"
   แล้วเก็บเป็นไฟล์ JSON / ตารางในฐานข้อมูล (อย่าฮาร์ดโค้ดไว้ใน frontend)
3. สร้างโปรเจกต์ Next.js (App Router) + TypeScript + Tailwind
   - คงดีไซน์, ฟอนต์, สี, และคำต่าง ๆ (copy) ให้ตรงกับต้นแบบ
   - หน้า: home, flashcard, quiz, admin, และ modal สมาชิก/ชำระเงิน
4. ทำระบบหลังบ้านให้เป็นของจริง (ห้ามเชื่อ flag จากฝั่ง client):
   - Auth: สมัคร/ล็อกอินจริง รหัสผ่านต้อง hash (ใช้ Supabase Auth หรือ Clerk ก็ได้)
   - Membership: เก็บสถานะ/วันหมดอายุในฐานข้อมูล ตรวจสอบฝั่ง server
   - เนื้อหา HSK 3-9 ต้องเสิร์ฟผ่าน API ที่ตรวจสิทธิ์แล้วเท่านั้น
   - ชำระเงิน: ใช้ผู้ให้บริการที่รองรับ PromptPay ในไทย (Omise/Opn หรือ Stripe PromptPay)
     สร้าง charge → แสดง QR จริง → ยืนยันด้วย webhook → อัปเกรดสมาชิกฝั่ง server
   - Admin: ทำเป็น route ที่ต้องล็อกอินเป็นแอดมินเท่านั้น เขียนลงฐานข้อมูล
5. ตั้งค่าให้ deploy ขึ้น Vercel ได้ (อธิบาย .env ที่ต้องใส่)

เริ่มจากวางโครงโปรเจกต์ + ดึงข้อมูลคำศัพท์ก่อน แล้วค่อยทำทีละส่วน
```

---

## Stack ที่แนะนำ (ปรับได้ตามถนัด)

| ส่วน | แนะนำ | ทางเลือก |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Remix, SvelteKit |
| Styling | **Tailwind CSS** (ใส่ token สีจาก README) | CSS Modules |
| ฐานข้อมูล | **Supabase (Postgres)** | PlanetScale, Neon |
| Auth | **Supabase Auth** หรือ **Clerk** | Auth0, Firebase Auth |
| ชำระเงิน (PromptPay) | **Omise/Opn Payments** | Stripe (PromptPay), GB Prime Pay, 2C2P |
| Deploy | **Vercel** | Netlify, Cloudflare |

> ราคาสมาชิก: **99 บาท / เดือน** — ปลดล็อก HSK 3 ถึง 7-9 (HSK 1-2 ฟรี)

---

## ลำดับงานที่แนะนำ (milestones)

1. **ดึงข้อมูลคำศัพท์** จาก `VOCAB` → `data/vocab.json` หรือ seed ลง DB
   (โครงสร้าง: `level → [{ h: ฮั่นจื่อ, p: พินอิน, th: คำแปลไทย }]`)
2. **โครง frontend** — สร้างหน้า home / flashcard / quiz ให้ทำงานกับข้อมูลฟรี (HSK 1-2) ก่อน
3. **Auth** — สมัคร/ล็อกอินจริง
4. **Entitlement + gating** — ล็อก HSK 3-9 หลัง API ที่ตรวจสิทธิ์
5. **Payment** — ต่อ PromptPay จริง + webhook ยืนยัน → ให้สิทธิ์สมาชิก
6. **Admin** — หน้าจัดการคำศัพท์เฉพาะแอดมิน + import/export
7. **(ออปชัน) Sync progress** ของผู้ใช้ขึ้น server ให้ข้ามอุปกรณ์ได้
8. **Deploy** ขึ้น Vercel + ตั้งค่า env + domain

## ตัวแปรแวดล้อม (.env) ที่จะต้องมี (ตัวอย่าง)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # ใช้ฝั่ง server เท่านั้น
OPN_PUBLIC_KEY=                   # Omise/Opn
OPN_SECRET_KEY=
OPN_WEBHOOK_SECRET=
```

## ⚠ จุดสำคัญด้านความปลอดภัย
- ต้นแบบเก็บรหัสผ่าน + สถานะสมาชิกไว้ใน `localStorage` (เพื่อสาธิตเท่านั้น) — **ห้ามทำแบบนั้นจริง**
- การปลดล็อกเนื้อหาต้องตัดสินใจฝั่ง server เสมอ ไม่ใช่ฝั่ง browser
- การให้สิทธิ์สมาชิกต้องเกิดจาก **webhook ยืนยันการจ่ายเงิน** เท่านั้น ไม่ใช่ปุ่ม "ฉันชำระเงินแล้ว"
