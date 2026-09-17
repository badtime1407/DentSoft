import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'
import { syncAppointmentsToSheet } from '@/lib/googleSheets'
import { Prisma } from '@prisma/client'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

function isDuplicateBookingError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

const TIME_SLOTS = ['10:00', '11:30', '14:00', '16:00']
const MIN_ADVANCE_DAYS = 3
const MAX_ALTERNATIVES = 3
const ALTERNATIVE_SEARCH_DAYS = 14

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

function addDaysToISODate(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return next.toISOString().slice(0, 10)
}

function dayOfWeekFromISODate(dateISO: string): number {
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

const BOOK_APPOINTMENT_TOOL = {
  type: 'function' as const,
  name: 'book_appointment',
  description:
    'จองนัดหมายจริงเข้าระบบให้คนไข้ ใช้เมื่อคนไข้ยืนยันชัดเจนแล้วว่าต้องการจองบริการอะไร วันที่ไหน เวลาอะไร (ห้ามเรียกถ้าข้อมูลยังไม่ครบหรือคนไข้ยังไม่ได้ยืนยัน) ถ้าผลลัพธ์กลับมาไม่สำเร็จและมี alternatives ให้เสนอเวลาทางเลือกเหล่านั้นให้คนไข้แทน',
  parameters: {
    type: 'object',
    properties: {
      serviceId: { type: 'string', description: 'รหัสบริการ (id) จากรายการบริการที่ให้ไว้ในบทสนทนา' },
      date: { type: 'string', description: 'วันที่ต้องการนัด รูปแบบ YYYY-MM-DD' },
      time: { type: 'string', description: `เวลาที่ต้องการนัด ต้องเป็นหนึ่งใน: ${TIME_SLOTS.join(', ')} เท่านั้น` },
      symptomSummary: {
        type: 'string',
        description:
          'สรุปอาการของคนไข้แบบสั้นๆ 1 ประโยค จากที่คุยกันมาก่อนหน้านี้ในบทสนทนา (เช่น "ปวดฟันกรามล่างซ้ายมา 3 วัน") เพื่อส่งต่อให้ทันตแพทย์ทราบล่วงหน้า ใส่เฉพาะตอนที่คนไข้เล่าอาการมาจริงๆ ถ้าคนไข้จองตรงๆไม่ได้เล่าอาการ ให้เว้นว่างไว้ ห้ามแต่งอาการขึ้นเอง',
      },
    },
    required: ['serviceId', 'date', 'time'],
  },
}

async function buildSystemInstruction() {
  const services = await prisma.service.findMany({
    where: { isActive: true, type: { in: ['MAIN', 'PACKAGE'] } },
    select: { id: true, name: true, duration: true },
    orderBy: { name: 'asc' },
  })
  const serviceList = services.map((s) => `- ${s.name} (id: ${s.id}, ใช้เวลาประมาณ ${s.duration ?? 30} นาที)`).join('\n')
  const earliestBookableDate = addDaysToISODate(todayInBangkok(), MIN_ADVANCE_DAYS)

  return `คุณคือผู้ช่วย AI ของ DentSoft คลินิกทันตกรรม ทำหน้าที่เหมือนผู้ช่วยทันตแพทย์ที่คุยกับคนไข้จริง

วันนี้คือวันที่ ${todayInBangkok()} (เวลาไทย) ใช้วันนี้เป็นฐานในการคำนวณวันที่สัมพัทธ์ เช่น "พรุ่งนี้" "สัปดาห์หน้า"

รายการบริการที่จองได้จริงในระบบตอนนี้:
${serviceList}

กฎสำคัญ (ต้องทำตามอย่างเคร่งครัด):
1. ตอบคำถามเฉพาะที่เกี่ยวข้องกับฟัน ช่องปาก เหงือก และการรักษาทันตกรรมเท่านั้น
2. หากคนไข้ถามเรื่องอื่นที่ไม่เกี่ยวกับฟัน (เช่น โรคทั่วไป ยา หัวข้ออื่น ๆ) ให้ปฏิเสธอย่างสุภาพ บอกว่าคุณเชี่ยวชาญเฉพาะเรื่องฟันและการรักษาทางทันตกรรมเท่านั้น
3. ห้ามฟันธงวินิจฉัยโรคหรือบอกว่าคนไข้เป็นโรคอะไรแน่นอน ให้ใช้คำว่า "อาการที่คุณเล่ามาอาจเกี่ยวข้องกับ..." และแนะนำให้พบทันตแพทย์เพื่อวินิจฉัยที่แน่ชัดเสมอ
4. ห้ามแนะนำชื่อยาหรือปริมาณยาที่เจาะจง หากถามเรื่องยาให้แนะนำให้ปรึกษาเภสัชกรหรือทันตแพทย์โดยตรง
5. ถามคำถามเพิ่มเติมได้ไม่เกิน 1-2 รอบเพื่อให้ได้ข้อมูลอาการที่ชัดเจน ไม่ต้องซักถามวนซ้ำหลายรอบ
6. หากคนไข้ต้องการจองนัดหมาย ให้ถามจนได้ครบ 3 อย่าง คือ บริการ (จากรายการที่ให้ไว้เท่านั้น) วันที่ และเวลา แล้วสรุปให้คนไข้ยืนยันอีกครั้งก่อนเรียกฟังก์ชัน book_appointment ถ้าคนไข้ต้องการบริการที่ไม่อยู่ในรายการ ให้แจ้งว่ายังไม่มีบริการนี้ในระบบ
7. เวลานัดหมายรับได้เฉพาะรอบ ${TIME_SLOTS.join(', ')} น. เท่านั้น ห้ามเสนอหรือรับเวลาอื่นนอกจากนี้
8. คลินิกต้องการเวลาเตรียมตัวล่วงหน้า คนไข้ต้องจองล่วงหน้าอย่างน้อย ${MIN_ADVANCE_DAYS} วัน วันที่เร็วที่สุดที่จองได้ตอนนี้คือ ${earliestBookableDate} ถ้าคนไข้ขอวันที่เร็วกว่านี้ ให้แจ้งกฎนี้และเสนอวันที่เร็วที่สุดที่จองได้แทนทันที ไม่ต้องเรียกฟังก์ชัน book_appointment
9. หากอาการดูรุนแรงหรือฉุกเฉิน (เช่น ปวดรุนแรง บวมมาก มีไข้ร่วมด้วย) ให้แนะนำให้ติดต่อคลินิกหรือไปพบทันตแพทย์โดยเร็วที่สุด
10. ใช้ภาษาไทย น้ำเสียงสุภาพ เป็นมิตร กระชับ ไม่เกิน 3-4 ประโยคหลักต่อครั้ง ไม่ใช้ศัพท์ทางการแพทย์ที่เข้าใจยากเกินไป
11. จัดข้อความให้อ่านง่าย: ขึ้นบรรทัดใหม่แยกแต่ละประเด็น (เช่น สรุปการจอง กับ คำถามถัดไป ให้อยู่คนละบรรทัด) และเวลาต้องเสนอตัวเลือกมากกว่า 1 อย่าง (เช่น เวลาที่ว่างหลายช่วง) ให้ขึ้นบรรทัดใหม่ทีละตัวเลือกโดยขึ้นต้นด้วย "- " เสมอ ห้ามเขียนตัวเลือกต่อกันในบรรทัดเดียว`
}

async function findAlternativeSlots(fromDateISO: string): Promise<{ date: string; time: string }[]> {
  const alternatives: { date: string; time: string }[] = []

  for (let dayOffset = 0; dayOffset < ALTERNATIVE_SEARCH_DAYS && alternatives.length < MAX_ALTERNATIVES; dayOffset++) {
    const candidateDate = addDaysToISODate(fromDateISO, dayOffset)
    const dayOfWeek = dayOfWeekFromISODate(candidateDate)

    for (const time of TIME_SLOTS) {
      if (alternatives.length >= MAX_ALTERNATIVES) break

      const capacity = await prisma.schedule.count({
        where: { isActive: true, dayOfWeek, startTime: { lte: time }, endTime: { gt: time } },
      })
      if (capacity === 0) continue

      const booked = await prisma.appointment.count({
        where: { date: new Date(`${candidateDate}T${time}:00+07:00`), status: { not: 'CANCELLED' } },
      })
      if (booked < capacity) alternatives.push({ date: candidateDate, time })
    }
  }

  return alternatives
}

async function executeBookAppointment(
  userId: string,
  args: { serviceId?: unknown; date?: unknown; time?: unknown; symptomSummary?: unknown }
) {
  const { serviceId, date, time, symptomSummary } = args
  const note = typeof symptomSummary === 'string' && symptomSummary.trim() ? symptomSummary.trim() : null
  if (typeof serviceId !== 'string' || typeof date !== 'string' || typeof time !== 'string') {
    return { success: false, error: 'ข้อมูลการจองไม่ครบถ้วน' }
  }

  const patient = await prisma.patient.findUnique({ where: { userId } })
  if (!patient) {
    return { success: false, error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้ กรุณาจองผ่านหน้าจองนัดหมายแทน' }
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.isActive || !(service.type === 'MAIN' || service.type === 'PACKAGE')) {
    return { success: false, error: 'ไม่พบบริการนี้ในระบบ' }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !TIME_SLOTS.includes(time)) {
    return { success: false, error: `รูปแบบวันที่หรือเวลาไม่ถูกต้อง เวลาที่จองได้มีเฉพาะ ${TIME_SLOTS.join(', ')} น.` }
  }

  const appointmentDate = new Date(`${date}T${time}:00+07:00`)
  if (Number.isNaN(appointmentDate.getTime())) {
    return { success: false, error: 'วันเวลาที่เลือกไม่ถูกต้อง' }
  }
  if (appointmentDate.getTime() < Date.now()) {
    return { success: false, error: 'ไม่สามารถจองย้อนหลังได้ กรุณาเลือกวันเวลาในอนาคต' }
  }

  const earliestBookableDate = addDaysToISODate(todayInBangkok(), MIN_ADVANCE_DAYS)
  if (date < earliestBookableDate) {
    return {
      success: false,
      error: `คลินิกต้องการให้จองล่วงหน้าอย่างน้อย ${MIN_ADVANCE_DAYS} วัน วันที่เร็วที่สุดที่จองได้คือ ${earliestBookableDate}`,
      alternatives: await findAlternativeSlots(earliestBookableDate),
    }
  }

  const dayOfWeek = dayOfWeekFromISODate(date)
  const capacity = await prisma.schedule.count({
    where: { isActive: true, dayOfWeek, startTime: { lte: time }, endTime: { gt: time } },
  })
  const booked = await prisma.appointment.count({
    where: { date: appointmentDate, status: { not: 'CANCELLED' } },
  })

  if (capacity === 0 || booked >= capacity) {
    return {
      success: false,
      error: 'ช่วงเวลานี้เต็มแล้วหรือคลินิกไม่เปิดให้บริการช่วงเวลานี้',
      alternatives: await findAlternativeSlots(date),
    }
  }

  const duplicate = await prisma.appointment.findFirst({
    where: { patientId: patient.id, date: appointmentDate, status: { not: 'CANCELLED' } },
  })
  if (duplicate) {
    return { success: false, error: 'คุณมีนัดหมายในวันเวลานี้อยู่แล้ว ไม่ต้องจองซ้ำนะคะ' }
  }

  let appointment
  try {
    appointment = await prisma.appointment.create({
      data: { patientId: patient.id, serviceId: service.id, date: appointmentDate, status: 'PENDING', note },
    })
  } catch (error) {
    if (isDuplicateBookingError(error)) {
      return { success: false, error: 'คุณมีนัดหมายในวันเวลานี้อยู่แล้ว ไม่ต้องจองซ้ำนะคะ' }
    }
    throw error
  }

  await syncAppointmentsToSheet()

  return {
    success: true,
    appointmentId: appointment.id,
    serviceName: service.name,
    date,
    time,
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!session || !user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message, previousInteractionId } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'ข้อความไม่ถูกต้อง' }, { status: 400 })
    }

    const systemInstruction = await buildSystemInstruction()

    let interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash',
      input: message,
      system_instruction: systemInstruction,
      tools: [BOOK_APPOINTMENT_TOOL],
      ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
    })

    for (let i = 0; i < 3; i++) {
      const functionCall = interaction.steps?.find(
        (step): step is Extract<typeof step, { type: 'function_call' }> => step.type === 'function_call'
      )
      if (!functionCall) break

      const result =
        functionCall.name === 'book_appointment'
          ? await executeBookAppointment(user.id, functionCall.arguments)
          : { success: false, error: 'ไม่รู้จักฟังก์ชันนี้' }

      interaction = await ai.interactions.create({
        model: 'gemini-2.5-flash',
        previous_interaction_id: interaction.id,
        system_instruction: systemInstruction,
        tools: [BOOK_APPOINTMENT_TOOL],
        input: [{ type: 'function_result', call_id: functionCall.id, name: functionCall.name, result }],
      })
    }

    return NextResponse.json({
      reply: interaction.output_text,
      interactionId: interaction.id,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
