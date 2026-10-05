# 9Lab Review Site: บันทึกงาน

เว็บสำหรับให้ลูกค้า (9Lab) รีวิวงานออกแบบร้านออนไลน์ 3 หน้า:
- **Journey**: แผนภาพเส้นทางลูกค้า
- **Wireframe**: ทุกหน้าจอ พร้อมโน้ต
- **Prototype**: กดเล่นได้เหมือนเว็บจริง

เนื้อหาบนเว็บเป็นภาษาอังกฤษทั้งหมด ข้อมูลตั้งต้นจากลูกค้าอยู่ที่ `9Lab Website .pdf`

## วิธีใช้งาน
```bash
npm install
npm run build:html   # src/*.html → public/{wireframe,prototype}.<lang>.html (4 ภาษา + ระบบซูมให้ WF)
npm run dev          # ดูบนเครื่อง http://localhost:3000
npm run build        # static export → โฟลเดอร์ out/ (อัปขึ้น Vercel หรือ host ไหนก็ได้)
```

**Deploy:** Vercel project `9lab-prototype` ต่อกับ GitHub แล้ว push ขึ้น `main` = deploy อัตโนมัติ → https://9lab-prototype.vercel.app
`vercel.json` ส่ง `/wireframe.<lang>.html` ไปที่ `/wireframe.<lang>` เพราะ Vercel ตัด `.html` ออกจาก URL ของไฟล์ static (ถ้าไม่มีจะ 404)
```bash
```

## หลายภาษา (EN · ไทย · 繁中 · 简中)
- ลิงก์แยกตามภาษา: `/en/` `/th/` `/zh-hant/` `/zh-hans/` ส่วน `/` จะพาไปภาษาตามเบราว์เซอร์ และมีปุ่มสลับภาษาที่แถบบน
- **ต้นฉบับเป็นภาษาอังกฤษเสมอ** (`src/*.html`, `app/data.ts`, ข้อความใน `t('…')`)
- คำแปลอยู่ที่ `i18n/th.json` และ `i18n/zh-Hant.json` (ข้อความอังกฤษ → คำแปล) ใช้ร่วมกันทั้ง WF, Proto และหน้าเว็บ
- `i18n/zh-Hans.json` **สร้างอัตโนมัติ**จาก zh-Hant ด้วย OpenCC (`scripts/zh-hans.mjs`) ห้ามแก้ไฟล์นี้ด้วยมือ
- `i18n/keep.json` = ข้อความที่คงเป็นอังกฤษทุกภาษา (ชื่อสินค้า, โค้ดคูปอง, ชื่อตัวอย่าง, คำค้นตัวอย่าง)
- **แก้หรือเพิ่มข้อความอังกฤษ แล้วรัน `npm run build:html`:** ถ้ามีข้อความที่ยังไม่ได้แปล build จะหยุดและเขียนรายการไว้ที่ `i18n/missing.json` ให้เพิ่มคำแปลลงใน th.json และ zh-Hant.json (หรือใส่ใน keep.json) แล้วรันใหม่
- ศัพท์ภาษาจีนใช้ตามที่ลูกค้าใช้ในรูปตัวอย่างใน PDF (會員專區, 我的收藏, 訂單查詢, 超商取貨, 取貨付款 ฯลฯ)

## โครงสร้างไฟล์
| ไฟล์ | หน้าที่ |
|---|---|
| `9Lab Wireframe (offline).html`, `9Lab Prototype (offline).html` | ไฟล์ต้นฉบับจาก designer **ห้ามแก้** ใช้เป็นตัว bundle (JS/CSS/ฟอนต์) |
| `src/wireframe.html`, `src/prototype.html` | **ต้นฉบับที่แก้ได้** (HTML ของหน้า แปลเป็นอังกฤษแล้ว และเพิ่มส่วนที่ขาดแล้ว) |
| `scripts/build.py` | แพ็ก `src/*.html` กลับเข้า bundle, ใส่ระบบซูม/แพนแบบ Figma ให้ WF, และเช็กว่าไม่มีภาษาไทยเหลือ |
| `public/*.<lang>.html` | ไฟล์ที่ build ได้ (ไม่ต้องแก้ด้วยมือ) |
| `app/[lang]/` | หน้าเว็บ Next.js แยกตามภาษา: หน้าแรก, `journey/`, `checklist/`, `wireframe/`, `prototype/` |
| `app/Viewer.tsx` | แถบบน (แท็บ + ปุ่มสลับภาษา) + iframe ของ WF/Proto |
| `app/i18n.ts` | รายชื่อภาษา + ฟังก์ชัน `t()` |
| `i18n/` | ไฟล์คำแปล (ดูหัวข้อหลายภาษา) |
| `app/data.ts` | เนื้อหาทั้งหมด (ภาษาอังกฤษ): `STAGES` + `LOOPS` (Journey), `BRIEF` (checklist เทียบกับ PDF), `ADDED`, `QUESTIONS` (ใช้ทั้ง Journey และ Checklist), `FEATURES`, `SERVICES` (บริการที่แนะนำพร้อมแหล่งที่มา) |

