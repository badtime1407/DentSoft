'use client'

import { useState } from 'react'

const stats = [
  { label: 'คนไข้ทั้งหมด', value: '128', sub: '+4 เดือนนี้', icon: '👥', bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'นัดหมายวันนี้', value: '12', sub: '3 รอยืนยัน', icon: '📅', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { label: 'เสร็จสิ้นแล้ว', value: '8', sub: 'จาก 12 นัด', icon: '✅', bg: 'bg-green-50', text: 'text-green-600' },
  { label: 'รายได้เดือนนี้', value: '฿48,500', sub: '+12% จากเดือนก่อน', icon: '💰', bg: 'bg-purple-50', text: 'text-purple-600' },
]

const appointments = [
  { time: '09:00', patient: 'สมชาย ใจดี', service: 'ขูดหินปูน', dentist: 'ทพ. วิชัย', status: 'COMPLETED' },
  { time: '10:00', patient: 'สมหญิง รักดี', service: 'อุดฟัน', dentist: 'ทพญ. สมหญิง', status: 'CONFIRMED' },
  { time: '11:00', patient: 'วิชัย เก่งมาก', service: 'ถอนฟัน', dentist: 'ทพ. วิชัย', status: 'CONFIRMED' },
  { time: '13:00', patient: 'มานี มีสุข', service: 'จัดฟัน', dentist: 'ทพญ. สมหญิง', status: 'CANCELLED' },
  { time: '14:00', patient: 'วารี ใจงาม', service: 'ฟอกสีฟัน', dentist: 'ทพ. วิชัย', status: 'PENDING' },
  { time: '15:00', patient: 'ประสิทธิ์ ดีมาก', service: 'รักษารากฟัน', dentist: 'ทพญ. สมหญิง', status: 'PENDING' },
]

const statusMap: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'ยืนยันแล้ว', cls: 'bg-blue-100 text-blue-700' },
  PENDING:   { label: 'รอยืนยัน',  cls: 'bg-yellow-100 text-yellow-700' },
  CANCELLED: { label: 'ยกเลิก',    cls: 'bg-red-100 text-red-600' },
  COMPLETED: { label: 'เสร็จสิ้น', cls: 'bg-green-100 text-green-700' },
}

const navItems = [
  { id: 'dashboard',    icon: '▪', label: 'Dashboard' },
  { id: 'appointments', icon: '▪', label: 'นัดหมาย' },
  { id: 'patients',     icon: '▪', label: 'คนไข้' },
  { id: 'dentists',     icon: '▪', label: 'ทันตแพทย์' },
  { id: 'reports',      icon: '▪', label: 'รายงาน' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-800">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">D</div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none">DentSoft</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active === item.id
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active === item.id ? 'bg-white' : 'bg-gray-300'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
              <p className="text-[11px] text-gray-400 truncate">ผู้ดูแลระบบ</p>
            </div>
          </div>
          <button className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-50 transition">
            <span>⎋</span> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">{today}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            + เพิ่มนัดหมาย
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center text-xl mb-3`}>
                {s.icon}
              </div>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">นัดหมายวันนี้</h2>
              <p className="text-xs text-gray-400 mt-0.5">Today's Appointments</p>
            </div>
            <button className="text-blue-600 text-sm hover:underline">ดูทั้งหมด →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">เวลา</th>
                  <th className="px-6 py-3 font-medium">คนไข้</th>
                  <th className="px-6 py-3 font-medium">บริการ</th>
                  <th className="px-6 py-3 font-medium">ทันตแพทย์</th>
                  <th className="px-6 py-3 font-medium">สถานะ</th>
                  <th className="px-6 py-3 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{a.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold">
                          {a.patient.charAt(0)}
                        </div>
                        <span className="text-gray-800">{a.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{a.service}</td>
                    <td className="px-6 py-4 text-gray-600">{a.dentist}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[a.status].cls}`}>
                        {statusMap[a.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button className="text-blue-500 hover:text-blue-700 text-xs font-medium transition">แก้ไข</button>
                        <button className="text-red-400 hover:text-red-600 text-xs font-medium transition">ยกเลิก</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">แสดง {appointments.length} รายการ</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 transition">← ก่อนหน้า</button>
              <button className="px-3 py-1 rounded text-xs bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 transition">ถัดไป →</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}