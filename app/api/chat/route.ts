import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

const BOOK_APPOINTMENT_TOOL = {
  type: 'function' as const,
  name: 'book_appointment',
  description:
    'จองนัดหมายจริงเข้าระบบให้คนไข้ ใช้เมื่อคนไข้ยืนยันชัดเจนแล้วว่าต้องการจองบริการอะไร วันที่ไหน เวลาอะไร (ห้ามเรียกถ้าข้อมูลยังไม่ครบหรือคนไข้ยังไม่ได้ยืนยัน)',
  parameters: {
    type: 'object',
    properties: {
      serviceId: { type: 'string', description: 'รหัสบริการ (id) จากรายการบริการที่ให้ไว้ในบทสนทนา' },
      date: { type: 'string', description: 'วันที่ต้องการนัด รูปแบบ YYYY-MM-DD' },
      time: { type: 'string', description: 'เวลาที่ต้องการนัด รูปแบบ 24 ชั่วโมง HH:mm' },
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
7. หากอาการดูรุนแรงหรือฉุกเฉิน (เช่น ปวดรุนแรง บวมมาก มีไข้ร่วมด้วย) ให้แนะนำให้ติดต่อคลินิกหรือไปพบทันตแพทย์โดยเร็วที่สุด
8. ใช้ภาษาไทย น้ำเสียงสุภาพ เป็นมิตร กระชับ ไม่เกิน 3-4 ประโยคต่อครั้ง ไม่ใช้ศัพท์ทางการแพทย์ที่เข้าใจยากเกินไป`
}

async function executeBookAppointment(
  userId: string,
  args: { serviceId?: unknown; date?: unknown; time?: unknown }
) {
  const { serviceId, date, time } = args
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

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return { success: false, error: 'รูปแบบวันที่หรือเวลาไม่ถูกต้อง' }
  }

  const appointmentDate = new Date(`${date}T${time}:00+07:00`)
  if (Number.isNaN(appointmentDate.getTime())) {
    return { success: false, error: 'วันเวลาที่เลือกไม่ถูกต้อง' }
  }
  if (appointmentDate.getTime() < Date.now()) {
    return { success: false, error: 'ไม่สามารถจองย้อนหลังได้ กรุณาเลือกวันเวลาในอนาคต' }
  }

  const appointment = await prisma.appointment.create({
    data: { patientId: patient.id, serviceId: service.id, date: appointmentDate, status: 'PENDING' },
  })

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
