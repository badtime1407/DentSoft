import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gradient-to-br from-blue-50 to-white gap-10">
      <div className="max-w-xl">
        <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-widest">ยินดีต้อนรับ</p>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Smile with <span className="text-blue-600">Technology</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          ระบบบริหารจัดการคลินิกทันตกรรม จองนัด ตรวจสอบ ดูแลสุขภาพช่องปากของคุณ
          อย่างครบวงจรในที่เดียว
        </p>
        <div className="flex gap-4">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            จองนัดหมาย
          </Link>
          <Link href="/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
      <div className="w-full md:w-[420px] h-[300px] bg-blue-100 rounded-2xl flex items-center justify-center text-blue-300 text-6xl shadow-inner">
        🦷
      </div>
    </section>
  )
}