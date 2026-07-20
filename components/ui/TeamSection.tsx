const doctors = [
  { name: 'ทพ. สมชาย ใจดี', specialty: 'ทันตกรรมทั่วไป' },
  { name: 'ทพญ. สมหญิง รักดี', specialty: 'ทันตกรรมจัดฟัน' },
  { name: 'ทพ. วิชัย เก่งมาก', specialty: 'ศัลยกรรมช่องปาก' },
]

export default function TeamSection() {
  return (
    <section id="team" className="py-20 px-10 bg-white">
      <p className="text-center text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">ทีมของเรา</p>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">ทันตแพทย์ผู้เชี่ยวชาญ</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {doctors.map((doctor) => (
          <div key={doctor.name} className="text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
              👨‍⚕️
            </div>
            <h3 className="font-bold text-gray-800">{doctor.name}</h3>
            <p className="text-blue-600 text-sm">{doctor.specialty}</p>
          </div>
        ))}
      </div>
    </section>
  )
}