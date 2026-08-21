import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import HeroSection from '@/components/ui/HeroSection'
import QuickLinksSection from '@/components/ui/QuickLinksSection'
import RecommendedServicesSection from '@/components/ui/RecommendedServicesSection'
import TipSection from '@/components/ui/TipSection'
import HelpSection from '@/components/ui/HelpSection'

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <HeroSection />
      <QuickLinksSection />
      <RecommendedServicesSection />
      <TipSection />
      <HelpSection />
      <Footer />
    </div>
  )
}
