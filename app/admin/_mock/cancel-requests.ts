export type CancelRequest = {
  id: string
  appointmentId: string
  patientName: string
  date: string
  startTime: string
  serviceId: string
  dentistId: string
  reason: string
  requestedAt: string
}

export function buildMockCancelRequests(referenceDate: Date = new Date()): CancelRequest[] {
  const d = (offset: number) => {
    const date = new Date(referenceDate)
    date.setDate(date.getDate() + offset)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return [
    {
      id: 'cr1',
      appointmentId: 'ap4',
      patientName: 'ปิยะดา แสงทอง',
      date: d(0),
      startTime: '09:30',
      serviceId: 'sv4',
      dentistId: 'dt2',
      reason: 'ติดธุระด่วนที่ทำงาน ไม่สามารถมาตามนัดได้',
      requestedAt: '08:12 น.',
    },
    {
      id: 'cr2',
      appointmentId: 'ap14',
      patientName: 'สมหญิง รักดี',
      date: d(2),
      startTime: '09:30',
      serviceId: 'sv6',
      dentistId: 'dt1',
      reason: 'ไม่สบาย มีไข้ ขอเลื่อนออกไปก่อน',
      requestedAt: 'เมื่อวาน 19:40 น.',
    },
  ]
}
