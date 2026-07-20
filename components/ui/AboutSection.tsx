export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-10 bg-gray-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 h-[300px] bg-blue-100 rounded-2xl flex items-center justify-center text-blue-200 text-6xl shadow-inner">
          🏥
        </div>
        <div className="max-w-lg">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">OUR LEGACY</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About DentSoft Clinic</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            เรามุ่งมั่นให้บริการด้านทันตกรรมที่ได้มาตรฐาน ด้วยทีมทันตแพทย์ผู้เชี่ยวชาญ
            และเทคโนโลยีที่ทันสมัย เพื่อให้คุณมีรอยยิ้มที่สวยงามและสุขภาพช่องปากที่ดี
          </p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-blue-600">10+</p>
              <p className="text-gray-500 text-sm">ปีประสบการณ์</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-500 text-sm">คนไข้ที่ไว้วางใจ</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">5+</p>
              <p className="text-gray-500 text-sm">ทันตแพทย์</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}