> ⚠️ ถ้า designer ส่ง WF หรือ Proto เวอร์ชันใหม่มา **อย่าเอาไปทับเฉยๆ** ต้องเอาส่วนที่เปลี่ยนมารวมกับ `src/*.html` ไม่งั้นงานที่เพิ่มไว้ข้างล่างจะหาย
> ถ้าแก้เนื้อหาใน WF ให้แก้ `Journey.tsx` ตามด้วย เพราะข้อความซ้ำกัน

## สิ่งที่ทำแล้ว
### ตัวเว็บ
- เว็บ Next.js (static export) รวม WF + Proto ไว้ที่เดียว มีแถบสลับ Journey / Wireframe / Prototype
- แปล WF (186 ข้อความ) และ Proto จากไทยเป็นอังกฤษทั้งหมด
- WF ซูม/แพนแบบ Figma:
  - ลากเพื่อเลื่อน, scroll เพื่อแพน, Ctrl/⌘ + scroll หรือ pinch เพื่อซูม
  - ปุ่ม − / + / Fit / 100% และคีย์ลัด `+` `-` `0` `1`
  - ลิงก์ `#sX-Y` บินไปหน้าจอนั้น
- หน้า Customer Journey:
  - 7 ช่วง มีทางเลือก (OR) และป้าย Pending decision
  - Animation เส้นประวิ่ง และปุ่ม ▶ Play journey
  - ไม่มีป้าย Pending decision ในหน้า Journey (ตัดออกตามที่ผู้ใช้ขอ 2026-10-05) ป้ายยังอยู่ใน WF และ Checklist
  - ส่วน Questions for 9Lab และส่วน Loops
  - ใช้บนมือถือได้

### เพิ่มจาก PDF ที่ยังไม่มีใน WF/Proto
| เรื่อง (หน้า PDF) | WF | Proto |
|---|---|---|
| Currency TWD ในเมนู (6): แสดงเป็นข้อความ เพราะมีสกุลเดียว | 2.1 | ✓ |
| ปุ่ม Back to top (13): ปุ่มเดี่ยว โผล่หลังเลื่อนลง | 4.1 | ✓ |
| Cancel order ก่อนส่งของ (8) | 3.6 | ✓ |
| Footer + ข้อความกันโกง 165 (10–11) | 1.2 | มีอยู่แล้ว |
| Purchase notice + ติ๊กรับข่าวสาร (ไม่บังคับ) (22) | 1.9 | ✓ |
| guest → สร้างสมาชิกอัตโนมัติจากเบอร์ + SMS (12, 23) | 1.8, 1.10 | ✓ แบนเนอร์ในหน้า complete |
| คืนสินค้า / store credit (23) | 3.6 | ✓ |
| เมนู Members แอดมินเพิ่มรายการได้ (7) | 3.1 | – |
| เวอร์ชัน PC (13) | 4.5 การ์ดจองที่ | – |

### ปรับให้ตรงกับ ECPay (金流 + 綠界物流)
- **1.6:** ส่งผ่าน ECPay Logistics · ส่งถึงบ้านใช้ T-Cat / 中華郵政 · ค่าส่งต่อชิ้น แอดมินตั้งเองได้
- **1.7:** เลือกร้านผ่าน **e-map ทางการของ 7-ELEVEN ที่เปิดผ่าน ECPay** แล้วกลับมาพร้อมชื่อและรหัสสาขา (Proto จำลองหน้านี้)
- **1.9:** ชำระผ่าน ECPay · Apple Pay แสดงเฉพาะ Safari/iOS · ATM ไม่โอนตามเวลา → ยกเลิกอัตโนมัติ · e-invoice ออกผ่าน ECPay
- **3.6:** เส้นสถานะ 5 ขั้น (Ordered → Preparing → Shipping → Arrived at store → Picked up) อัปเดตจาก ECPay · คืนสินค้าที่ 7-ELEVEN (B2C NT$55)

#### หน้า Brief checklist (`/checklist`)
- ทุกข้อใน PDF (55 ข้อ) เปิด PDF เทียบกับข้อความใน WF ทีละหน้าแล้ว (2026-10-05) แบ่งสถานะ: Done 42 · Adjusted 3 · Needs your input 7 · Not yet in WF 3 (กดกรองตามสถานะได้)
- หมายเหตุ: "Done" หมายถึงมีใน **WF** ยังไม่ได้ไล่เช็ก Prototype ทุกข้อ
- ส่วน Added by us, Questions for 9Lab (12 ข้อ), Features ของระบบ (8 กลุ่ม), Recommended services
- Recommended services: Payment = ECPay AIO · Delivery = ECPay Logistics B2C · E-invoice = ECPay B2C · Sign in = มือถือ + SMS และ LINE Login · LINE OA + Messaging API ทุกการ์ดมีลิงก์แหล่งที่มา (ตัดการ์ด Store platform ออกตามที่ผู้ใช้ขอ 2026-10-05)

