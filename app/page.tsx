import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import HeroSection from '@/components/ui/HeroSection'
import StepsSection from '@/components/ui/StepsSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection />
      <StepsSection />

      {/* CTA */}
      <section className="px-6 py-4">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-3xl text-center py-14 px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">พร้อมดูแลสุขภาพช่องปากของคุณแล้วหรือยัง?</h2>
          <p className="text-blue-100 mb-8">สมัครสมาชิกวันนี้ เริ่มต้นดูแลรอยยิ้มของคุณไปกับเรา</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
            สมัครสมาชิกวันนี้
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
