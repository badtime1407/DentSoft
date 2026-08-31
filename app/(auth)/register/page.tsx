'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthField, PasswordField } from '@/components/auth/AuthField'

const userIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
)
const mailIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </svg>
)
const phoneIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.6 4.5h3l1.4 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.4v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5.1 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
  </svg>
)
const lockIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
)
const calendarIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
  </svg>
)

type PatientCandidate = { id: string; firstName: string; lastName: string; birthDate: string | null }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<PatientCandidate[] | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitRegistration = async (linkPatientId?: string) => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, linkPatientId }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'เกิดข้อผิดพลาด')
    } else {
      router.push('/login')
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')

    const lookupRes = await fetch('/api/patients/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone, birthDate: form.birthDate }),
    })
    const lookupData = await lookupRes.json()
    setLoading(false)

    if (lookupData.candidates?.length > 0) {
      setCandidates(lookupData.candidates)
      return
    }

    await submitRegistration()
  }

  function formatBirthDate(birthDate: string | null) {
    if (!birthDate) return 'ไม่ระบุวันเกิด'
    return new Date(birthDate + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (candidates) {
    return (
      <AuthLayout>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">พบข้อมูลคนไข้เดิม</h1>
        <p className="text-sm text-gray-400 mb-6">
          เราพบประวัติคนไข้ที่เคยมาที่คลินิกด้วยเบอร์โทรนี้ ใช่คุณหรือไม่?
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm text-center rounded-lg py-2 mb-4">{error}</p>
        )}

        <div className="space-y-3">
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => submitRegistration(c.id)}
              disabled={loading}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50"
            >
              <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
              <p className="text-xs text-gray-400 mt-0.5">เกิด {formatBirthDate(c.birthDate)}</p>
            </button>
          ))}

          <button
            onClick={() => submitRegistration()}
            disabled={loading}
            className="w-full text-center px-4 py-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition disabled:opacity-50"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'ไม่ใช่ ฉันเป็นคนไข้ใหม่'}
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">สมัครสมาชิก</h1>
      <p className="text-sm text-gray-400 mb-6">เริ่มต้นดูแลสุขภาพช่องปากไปกับเรา</p>

      {error && (
        <p className="bg-red-50 text-red-600 text-sm text-center rounded-lg py-2 mb-4">{error}</p>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="ชื่อ" name="firstName" value={form.firstName} onChange={handleChange} placeholder="ชื่อ" icon={userIcon} />
          <AuthField label="นามสกุล" name="lastName" value={form.lastName} onChange={handleChange} placeholder="นามสกุล" icon={userIcon} />
        </div>
        <AuthField label="Username" name="username" value={form.username} onChange={handleChange} placeholder="username" icon={userIcon} />
        <AuthField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@clinic.com" icon={mailIcon} />
        <AuthField label="เบอร์โทรศัพท์" name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" icon={phoneIcon} />
        <AuthField label="วันเกิด" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} icon={calendarIcon} />
        <PasswordField label="รหัสผ่าน" name="password" value={form.password} onChange={handleChange} placeholder="ตั้งรหัสผ่าน" icon={lockIcon} />
      </div>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        {!loading && (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>

      <p className="text-center text-sm mt-6 text-gray-500">
        มีบัญชีแล้ว?{' '}
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          เข้าสู่ระบบ
        </a>
      </p>
    </AuthLayout>
  )
}
