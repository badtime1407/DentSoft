import { google, sheets_v4 } from 'googleapis'
import { prisma } from '@/lib/prisma'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'รอยืนยัน',
  CONFIRMED: 'ยืนยันแล้ว',
  WAITING: 'รอคิว',
  IN_TREATMENT: 'กำลังรักษา',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
}

function splitBangkok(date: Date) {
  const local = date.toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })
  const [datePart, timePart] = local.split(' ')
  return { date: datePart, time: timePart?.slice(0, 5) ?? '' }
}

function formatAppointmentCode(seq: number) {
  return `DS${String(seq).padStart(7, '0')}`
}

function getSheetsClient(): sheets_v4.Sheets | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) return null

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

// ชื่อชีตของเดือนปัจจุบัน (ตามเวลาไทย) เช่น "2026-09" — แยกชีตรายเดือนกันข้อมูลแน่นเกินไปในชีตเดียว
function currentMonthSheetTitle() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }).slice(0, 7)
}

let ensuredSheetTitle: string | null = null

// เช็คว่ามีชีตของเดือนนี้แล้วหรือยัง ถ้ายังไม่มี: ถ้าในไฟล์มีแค่ชีตเดียวอยู่ก่อน (ครั้งแรกที่ใช้ฟีเจอร์นี้) จะเปลี่ยนชื่อชีตเดิมมาใช้แทน
// แต่ถ้ามีหลายชีตแล้ว (เคยขึ้นเดือนใหม่มาก่อนหน้านี้) จะสร้างชีตใหม่เพิ่มโดยไม่แตะชีตเดือนก่อนๆ เลย
async function ensureMonthSheetExists(sheets: sheets_v4.Sheets, spreadsheetId: string, title: string) {
  if (ensuredSheetTitle === title) return
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const allSheets = meta.data.sheets ?? []
  const existing = allSheets.find((s) => s.properties?.title === title)
  if (existing) {
    ensuredSheetTitle = title
    return
  }

  if (allSheets.length === 1 && allSheets[0].properties?.sheetId !== undefined && allSheets[0].properties?.sheetId !== null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ updateSheetProperties: { properties: { sheetId: allSheets[0].properties.sheetId, title }, fields: 'title' } }],
      },
    })
  } else {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    })
  }
  ensuredSheetTitle = title
}

// ซิงก์นัดหมายของ "เดือนปัจจุบัน" จาก Postgres ไปทับชีตประจำเดือนนั้นใน Google Sheet ทุกครั้งที่มีการจอง/แก้ไขนัดหมาย
// พอขึ้นเดือนใหม่ จะสร้าง/สลับไปเขียนชีตของเดือนใหม่แทน ชีตเดือนก่อนๆ จะหยุดถูกแก้ไขและเก็บไว้เป็นประวัติ
// เป็น one-way sync (DB -> Sheet เท่านั้น) ความล้มเหลวของ Sheets API ต้องไม่ทำให้ request หลักพัง จึงจับ error ไว้ในนี้ทั้งหมด
export async function syncAppointmentsToSheet() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const sheets = getSheetsClient()
  if (!sheets || !spreadsheetId) return

  try {
    const sheetTitle = currentMonthSheetTitle()
    await ensureMonthSheetExists(sheets, spreadsheetId, sheetTitle)

    const appointments = await prisma.appointment.findMany({
      include: { patient: true, service: true, dentist: true },
      orderBy: { date: 'desc' },
    })

    const monthAppointments = appointments.filter((a) => splitBangkok(a.date).date.slice(0, 7) === sheetTitle)

    const header = [
      'รหัสนัดหมาย', 'วันที่', 'เวลา', 'ชื่อคนไข้', 'เบอร์โทร',
      'บริการ', 'ทันตแพทย์', 'สถานะ', 'สร้างเมื่อ', 'แก้ไขล่าสุด',
    ]

    const rows = monthAppointments.map((a) => {
      const { date, time } = splitBangkok(a.date)
      const updated = splitBangkok(a.updatedAt)
      return [
        formatAppointmentCode(a.seq),
        date,
        time,
        `${a.patient.firstName} ${a.patient.lastName}`,
        a.patient.phone ?? '',
        a.service.name,
        a.dentist ? `${a.dentist.title}${a.dentist.firstName} ${a.dentist.lastName}` : 'ยังไม่ระบุ',
        STATUS_LABEL[a.status] ?? a.status,
        splitBangkok(a.createdAt).date,
        `${updated.date} ${updated.time}`,
      ]
    })

    await sheets.spreadsheets.values.clear({ spreadsheetId, range: sheetTitle })
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [header, ...rows] },
    })
  } catch (error) {
    console.error('Google Sheets sync failed:', error)
  }
}
