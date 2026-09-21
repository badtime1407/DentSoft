const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

// เซิร์ฟเวอร์รันเวลา UTC เสมอ (Vercel) และเบราว์เซอร์ผู้ใช้อาจตั้ง timezone อื่นที่ไม่ใช่ไทย
// ทุกจุดที่ต้องแสดง/บันทึกวันเวลานัดหมายต้องแปลงผ่านฟังก์ชันนี้ ห้ามใช้ Date getter ตรงๆ (getHours/getDate ฯลฯ)
export function splitBangkok(date: Date): { date: string; time: string } {
  const shifted = new Date(date.getTime() + BANGKOK_OFFSET_MS)
  const iso = shifted.toISOString()
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}
