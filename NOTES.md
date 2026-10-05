# 9Lab Review Site: บันทึกงาน

เว็บสำหรับให้ลูกค้า (9Lab) รีวิวงานออกแบบร้านออนไลน์ 3 หน้า:
- **Journey**: แผนภาพเส้นทางลูกค้า
- **Wireframe**: ทุกหน้าจอ พร้อมโน้ต
- **Prototype**: กดเล่นได้เหมือนเว็บจริง

เนื้อหาบนเว็บเป็นภาษาอังกฤษทั้งหมด ข้อมูลตั้งต้นจากลูกค้าอยู่ที่ `9Lab Website .pdf`

## วิธีใช้งาน
```bash
npm install
npm run build:html   # src/*.html → public/*.html (แพ็กกลับเข้า bundle + ใส่ระบบซูมให้ WF)
npm run dev          # ดูบนเครื่อง http://localhost:3000
npm run build        # static export → โฟลเดอร์ out/ (อัปขึ้น Vercel หรือ host ไหนก็ได้)
```

## โครงสร้างไฟล์
| ไฟล์ | หน้าที่ |
|---|---|
| `9Lab Wireframe (offline).html`, `9Lab Prototype (offline).html` | ไฟล์ต้นฉบับจาก designer **ห้ามแก้** ใช้เป็นตัว bundle (JS/CSS/ฟอนต์) |
| `src/wireframe.html`, `src/prototype.html` | **ต้นฉบับที่แก้ได้** (HTML ของหน้า แปลเป็นอังกฤษแล้ว และเพิ่มส่วนที่ขาดแล้ว) |
| `scripts/build.py` | แพ็ก `src/*.html` กลับเข้า bundle, ใส่ระบบซูม/แพนแบบ Figma ให้ WF, และเช็กว่าไม่มีภาษาไทยเหลือ |
| `public/*.html` | ไฟล์ที่ build ได้ (ไม่ต้องแก้ด้วยมือ) |
| `app/` | เว็บ Next.js: หน้าแรก, `journey/`, `wireframe/`, `prototype/`, `Viewer.tsx` (แถบบน + iframe) |
| `app/journey/Journey.tsx` | เนื้อหาของ Journey: `STAGES` (ขั้นตอน), `LOOPS` |
| `app/data.ts` | ข้อมูลที่ใช้ร่วมกัน: `BRIEF` (checklist เทียบกับ PDF), `ADDED`, `QUESTIONS` (ใช้ทั้ง Journey และ Checklist), `FEATURES`, `SERVICES` (บริการที่แนะนำพร้อมแหล่งที่มา) |
| `app/checklist/` | หน้า Brief checklist |

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
- ทุกข้อใน PDF (54 ข้อ) จับคู่กับหน้าจอใน WF แบ่ง 5 สถานะ: Done 40 · Adjusted 4 · Added by us 1 · Needs your input 7 · Not yet in WF 2 (กดกรองตามสถานะได้)
- ส่วน Added by us, Questions for 9Lab (12 ข้อ), Features ของระบบ (8 กลุ่ม), Recommended services
- Recommended services: Payment = ECPay AIO · Delivery = ECPay Logistics B2C · E-invoice = ECPay B2C · Sign in = มือถือ + SMS และ LINE Login · LINE OA + Messaging API · Store platform = รอตัดสินใจ (WooCommerce / Shopify / custom) ทุกการ์ดมีลิงก์แหล่งที่มา

## สิ่งที่แก้หลังรีวิว
- ตัดปุ่ม Chat ออก เพราะซ้ำกับ LINE OA
- ทำ Back to top เป็นปุ่มเดี่ยว
- Currency เปลี่ยนจากดรอปดาวน์เป็นข้อความ

