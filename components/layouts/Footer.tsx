import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-400 py-8 px-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦷</span>
          <span className="text-white font-bold">DentSoft Clinic</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <Link href="/login" className="hover:text-white transition">Patient Portal</Link>
        </div>
        <p className="text-sm">© 2024 DentSoft Clinic</p>
      </div>
    </footer>
  )
}