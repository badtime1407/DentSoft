export type AppointmentStatus = 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'

export type TreatmentNote = {
  toothNumber: string
  diagnosis: string
  treatmentNote: string
  nextVisit: string
}

export type DentistAppointment = {
  id: string
  date: string
  time: string
  patientId: string
  patientName: string
  patientAge: number
  patientPhone: string
  serviceName: string
  durationMin: number
  status: AppointmentStatus
  waitMinutes?: number
  note?: string
  treatment?: TreatmentNote
}

export type PastVisit = {
  date: string
  serviceName: string
  toothNumber?: string
  diagnosis?: string
  treatmentNote?: string
}

// เวลาปัจจุบันจำลอง สำหรับคำนวณเวลารอคิว
export const MOCK_NOW = '11:32'
export const MOCK_TODAY = '2026-08-08'

export const patientHistory: Record<string, PastVisit[]> = {
  p4: [
    { date: '2026-06-12', serviceName: 'จัดฟัน (ปรับลวด)', toothNumber: '-', diagnosis: 'ปรับลวดประจำเดือน', treatmentNote: 'ปรับแรงดึงลวดบนล่าง นัดครั้งถัดไป 4 สัปดาห์' },
    { date: '2026-05-15', serviceName: 'จัดฟัน (ปรับลวด)', toothNumber: '-', diagnosis: 'ปรับลวดประจำเดือน', treatmentNote: 'เปลี่ยนยางรัดสี ไม่มีอาการเจ็บผิดปกติ' },
  ],
  p5: [
    { date: '2026-07-02', serviceName: 'ตรวจสุขภาพฟัน', toothNumber: '36', diagnosis: 'ฟันผุระยะเริ่มต้น', treatmentNote: 'แนะนำให้มาอุดฟันภายใน 2 สัปดาห์' },
  ],
  p1: [
    { date: '2026-04-20', serviceName: 'ขูดหินปูน', diagnosis: 'หินปูนสะสมปานกลาง', treatmentNote: 'ขูดหินปูนทั่วปาก แนะนำแปรงฟันเช้า-เย็น' },
  ],
}

