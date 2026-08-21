export type RecallStatus = 'ON_TRACK' | 'DUE_SOON' | 'OVERDUE' | 'NEW'

export type MockPatient = {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthDate: string
  registeredDate: string
  lastVisitDate: string | null
  nextAppointmentDate: string | null
  nextAppointmentLabel: string | null
  balance: number
  allergyNote: string | null
  recallStatus: RecallStatus
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function offsetDate(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function classifyRecall(daysSinceVisit: number | null): RecallStatus {
  if (daysSinceVisit === null) return 'NEW'
  if (daysSinceVisit >= 210) return 'OVERDUE'
  if (daysSinceVisit >= 165) return 'DUE_SOON'
  return 'ON_TRACK'
}

type SeedPatient = {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthDate: string
  registeredDaysAgo: number
  lastVisitDaysAgo: number | null
  nextAppointmentInDays: number | null
  nextAppointmentLabel: string | null
  balance: number
  allergyNote: string | null
}

const seedPatients: SeedPatient[] = [
  { id: 'pt1', firstName: 'สมชาย', lastName: 'ใจดี', phone: '081-000-1111', birthDate: '1985-03-12', registeredDaysAgo: 400, lastVisitDaysAgo: 10, nextAppointmentInDays: 5, nextAppointmentLabel: 'ตรวจสุขภาพฟัน', balance: 0, allergyNote: null },
  { id: 'pt2', firstName: 'อรุณี', lastName: 'พงษ์เจริญ', phone: '089-111-2222', birthDate: '1990-07-22', registeredDaysAgo: 500, lastVisitDaysAgo: 45, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
  { id: 'pt3', firstName: 'กิตติพงษ์', lastName: 'ศรีสุข', phone: '089-222-3333', birthDate: '1978-11-02', registeredDaysAgo: 600, lastVisitDaysAgo: 170, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 800, allergyNote: null },
  { id: 'pt4', firstName: 'ปิยะดา', lastName: 'แสงทอง', phone: '089-444-5555', birthDate: '1995-01-30', registeredDaysAgo: 300, lastVisitDaysAgo: 220, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
  { id: 'pt5', firstName: 'ธีรพงศ์', lastName: 'รุ่งเรือง', phone: '089-555-6666', birthDate: '1982-09-18', registeredDaysAgo: 250, lastVisitDaysAgo: 5, nextAppointmentInDays: 14, nextAppointmentLabel: 'รักษารากฟัน (ต่อเนื่อง)', balance: 0, allergyNote: null },
  { id: 'pt6', firstName: 'นภัสสร', lastName: 'ทองดี', phone: '089-666-7777', birthDate: '1999-05-09', registeredDaysAgo: 200, lastVisitDaysAgo: 60, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 1500, allergyNote: 'แพ้ยาชา Lidocaine' },
  { id: 'pt7', firstName: 'ประสิทธิ์', lastName: 'ดีมาก', phone: '089-777-8888', birthDate: '1975-12-25', registeredDaysAgo: 800, lastVisitDaysAgo: 300, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
  { id: 'pt8', firstName: 'วารี', lastName: 'ใจงาม', phone: '089-888-9999', birthDate: '1993-04-14', registeredDaysAgo: 3, lastVisitDaysAgo: null, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
  { id: 'pt9', firstName: 'รัตนา', lastName: 'ชูเกียรติ', phone: '089-999-0000', birthDate: '1988-08-08', registeredDaysAgo: 350, lastVisitDaysAgo: 15, nextAppointmentInDays: 1, nextAppointmentLabel: 'ขูดหินปูน', balance: 0, allergyNote: null },
  { id: 'pt10', firstName: 'มานี', lastName: 'มีสุข', phone: '088-111-2222', birthDate: '1991-02-27', registeredDaysAgo: 420, lastVisitDaysAgo: 190, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
  { id: 'pt11', firstName: 'ชัยวัฒน์', lastName: 'บุญมี', phone: '088-222-3333', birthDate: '1980-06-19', registeredDaysAgo: 700, lastVisitDaysAgo: 30, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 2200, allergyNote: null },
  { id: 'pt12', firstName: 'สุนิสา', lastName: 'อินทร์แก้ว', phone: '088-333-4444', birthDate: '1997-10-05', registeredDaysAgo: 10, lastVisitDaysAgo: null, nextAppointmentInDays: null, nextAppointmentLabel: null, balance: 0, allergyNote: null },
]

export function buildMockPatients(referenceDate: Date = new Date()): MockPatient[] {
  return seedPatients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    phone: p.phone,
    birthDate: p.birthDate,
    registeredDate: toISODate(offsetDate(referenceDate, -p.registeredDaysAgo)),
    lastVisitDate: p.lastVisitDaysAgo === null ? null : toISODate(offsetDate(referenceDate, -p.lastVisitDaysAgo)),
    nextAppointmentDate: p.nextAppointmentInDays === null ? null : toISODate(offsetDate(referenceDate, p.nextAppointmentInDays)),
    nextAppointmentLabel: p.nextAppointmentLabel,
    balance: p.balance,
    allergyNote: p.allergyNote,
    recallStatus: classifyRecall(p.lastVisitDaysAgo),
  }))
}
