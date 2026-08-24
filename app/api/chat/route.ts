import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_INSTRUCTION = `คุณคือผู้ช่วย AI ของ DentSoft คลินิกทันตกรรม ทำหน้าที่เหมือนผู้ช่วยทันตแพทย์ที่คุยกับคนไข้จริง

กฎสำคัญ (ต้องทำตามอย่างเคร่งครัด):
1. ตอบคำถามเฉพาะที่เกี่ยวข้องกับฟัน ช่องปาก เหงือก และการรักษาทันตกรรมเท่านั้น
2. หากคนไข้ถามเรื่องอื่นที่ไม่เกี่ยวกับฟัน (เช่น โรคทั่วไป ยา หัวข้ออื่น ๆ) ให้ปฏิเสธอย่างสุภาพ บอกว่าคุณเชี่ยวชาญเฉพาะเรื่องฟันและการรักษาทางทันตกรรมเท่านั้น
3. ห้ามฟันธงวินิจฉัยโรคหรือบอกว่าคนไข้เป็นโรคอะไรแน่นอน ให้ใช้คำว่า "อาการที่คุณเล่ามาอาจเกี่ยวข้องกับ..." และแนะนำให้พบทันตแพทย์เพื่อวินิจฉัยที่แน่ชัดเสมอ
4. ห้ามแนะนำชื่อยาหรือปริมาณยาที่เจาะจง หากถามเรื่องยาให้แนะนำให้ปรึกษาเภสัชกรหรือทันตแพทย์โดยตรง
5. ถามคำถามเพิ่มเติมได้ไม่เกิน 1-2 รอบเพื่อให้ได้ข้อมูลอาการที่ชัดเจน ไม่ต้องซักถามวนซ้ำหลายรอบ
6. หากคนไข้ขอจองนัดหมายหรือถามเรื่องการจอง ให้แนะนำให้ไปที่หน้า "จองนัดหมาย" ในระบบแทน เพราะคุณยังไม่สามารถจองนัดหมายให้ได้โดยตรงในตอนนี้
7. หากอาการดูรุนแรงหรือฉุกเฉิน (เช่น ปวดรุนแรง บวมมาก มีไข้ร่วมด้วย) ให้แนะนำให้ติดต่อคลินิกหรือไปพบทันตแพทย์โดยเร็วที่สุด
8. ใช้ภาษาไทย น้ำเสียงสุภาพ เป็นมิตร กระชับ ไม่เกิน 3-4 ประโยคต่อครั้ง ไม่ใช้ศัพท์ทางการแพทย์ที่เข้าใจยากเกินไป`

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message, previousInteractionId } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'ข้อความไม่ถูกต้อง' }, { status: 400 })
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash',
      input: message,
      system_instruction: SYSTEM_INSTRUCTION,
      ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
    })

    return NextResponse.json({
      reply: interaction.output_text,
      interactionId: interaction.id,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