export const initialAppointments: DentistAppointment[] = [
  // วันนี้ (2026-08-08)
  { id: 'a1', date: MOCK_TODAY, time: '08:30', patientId: 'p1', patientName: 'อรุณี พงษ์เจริญ', patientAge: 34, patientPhone: '081-234-5671', serviceName: 'ตรวจสุขภาพฟัน', durationMin: 20, status: 'COMPLETED' },
  { id: 'a2', date: MOCK_TODAY, time: '09:00', patientId: 'p2', patientName: 'กิตติพงษ์ ศรีสุข', patientAge: 41, patientPhone: '081-234-5672', serviceName: 'ขูดหินปูน', durationMin: 30, status: 'COMPLETED' },
  { id: 'a3', date: MOCK_TODAY, time: '09:45', patientId: 'p3', patientName: 'ปิยะดา แสงทอง', patientAge: 27, patientPhone: '081-234-5673', serviceName: 'อุดฟัน', durationMin: 40, status: 'COMPLETED' },
  { id: 'a4', date: MOCK_TODAY, time: '10:30', patientId: 'p4', patientName: 'สุนิสา อินทร์แก้ว', patientAge: 22, patientPhone: '081-234-5674', serviceName: 'จัดฟัน (ปรับลวด)', durationMin: 30, status: 'IN_TREATMENT' },
  { id: 'a5', date: MOCK_TODAY, time: '11:00', patientId: 'p5', patientName: 'ธีรพงศ์ รุ่งเรือง', patientAge: 55, patientPhone: '081-234-5675', serviceName: 'รักษารากฟัน', durationMin: 60, status: 'WAITING', waitMinutes: 32, note: 'คนไข้แจ้งว่าปวดฟันมาตั้งแต่เมื่อคืน' },
  { id: 'a6', date: MOCK_TODAY, time: '11:15', patientId: 'p6', patientName: 'นภัสสร ทองดี', patientAge: 30, patientPhone: '081-234-5676', serviceName: 'ครอบฟัน', durationMin: 45, status: 'WAITING', waitMinutes: 17 },
  { id: 'a7', date: MOCK_TODAY, time: '13:00', patientId: 'p7', patientName: 'มานี มีสุข', patientAge: 38, patientPhone: '081-234-5677', serviceName: 'ตรวจสุขภาพฟัน', durationMin: 20, status: 'CONFIRMED' },
  { id: 'a8', date: MOCK_TODAY, time: '13:30', patientId: 'p8', patientName: 'ชัยวัฒน์ บุญมี', patientAge: 46, patientPhone: '081-234-5678', serviceName: 'ขูดหินปูน', durationMin: 30, status: 'CONFIRMED' },
  { id: 'a9', date: MOCK_TODAY, time: '14:00', patientId: 'p9', patientName: 'วารี ใจงาม', patientAge: 29, patientPhone: '081-234-5679', serviceName: 'อุดฟัน', durationMin: 40, status: 'CANCELLED' },

  // สัปดาห์ก่อนหน้า / ก่อนวันนี้ (เสร็จสิ้นแล้ว)
  { id: 'a10', date: '2026-08-03', time: '09:00', patientId: 'p10', patientName: 'ประภาส ศรีวิไล', patientAge: 44, patientPhone: '081-234-5680', serviceName: 'ตรวจสุขภาพฟัน', durationMin: 20, status: 'COMPLETED' },
  { id: 'a11', date: '2026-08-05', time: '09:30', patientId: 'p11', patientName: 'จินตนา แก้วมณี', patientAge: 31, patientPhone: '081-234-5681', serviceName: 'ขูดหินปูน', durationMin: 30, status: 'COMPLETED' },
  { id: 'a12', date: '2026-08-05', time: '10:30', patientId: 'p12', patientName: 'ธนกร วงศ์สุข', patientAge: 52, patientPhone: '081-234-5682', serviceName: 'ครอบฟัน', durationMin: 45, status: 'COMPLETED' },
  { id: 'a13', date: '2026-08-06', time: '14:00', patientId: 'p13', patientName: 'อัจฉรา บุญเลิศ', patientAge: 26, patientPhone: '081-234-5683', serviceName: 'อุดฟัน', durationMin: 40, status: 'CANCELLED' },
  { id: 'a14', date: '2026-08-07', time: '09:00', patientId: 'p14', patientName: 'วีระชัย พันธุ์ดี', patientAge: 39, patientPhone: '081-234-5684', serviceName: 'จัดฟัน (ปรับลวด)', durationMin: 30, status: 'COMPLETED' },
  { id: 'a15', date: '2026-08-07', time: '11:00', patientId: 'p15', patientName: 'สายฝน เจริญพร', patientAge: 48, patientPhone: '081-234-5685', serviceName: 'รักษารากฟัน', durationMin: 60, status: 'COMPLETED' },

  // สัปดาห์ถัดไป (ยืนยันแล้ว)
  { id: 'a16', date: '2026-08-10', time: '09:00', patientId: 'p11', patientName: 'จินตนา แก้วมณี', patientAge: 31, patientPhone: '081-234-5681', serviceName: 'ขูดหินปูน', durationMin: 30, status: 'CONFIRMED' },
  { id: 'a17', date: '2026-08-10', time: '13:30', patientId: 'p16', patientName: 'ปกรณ์ ทองสุข', patientAge: 35, patientPhone: '081-234-5686', serviceName: 'อุดฟัน', durationMin: 40, status: 'CONFIRMED' },
  { id: 'a18', date: '2026-08-12', time: '10:00', patientId: 'p3', patientName: 'ปิยะดา แสงทอง', patientAge: 27, patientPhone: '081-234-5673', serviceName: 'ตรวจสุขภาพฟัน', durationMin: 20, status: 'CONFIRMED' },
  { id: 'a19', date: '2026-08-17', time: '09:30', patientId: 'p17', patientName: 'รัชนี อินทรทัต', patientAge: 60, patientPhone: '081-234-5687', serviceName: 'ครอบฟัน', durationMin: 45, status: 'CONFIRMED' },
  { id: 'a20', date: '2026-08-17', time: '11:00', patientId: 'p4', patientName: 'สุนิสา อินทร์แก้ว', patientAge: 22, patientPhone: '081-234-5674', serviceName: 'จัดฟัน (ปรับลวด)', durationMin: 30, status: 'CONFIRMED' },
  { id: 'a21', date: '2026-08-24', time: '10:00', patientId: 'p5', patientName: 'ธีรพงศ์ รุ่งเรือง', patientAge: 55, patientPhone: '081-234-5675', serviceName: 'รักษารากฟัน', durationMin: 60, status: 'CONFIRMED' },
]
