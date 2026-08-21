export type Specialty = 'ทันตกรรมทั่วไป' | 'ทันตกรรมจัดฟัน' | 'ศัลยกรรมช่องปาก'

export type ReferenceDentist = {
  id: string
  name: string
  initial: string
  specialty: Specialty
  phone: string
  startTime: string
  endTime: string
}

export const dentists: ReferenceDentist[] = [
  { id: 'dt1', name: 'ทพ. วิชัย เก่งกล้า', initial: 'ว', specialty: 'ทันตกรรมทั่วไป', phone: '081-234-5671', startTime: '08:00', endTime: '17:00' },
  { id: 'dt2', name: 'ทพญ. สมหญิง รักดี', initial: 'ส', specialty: 'ทันตกรรมจัดฟัน', phone: '081-234-5672', startTime: '09:00', endTime: '18:00' },
  { id: 'dt3', name: 'ทพ. อนันต์ พงศ์ไพบูลย์', initial: 'อ', specialty: 'ศัลยกรรมช่องปาก', phone: '081-234-5673', startTime: '11:00', endTime: '19:00' },
]

export type ReferenceService = {
  id: string
  name: string
  durationMin: number
  price: number
  specialties: Specialty[]
}

export const services: ReferenceService[] = [
  { id: 'sv1', name: 'ตรวจสุขภาพฟัน', durationMin: 30, price: 300, specialties: ['ทันตกรรมทั่วไป', 'ทันตกรรมจัดฟัน'] },
  { id: 'sv2', name: 'ขูดหินปูน', durationMin: 30, price: 600, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv3', name: 'อุดฟัน', durationMin: 45, price: 800, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv4', name: 'เคลือบฟลูออไรด์', durationMin: 20, price: 400, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv5', name: 'ถอนฟัน', durationMin: 30, price: 700, specialties: ['ทันตกรรมทั่วไป', 'ศัลยกรรมช่องปาก'] },
  { id: 'sv6', name: 'ฟอกสีฟัน', durationMin: 60, price: 3500, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv7', name: 'รักษารากฟัน', durationMin: 60, price: 4500, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv8', name: 'ครอบฟัน', durationMin: 60, price: 8000, specialties: ['ทันตกรรมทั่วไป'] },
  { id: 'sv9', name: 'จัดฟัน (ปรับลวด)', durationMin: 30, price: 1500, specialties: ['ทันตกรรมจัดฟัน'] },
  { id: 'sv10', name: 'ผ่าฟันคุด', durationMin: 60, price: 6000, specialties: ['ศัลยกรรมช่องปาก'] },
]

export function dentistsForService(serviceId: string): ReferenceDentist[] {
  const service = services.find((s) => s.id === serviceId)
  if (!service) return dentists
  return dentists.filter((d) => service.specialties.includes(d.specialty))
}
