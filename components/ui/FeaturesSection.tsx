const features = [
  { icon: '📅', title: 'Online Appointment', desc: 'จองนัดหมายออนไลน์ได้ทุกที่ทุกเวลา สะดวกรวดเร็ว' },
  { icon: '📋', title: 'Digital Patient Records', desc: 'บันทึกและเข้าถึงประวัติการรักษาได้ทันที' },
  { icon: '🗓️', title: 'Dentist Scheduling', desc: 'ดูตารางทันตแพทย์และเลือกผู้เชี่ยวชาญที่เหมาะสม' },
  { icon: '🔒', title: 'Secure & Private', desc: 'ข้อมูลของคุณปลอดภัยด้วยระบบรักษาความปลอดภัย' },
]

export default function FeaturesSection() {
  return (
    <section id="services" className="py-20 px-10 bg-white">
      <p className="text-center text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">บริการของเรา</p>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">ครบครันทุกการดูแล</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((item) => (
          <div key={item.title} className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-md transition">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}