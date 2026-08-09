const steps = [
  { title: 'สมัครสมาชิก', desc: 'ลงทะเบียนด้วยอีเมลหรือบัญชี Google ใช้เวลาไม่ถึงนาที' },
  { title: 'เลือกบริการและวันนัด', desc: 'เลือกทันตแพทย์ บริการ และเวลาที่คุณสะดวก' },
  { title: 'เข้ารับบริการตามนัด', desc: 'มาถึงคลินิกตามเวลานัด ทีมงานของเราพร้อมดูแลคุณ' },
]

export default function StepsSection() {
  return (
    <section id="steps" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">เริ่มต้นใช้งานง่าย ใน 3 ขั้นตอน</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
          <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-0.5 bg-blue-100" />
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 relative shadow-sm shadow-blue-200">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
