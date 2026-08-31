import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// รายการที่คลินิกคัดเลือกไว้จริง (แท็บ "หัตถการที่เลือก" ในชีตราคา) + "ตรวจฟันทั่วไป" ที่เพิ่มเข้ามาเพราะเป็นเหตุผลจองพื้นฐานที่สุด
const services = [
  // ตรวจฟันและเอ็กซเรย์
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'MAIN', name: 'ตรวจฟันทั่วไป', description: null, duration: 30, minPrice: 100, maxPrice: 100 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'ค่าปลอดเชื้อ', description: null, duration: null, minPrice: 100, maxPrice: 100 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'X-ray ฟิล์มเล็ก', description: 'ต่อฟิล์ม', duration: null, minPrice: 200, maxPrice: 200 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'ADD_ON', name: 'X-ray ฟิล์มใหญ่', description: 'ต่อฟิล์ม', duration: null, minPrice: 700, maxPrice: 700 },
  { category: 'ตรวจฟันและเอ็กซเรย์', type: 'MAIN', name: 'X-ray 3 มิติ (CBCT scan)', description: null, duration: 30, minPrice: 3000, maxPrice: 3000 },

  // ทันตกรรมปริทันต์ (โรคเหงือก)
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'ขูดหินปูน', description: null, duration: 45, minPrice: 600, maxPrice: 1500 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'MAIN', name: 'เกลารากฟัน', description: 'ต่อซี่', duration: 45, minPrice: 300, maxPrice: 300 },
  { category: 'ทันตกรรมปริทันต์ (โรคเหงือก)', type: 'PACKAGE', name: 'ขูดหินปูนพร้อมขจัดคราบ', description: null, duration: 60, minPrice: 2000, maxPrice: 2000 },

  // ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'อุดฟันสีเหมือนฟัน', description: 'ต่อด้าน', duration: 45, minPrice: 500, maxPrice: 800 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'อุดฟันอมัลกัม', description: 'ต่อด้าน', duration: 45, minPrice: 500, maxPrice: 800 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'อุดฟันชั่วคราว', description: 'ต่อซี่', duration: null, minPrice: 500, maxPrice: 500 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'MAIN', name: 'เคลือบหลุมร่องฟัน', description: 'Sealant', duration: 30, minPrice: 400, maxPrice: 400 },
  { category: 'ทันตกรรมหัตถการ (อุดฟัน / วีเนียร์)', type: 'ADD_ON', name: 'ใส่แผ่นยางกันน้ำลาย', description: 'Rubber dam', duration: null, minPrice: 200, maxPrice: 200 },

  // ศัลยกรรมภายในช่องปาก
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ถอนฟัน', description: 'ต่อซี่', duration: 30, minPrice: 600, maxPrice: 1500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ถอนฟันยาก (กรอแบ่งฟัน / ถอนฟันคุด)', description: 'ต่อซี่', duration: 60, minPrice: 1000, maxPrice: 2000 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'ผ่าฟันคุด', description: 'ต่อซี่', duration: 60, minPrice: 2000, maxPrice: 4500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'MAIN', name: 'เจาะระบายหนอง', description: 'เริ่มต้น', duration: 30, minPrice: 1500, maxPrice: 1500 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'ADD_ON', name: 'ตัดไหม ตัดลวด (คนไข้นอก)', description: null, duration: null, minPrice: 150, maxPrice: 150 },
  { category: 'ศัลยกรรมภายในช่องปาก', type: 'ADD_ON', name: 'ล้างแผลในช่องปาก (คนไข้นอก)', description: null, duration: null, minPrice: 150, maxPrice: 150 },

  // ทันตกรรมรักษารากฟัน
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันหน้า', description: 'ต่อซี่', duration: 90, minPrice: 6500, maxPrice: 7500 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันกรามน้อย', description: 'ต่อซี่', duration: 90, minPrice: 8500, maxPrice: 9500 },
  { category: 'ทันตกรรมรักษารากฟัน', type: 'MAIN', name: 'รักษารากฟันกรามใหญ่', description: 'ต่อซี่', duration: 120, minPrice: 11500, maxPrice: 11500 },

  // ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันกึ่งชั่วคราวสีเหมือนฟัน', description: 'ต่อซี่', duration: 90, minPrice: 8000, maxPrice: 10000 },
  { category: 'ทันตกรรมประดิษฐ์แบบติดแน่น (ครอบฟัน สะพานฟัน)', type: 'MAIN', name: 'ครอบฟันสีเหมือนฟัน เซรามิกล้วน', description: 'ต่อซี่', duration: 90, minPrice: 15000, maxPrice: 18000 },

  // ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมทั้งปาก ฐานอะคริลิค', description: 'ต่อขากรรไกร', duration: 120, minPrice: 12000, maxPrice: 15000 },
  { category: 'ทันตกรรมประดิษฐ์แบบถอดได้ (ฟันปลอมถอดได้)', type: 'MAIN', name: 'ฟันปลอมบางส่วน ฐานอะคริลิค (TP)', description: 'ฟัน 1 ซี่', duration: 90, minPrice: 3000, maxPrice: 3000 },

  // ทันตกรรมรากเทียม
  { category: 'ทันตกรรมรากเทียม', type: 'PACKAGE', name: 'รากเทียมพร้อมครอบฟัน', description: 'เริ่มต้น', duration: 120, minPrice: 35000, maxPrice: 35000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ปลูกกระดูก', description: 'เริ่มต้น ขึ้นกับปริมาณกระดูกและวิธีที่ใช้', duration: 90, minPrice: 5000, maxPrice: 5000 },
  { category: 'ทันตกรรมรากเทียม', type: 'ADD_ON', name: 'ใส่เนื้อเยื่อ', description: 'เริ่มต้น', duration: null, minPrice: 5000, maxPrice: 5000 },
  { category: 'ทันตกรรมรากเทียม', type: 'ADD_ON', name: 'ยึดส่วนประกอบของรากเทียม (คนไข้นอก)', description: null, duration: null, minPrice: 1000, maxPrice: 3000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ยกไซนัส', description: 'Sinus lift เริ่มต้น', duration: 90, minPrice: 10000, maxPrice: 10000 },
  { category: 'ทันตกรรมรากเทียม', type: 'MAIN', name: 'ปลูกเหงือก', description: 'Gum graft เริ่มต้น', duration: 60, minPrice: 4000, maxPrice: 4000 },
]

async function main() {
  const keepNames = services.map((s) => s.name)

  const removed = await prisma.service.deleteMany({ where: { name: { notIn: keepNames } } })

  for (const s of services) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    })
  }

  console.log(`เก็บไว้/อัปเดต ${services.length} รายการ, ลบรายการที่ไม่อยู่ในลิสต์ออก ${removed.count} รายการ`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