### เพิ่มจุดที่ขาด (WF + Proto)
- 1.2 ส่วน More info (Corporate purchase / Wedding gift / Stores) (PDF หน้า 2)
- 3.3 แยกนามสกุล / ชื่อ · ที่อยู่ (ประเทศ → เมือง → เขต → ถนน) · Membership Terms (PDF หน้า 9)
- 1.5 Rewards from this order: แต้ม (1 แต้มต่อ NT$100), store credit, คูปอง (PDF หน้า 16)

## สิ่งที่แก้หลังรีวิว
- ตัดปุ่ม Chat ออก เพราะซ้ำกับ LINE OA
- ทำ Back to top เป็นปุ่มเดี่ยว
- Currency เปลี่ยนจากดรอปดาวน์เป็นข้อความ

## ตัดสินใจแล้ว
- **ชำระเงินก่อนเท่านั้น ไม่มีเก็บเงินปลายทาง (取貨付款)** — ยืนยันโดยลูกค้า 2026-10-05 (ATM ไม่โอนตามกำหนด → ยกเลิกอัตโนมัติ · พัสดุไม่มีคนรับ → คืนเงิน ไม่ใช่ blacklist)
- **Login ด้วยรหัส SMS อย่างเดียว ไม่มีรหัสผ่าน** — เราแนะนำเพราะง่าย ลูกค้าไม่ต้องจำ (2026-10-05) แก้ WF/Proto 3.2 และ 1.10 แล้ว
- **ตัดคำถามออกตามที่ผู้ใช้ขอ (2026-10-05):** ความยินยอม PDPA ตอนสร้างสมาชิกอัตโนมัติ · Notify me / Favorites ไม่ต้อง login · ขอบเขตเวอร์ชัน PC · อายุสินค้าในตะกร้า (ข้อใน checklist ที่เกี่ยวข้องยังคงสถานะเดิม)

## รอลูกค้าตัดสินใจ (ตรงกับ Questions for 9Lab ในหน้า Journey/Checklist)
1. เปิด FamilyMart / Hi-Life ด้วยไหม (OK ใช้ได้แค่แบบ C2C) (1.6)
2. ECPay ไม่มี LINE Pay: จะเซ็นสัญญากับ LINE Pay แยก หรือตัดออก (ECPay มี JKOPAY / TWQR / BNPL ให้แทนได้) (1.9)
3. พัสดุที่ชำระแล้วแต่ไม่มีคนมารับภายใน 5 วัน: คืนเงินเต็มหรือหักค่าส่ง คืนเข้าบัตรหรือเป็น store credit (ATM ที่ไม่โอนตามกำหนดยกเลิกอัตโนมัติ ไม่มีเงินต้องคืน) (3.6)
4. ค่าส่งคืน NT$55 ใครจ่าย และคืนเงินเข้าบัตรหรือเป็น store credit (3.6)
5. ภาษาเริ่มต้นของเว็บจริงเป็น 繁體中文 ไหม (2.1)
6. ปุ่ม Chat ใน PDF หมายถึงฟอร์มฝากข้อความในเว็บหรือเปล่า (ตัดออกไปแล้วเพราะซ้ำกับ LINE) (4.1)

## ข้อมูลจาก ECPay API skill (https://github.com/ECPay/ecpay-api-skill)
- **LINE Pay: ECPay ไม่มี** วิธีจ่ายที่ ECPay มี: Credit (รวมผ่อน/ตัดรายงวด), ATM (หมดอายุ 1–60 วัน ค่าเริ่มต้น 7), 超商代碼, 條碼, WebATM, Apple Pay, TWQR, BNPL (ยอด ≥ NT$3,000), WeiXin, DigitalPayment (街口 JKOPAY / iPASS) → ถ้าต้องการ LINE Pay ต้องเซ็นสัญญากับ LINE Pay แยกเอง
- **取貨付款: ECPay รองรับ** (`IsCollection=Y`) ยอดสูงสุด NT$20,000 แต่ลูกค้าเลือก**ไม่ใช้** (ชำระก่อนเท่านั้น)
- **คืนสินค้า:** มี API คืนผ่าน 7-ELEVEN B2C (`/express/ReturnUniMartCVS`), FamilyMart, Hi-Life และส่งคืนถึงบ้าน
- **e-invoice:** รองรับครบทั้ง 4 แบบใน WF 1.9 (Member carrier = 綠界載具, Mobile barcode, Tax ID, Donate ต้องกรอก love code 7 หลัก)
- **ติดตั้ง skill แล้ว** ที่ `~/.claude/skills/ecpay` (v3.4, 2026-10-05) ใช้ได้ทุกโปรเจกต์ เรียกด้วย `/ecpay` · อัปเดตด้วย `git -C ~/.claude/skills/ecpay pull`

## ต้องเช็กเอง
- เว็บรีวิวยัง **ไม่มีรหัสผ่าน** ใครได้ลิงก์ก็เปิดได้ (ตั้ง noindex แล้ว) ถ้าต้องการให้เป็นส่วนตัว ใช้ Vercel password protection

## ยังไม่ได้ทำ
- ออกแบบหน้าจอเวอร์ชัน PC ทั้งชุด
- หน้าเนื้อหา About us / Customer info / FAQ (ใน Proto แสดงเป็น toast "not in prototype")
