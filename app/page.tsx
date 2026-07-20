import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import HeroSection from '@/components/ui/HeroSection'
import FeaturesSection from '@/components/ui/FeaturesSection'
import AboutSection from '@/components/ui/AboutSection'
import TeamSection from '@/components/ui/TeamSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <TeamSection />

      {/* CTA Section */}
      <section className="bg-blue-600 text-white text-center py-16 px-8">
        <h2 className="text-3xl font-bold mb-4">Ready for your best smile?</h2>
        <p className="text-blue-100 mb-8">รับบริการทันตกรรมคุณภาพจากทีมผู้เชี่ยวชาญของเรา</p>
        <Link href="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
          จองนัดหมายแรก
        </Link>
      </section>

      <Footer />
    </div>
  )
}