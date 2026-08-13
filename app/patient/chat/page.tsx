'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { IconSparkle } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

type ChatMessage = {
  id: string
  from: 'ai' | 'patient'
  text: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    from: 'ai',
    text: 'สวัสดีค่ะ ดิฉันเป็นผู้ช่วย AI ของ DentSoft สอบถามอาการหรือข้อสงสัยเกี่ยวกับสุขภาพช่องปากเบื้องต้นได้เลยค่ะ',
  },
  {
    id: 'm2',
    from: 'patient',
    text: 'อยากสอบถามขั้นตอนการเตรียมตัวก่อนขูดหินปูนค่ะ',
  },
  {
    id: 'm3',
    from: 'ai',
    text: 'รับประทานอาหารได้ตามปกติค่ะ และแนะนำให้แปรงฟันให้สะอาดก่อนเข้ารับบริการ หากมีอาการเสียวฟันหรือเหงือกอักเสบ แนะนำให้แจ้งทันตแพทย์ก่อนเริ่มการรักษาค่ะ',
  },
]

const AI_REPLIES = [
  'ขอบคุณสำหรับคำถามค่ะ เบื้องต้นแนะนำให้ดูแลรักษาความสะอาดช่องปากและสังเกตอาการต่อเนื่อง หากไม่ดีขึ้นแนะนำให้นัดหมายพบทันตแพทย์เพื่อตรวจวินิจฉัยเพิ่มเติมค่ะ',
  'จากข้อมูลเบื้องต้น อาการนี้พบได้ทั่วไปค่ะ แต่เพื่อความแม่นยำ แนะนำให้จองนัดหมายเข้ามาให้ทันตแพทย์ตรวจดูอาการโดยตรงค่ะ',
  'สามารถบรรเทาอาการเบื้องต้นได้ด้วยการดูแลสุขอนามัยช่องปาก หากมีอาการปวดหรือบวมควรรีบนัดหมายเข้ามาพบทันตแพทย์นะคะ',
]

export default function PatientChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  function handleSend() {
    const text = draft.trim()
    if (!text || isTyping) return

    const patientMessage: ChatMessage = { id: crypto.randomUUID(), from: 'patient', text }
    setMessages((prev) => [...prev, patientMessage])
    setDraft('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)]
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'ai', text: reply }])
      setIsTyping(false)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IconSparkle className="w-5 h-5" />
              </span>
              ปรึกษา AI ผู้ช่วย
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              สอบถามอาการเบื้องต้นเกี่ยวกับสุขภาพช่องปากได้ตลอด 24 ชั่วโมง
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-slate-100">
            {messages.map((message) =>
              message.from === 'ai' ? (
                <div key={message.id} className="flex justify-start items-end gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <IconSparkle className="w-3.5 h-3.5" />
                  </span>
                  <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl text-xs sm:text-sm max-w-xs">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl text-xs sm:text-sm max-w-xs">
                    {message.text}
                  </div>
                </div>
              )
            )}
            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <IconSparkle className="w-3.5 h-3.5" />
                </span>
                <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl text-xs sm:text-sm">
                  กำลังพิมพ์...
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="พิมพ์ข้อความคำถามที่นี่..."
              className={`flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
            />
            <button
              type="button"
              onClick={handleSend}
              className={`px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition ${focusRing}`}
            >
              ส่ง
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          คำแนะนำจาก AI เป็นข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้ทดแทนการวินิจฉัยจากทันตแพทย์ได้
        </p>
      </main>

      <PatientFooter />
    </div>
  )
}