## รอลูกค้าตัดสินใจ (ตรงกับ Questions for 9Lab ในหน้า Journey)
1. เปิดจ่ายเงินตอนรับของที่ 7-11 (取貨付款) ไหม หรือจ่ายก่อนอย่างเดียว (1.6)
2. เปิด FamilyMart / Hi-Life / OK ด้วยไหม (1.6)
3. ECPay ไม่มี LINE Pay: จะเซ็นสัญญากับ LINE Pay แยก หรือตัดออก (ECPay มี JKOPAY / TWQR / BNPL ให้แทนได้) (1.9)
4. สร้างสมาชิกอัตโนมัติจากเบอร์ guest ต้องได้รับความยินยอมตาม PDPA ใส่ข้อความยินยอมที่ checkout ได้ไหม (1.8)
5. พัสดุไม่มีคนมารับ / ATM ไม่โอนตามเวลา จะยกเลิกและคืนเงินอย่างไร (3.6)
6. ค่าส่งคืน NT$55 ใครจ่าย และคืนเงินเข้าบัตรหรือเป็น store credit (3.6)
7. Login ด้วย SMS OTP อย่างเดียว ไม่มีรหัสผ่าน ได้ไหม (มีค่า SMS ทุกครั้ง) (3.2)
8. ให้ guest ใช้ Notify me และ Favorites ได้โดยไม่ต้อง login ไหม (2.6)
9. ภาษาเริ่มต้นของเว็บจริงเป็น 繁體中文 ไหม (2.1)
10. เวอร์ชัน PC: ขอบเขตและระยะเวลา (4.5)
11. เก็บสินค้าในตะกร้าได้นานแค่ไหน (1.5)
12. ปุ่ม Chat ใน PDF หมายถึงฟอร์มฝากข้อความในเว็บหรือเปล่า (ตัดออกไปแล้วเพราะซ้ำกับ LINE) (4.1)
13. SMS OTP / การตั้งรหัสผ่าน และจะใช้ผู้ให้บริการ SMS เจ้าไหน (3.2): Pending decision เดิมจาก designer

## ข้อมูลจาก ECPay API skill (https://github.com/ECPay/ecpay-api-skill)
- **LINE Pay: ECPay ไม่มี** วิธีจ่ายที่ ECPay มี: Credit (รวมผ่อน/ตัดรายงวด), ATM (หมดอายุ 1–60 วัน ค่าเริ่มต้น 7), 超商代碼, 條碼, WebATM, Apple Pay, TWQR, BNPL (ยอด ≥ NT$3,000), WeiXin, DigitalPayment (街口 JKOPAY / iPASS) → ถ้าต้องการ LINE Pay ต้องเซ็นสัญญากับ LINE Pay แยกเอง
- **取貨付款: รองรับ** (`IsCollection=Y`) ทั้งร้านสะดวกซื้อและ T-Cat ยอดสูงสุด NT$20,000
- **คืนสินค้า:** มี API คืนผ่าน 7-ELEVEN B2C (`/express/ReturnUniMartCVS`), FamilyMart, Hi-Life และส่งคืนถึงบ้าน
- **e-invoice:** รองรับครบทั้ง 4 แบบใน WF 1.9 (Member carrier = 綠界載具, Mobile barcode, Tax ID, Donate ต้องกรอก love code 7 หลัก)
- **ติดตั้ง skill แล้ว** ที่ `~/.claude/skills/ecpay` (v3.4, 2026-10-05) ใช้ได้ทุกโปรเจกต์ เรียกด้วย `/ecpay` · อัปเดตด้วย `git -C ~/.claude/skills/ecpay pull`

## ต้องเช็กเอง
- เว็บรีวิวยัง **ไม่มีรหัสผ่าน** ใครได้ลิงก์ก็เปิดได้ (ตั้ง noindex แล้ว) ถ้าต้องการให้เป็นส่วนตัว ใช้ Vercel password protection

## ยังไม่ได้ทำ
- **ช่องที่อยู่ในหน้า Member center (3.3)** ที่ PDF หน้า 9 ขอไว้ ยังไม่มีใน WF
- **รางวัลที่ได้จากออเดอร์ (แต้ม / store credit / คูปอง) ในสรุปตะกร้า (1.5)** ที่ PDF หน้า 16 ขอไว้ ยังไม่มีใน WF
- ออกแบบหน้าจอเวอร์ชัน PC ทั้งชุด
- หน้าเนื้อหา About us / Customer info / FAQ (ใน Proto แสดงเป็น toast "not in prototype")
