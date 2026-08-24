import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ราคาจาก "หัตถการทั้งหมด" ของคลินิก (บาท) — min/max เพราะราคาจริงขึ้นกับอาการที่หมอตรวจ
const services = [
  // ตรวจฟันและเอ็กซเรย์
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'MAIN', name: 'ตรวจฟันทั่วไป', description: 'รวมค่าปลอดเชื้อ', duration: 30, minPrice: 100, maxPrice: 100 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'X-ray ฟิล์มเล็ก', description: 'ต่อฟิล์ม', duration: null, minPrice: 200, maxPrice: 200 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'X-ray ฟิล์มใหญ่', description: 'ต่อฟิล์ม', duration: null, minPrice: 700, maxPrice: 700 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'MAIN', name: 'X-ray 3 มิติ (CBCT scan)', description: null, duration: 30, minPrice: 3000, maxPrice: 3000 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'ตัดไหม ตัดลวด (คนไข้นอก)', description: null, duration: null, minPrice: 150, maxPrice: 200 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'ล้างแผลในช่องปาก (คนไข้นอก)', description: null, duration: null, minPrice: 150, maxPrice: 150 },

  // ทันตกรรมปริทันต์ (โรคเหงือก)
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'ขูดหินปูน', description: null, duration: 45, minPrice: 600, maxPrice: 1500 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'เกลารากฟัน', description: 'ต่อซี่', duration: 45, minPrice: 300, maxPrice: 300 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'PACKAGE', name: 'เกลารากฟันพร้อมขูดหินปูนเหนือเหงือก', description: null, duration: 60, minPrice: 1000, maxPrice: 1500 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'ADD_ON', name: 'ขจัดคราบ', description: 'Polishing', duration: null, minPrice: 1000, maxPrice: 1000 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'PACKAGE', name: 'ขูดหินปูนพร้อมขจัดคราบ', description: null, duration: 60, minPrice: 2000, maxPrice: 2000 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'ตัดเหงือก', description: 'Gingivectomy ต่อซี่', duration: 45, minPrice: 500, maxPrice: 1500 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'ผ่าตัดเพิ่มความยาวตัวฟัน', description: 'Crown lengthening ต่อซี่', duration: 60, minPrice: 2500, maxPrice: 4000 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'ตัดแต่งเนื้อเยื่อยึด', description: 'Frenectomy', duration: 45, minPrice: 1500, maxPrice: 3000 },

  // ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'อุดฟันสีเหมือนฟัน', description: 'ต่อด้าน', duration: 45, minPrice: 500, maxPrice: 800 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'อุดฟันอมัลกัม', description: 'ต่อด้าน', duration: 45, minPrice: 500, maxPrice: 800 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'อุดปิดช่องห่างระหว่างฟัน', description: null, duration: 45, minPrice: 1500, maxPrice: 4000 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'อุดฟันชั่วคราว', description: 'ต่อซี่', duration: null, minPrice: 500, maxPrice: 500 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'เพิ่มวัสดุรองพื้น (ฟันผุเล็ก)', description: null, duration: null, minPrice: 150, maxPrice: 200 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'เพิ่มวัสดุรองพื้น (ผุใกล้โพรงประสาท)', description: null, duration: null, minPrice: 100, maxPrice: 150 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'ใส่สารลดอาการเสียวฟัน', description: null, duration: null, minPrice: 300, maxPrice: 300 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'ใส่ยาชาเพื่อการอุดฟัน', description: null, duration: null, minPrice: 150, maxPrice: 150 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'เคลือบหลุมร่องฟัน', description: 'Sealant', duration: 30, minPrice: 400, maxPrice: 400 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'PACKAGE', name: 'อุดฟันพร้อมเคลือบหลุมร่องฟัน', description: null, duration: 45, minPrice: 500, maxPrice: 1000 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'ใส่แผ่นยางกันน้ำลาย', description: 'Rubber dam', duration: null, minPrice: 200, maxPrice: 200 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'วีเนียร์', description: 'Ceramic / Porcelain veneer ต่อซี่', duration: 90, minPrice: 8000, maxPrice: 13000 },

  // ทันตกรรมบดเคี้ยว
  { category: 'ทันตกรรมบดเคี้ยว', type: 'MAIN', name: 'Soft splint', description: null, duration: 45, minPrice: 4000, maxPrice: 4000 },
  { category: 'ทันตกรรมบดเคี้ยว', type: 'MAIN', name: 'Hard splint', description: null, duration: 45, minPrice: 5000, maxPrice: 5000 },

  // ศัลยกรรมภายในช่องปาก
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ถอนฟัน', description: 'ต่อซี่', duration: 30, minPrice: 600, maxPrice: 1500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ถอนฟันยาก (กรอแบ่งฟัน / ถอนฟันคุด)', description: 'ต่อซี่', duration: 60, minPrice: 1000, maxPrice: 2000 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ผ่าฟันคุด', description: 'ต่อซี่', duration: 60, minPrice: 2000, maxPrice: 4500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ผ่าฟันฝัง', description: 'ต่อซี่', duration: 90, minPrice: 4000, maxPrice: 7500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'เจาะระบายหนอง', description: 'เริ่มต้น', duration: 30, minPrice: 1500, maxPrice: 1500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ผ่าตัดตกแต่งกระดูก', description: 'เริ่มต้น', duration: 60, minPrice: 2000, maxPrice: 2000 },

  // ทันตกรรมรักษารากฟัน
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันฉุกเฉิน', description: 'ต่อซี่', duration: 60, minPrice: 1500, maxPrice: 3000 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันหน้า', description: 'ต่อซี่', duration: 90, minPrice: 6500, maxPrice: 7500 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันกรามน้อย', description: 'ต่อซี่', duration: 90, minPrice: 8500, maxPrice: 9500 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันกรามใหญ่', description: 'ต่อซี่', duration: 120, minPrice: 11500, maxPrice: 11500 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'ADD_ON', name: 'ใส่วัสดุ MTA bioseal', description: 'ต่อซี่', duration: null, minPrice: 2500, maxPrice: 3000 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'ADD_ON', name: 'รักษารากฟันซ้ำ (ค่าเพิ่ม)', description: 'ต่อซี่', duration: null, minPrice: 1500, maxPrice: 2000 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'ควักหนองปลายราก', description: 'Apicoectomy', duration: 60, minPrice: 2000, maxPrice: 2500 },

  // ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'เดือยฟันสำเร็จรูป / โลหะเหวี่ยง', description: 'ต่อราก', duration: null, minPrice: 3500, maxPrice: 6000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'ก่อแกนฟัน', description: 'Core build-up ต่อซี่', duration: null, minPrice: 2000, maxPrice: 2500 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันกึ่งชั่วคราวสีเหมือนฟัน', description: 'ต่อซี่', duration: 90, minPrice: 8000, maxPrice: 10000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันโลหะธรรมดา', description: 'ต่อซี่', duration: 90, minPrice: 9000, maxPrice: 10000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันโลหะ (Semi precious)', description: 'ต่อซี่', duration: 90, minPrice: 14000, maxPrice: 17000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันโลหะ (High precious)', description: 'ราคาขึ้นกับวัสดุ ณ ปัจจุบัน กรุณาสอบถามหน้าคลินิก', duration: 90, minPrice: 0, maxPrice: 0, isActive: false },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันโลหะธรรมดาเคลือบเซรามิก', description: 'ต่อซี่', duration: 90, minPrice: 10000, maxPrice: 12000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันโลหะ Semi precious เคลือบเซรามิก', description: 'ต่อซี่', duration: 90, minPrice: 14000, maxPrice: 16000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันสีเหมือนฟัน เซรามิกล้วน', description: 'ต่อซี่', duration: 90, minPrice: 15000, maxPrice: 18000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันบางส่วน (Inlay / Onlay / Table top)', description: 'ต่อซี่', duration: 90, minPrice: 10000, maxPrice: 12000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'สะพานฟัน', description: 'ต่อ Unit', duration: 120, minPrice: 10000, maxPrice: 15000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'ยึดครอบฟันชั่วคราว (คนไข้นอก)', description: 'ต่อซี่', duration: null, minPrice: 500, maxPrice: 600 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'ยึดครอบฟันถาวร (คนไข้นอก)', description: 'ต่อซี่', duration: null, minPrice: 1000, maxPrice: 1500 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'ทำครอบฟันชั่วคราว (คนไข้นอก)', description: 'ต่อซี่', duration: null, minPrice: 2000, maxPrice: 5500 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'ADD_ON', name: 'รื้อครอบฟัน / สะพานฟัน', description: null, duration: null, minPrice: 1000, maxPrice: 2000 },

  // ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมทั้งปาก ฐานอะคริลิค', description: 'ต่อขากรรไกร', duration: 120, minPrice: 12000, maxPrice: 15000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมบางส่วน ฐานอะคริลิค (TP)', description: 'ฟัน 1 ซี่', duration: 90, minPrice: 3000, maxPrice: 3000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมบางส่วน ฐานโลหะ (RPD)', description: 'ฟัน 1 ซี่', duration: 90, minPrice: 8000, maxPrice: 8000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมบางส่วน ฐานแบบนิ่ม (Valplast)', description: 'ฟัน 1 ซี่', duration: 90, minPrice: 6000, maxPrice: 6500 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'ADD_ON', name: 'เติมฟัน', description: 'ต่อซี่', duration: null, minPrice: 500, maxPrice: 500 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'ADD_ON', name: 'ตะขอโลหะ', description: 'ต่อตะขอ', duration: null, minPrice: 500, maxPrice: 500 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'ADD_ON', name: 'ตะขอสีเหมือนฟัน', description: 'ต่อตะขอ', duration: null, minPrice: 1000, maxPrice: 1000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ซ่อมฟันปลอม', description: 'เริ่มต้น', duration: 45, minPrice: 1500, maxPrice: 1500 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'ADD_ON', name: 'ซี่ฟันปลอม', description: 'ต่อซี่', duration: null, minPrice: 500, maxPrice: 500 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'เสริมฐานฟันเทียม', description: 'Reline ต่อชิ้น', duration: 45, minPrice: 1000, maxPrice: 2000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'เปลี่ยนฐานฟันเทียม', description: 'Rebase ต่อชิ้น', duration: 60, minPrice: 2500, maxPrice: 3000 },

  // ทันตกรรมรากเทียม
  { category: 'ทันตกรรมรากเทียม', type: 'PACKAGE', name: 'รากเทียมพร้อมครอบฟัน', description: 'เริ่มต้น', duration: 120, minPrice: 35000, maxPrice: 35000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ปลูกกระดูก', description: 'เริ่มต้น ขึ้นกับปริมาณกระดูกและวิธีที่ใช้', duration: 90, minPrice: 5000, maxPrice: 5000 },
  { category: 'ทันตกรรมรากเทียม', type: 'ADD_ON', name: 'ใส่เนื้อเยื่อ', description: 'เริ่มต้น', duration: null, minPrice: 5000, maxPrice: 5000 },
  { category: 'ทันตกรรมรากเทียม', type: 'ADD_ON', name: 'ยึดส่วนประกอบของรากเทียม (คนไข้นอก)', description: null, duration: null, minPrice: 1000, maxPrice: 3000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ยกไซนัส', description: 'Sinus lift เริ่มต้น', duration: 90, minPrice: 10000, maxPrice: 10000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ปลูกเหงือก', description: 'Gum graft เริ่มต้น', duration: 60, minPrice: 4000, maxPrice: 4000 },

  // ทันตกรรมสำหรับเด็ก
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'MAIN', name: 'เคลือบฟลูออไรด์', description: null, duration: 30, minPrice: 500, maxPrice: 1000 },
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'MAIN', name: 'ถอนฟันน้ำนม', description: 'ต่อซี่', duration: 30, minPrice: 500, maxPrice: 800 },
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'MAIN', name: 'รักษารากฟันน้ำนม', description: 'ต่อซี่', duration: 60, minPrice: 2500, maxPrice: 4000 },
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'MAIN', name: 'ครอบฟันเด็ก', description: 'ต่อซี่', duration: 60, minPrice: 3500, maxPrice: 4000 },
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'ADD_ON', name: 'ปรับพฤติกรรม', description: null, duration: null, minPrice: 300, maxPrice: 500 },
  { category: 'ทันตกรรมสำหรับเด็ก', type: 'ADD_ON', name: 'ใช้อุปกรณ์พิเศษปรับพฤติกรรม', description: 'เช่น papoose board', duration: null, minPrice: 500, maxPrice: 1000 },

  // อื่น ๆ
  { category: 'อื่น ๆ', type: 'MAIN', name: 'ฟอกสีฟัน', description: 'Cool light ต่อครั้ง', duration: 60, minPrice: 3499, maxPrice: 3499 },
  { category: 'อื่น ๆ', type: 'MAIN', name: 'ถาดฟอกสีฟันที่บ้าน', description: 'Bleaching tray', duration: 30, minPrice: 4000, maxPrice: 4000 },
  { category: 'อื่น ๆ', type: 'ADD_ON', name: 'น้ำยาฟอกสีฟันที่บ้าน', description: 'ต่อหลอด', duration: null, minPrice: 1000, maxPrice: 1000 },
  { category: 'อื่น ๆ', type: 'MAIN', name: 'Retainer คงสภาพฟัน', description: null, duration: 30, minPrice: 4000, maxPrice: 4000 },
  { category: 'อื่น ๆ', type: 'ADD_ON', name: 'ถอดอุปกรณ์ / ขัดคราบกาว', description: null, duration: null, minPrice: 2000, maxPrice: 2000 },
]

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    })
  }
  console.log(`เพิ่ม/อัปเดตบริการทั้งหมด ${services.length} รายการ`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
