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

let sheetTitleCache: string | null = null

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

async function getFirstSheetTitle(sheets: sheets_v4.Sheets, spreadsheetId: string) {
  if (sheetTitleCache) return sheetTitleCache
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  sheetTitleCache = meta.data.sheets?.[0]?.properties?.title ?? 'Sheet1'
  return sheetTitleCache
}

// ซิงก์ตารางนัดหมายทั้งหมดจาก Postgres ไปทับชีตแรกของ Google Sheet ทุกครั้งที่มีการจอง/แก้ไขนัดหมาย
// เป็น one-way sync (DB -> Sheet เท่านั้น) ความล้มเหลวของ Sheets API ต้องไม่ทำให้ request หลักพัง จึงจับ error ไว้ในนี้ทั้งหมด
export async function syncAppointmentsToSheet() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const sheets = getSheetsClient()
  if (!sheets || !spreadsheetId) return

  try {
    const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId)

    const appointments = await prisma.appointment.findMany({
      include: { patient: true, service: true, dentist: true },
      orderBy: { date: 'desc' },
    })

    const header = [
      'รหัสนัดหมาย', 'วันที่', 'เวลา', 'ชื่อคนไข้', 'เบอร์โทร',
      'บริการ', 'ทันตแพทย์', 'สถานะ', 'สร้างเมื่อ', 'แก้ไขล่าสุด',
    ]

    const rows = appointments.map((a) => {
      const { date, time } = splitBangkok(a.date)
      const updated = splitBangkok(a.updatedAt)
      return [
        a.id,
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
