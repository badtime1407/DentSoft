'use client'

import { useState } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthField } from '@/components/auth/AuthField'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)
    setMessage(data.message || data.error)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ลืมรหัสผ่าน</h1>
      <p className="text-sm text-gray-400 mb-6">กรอก Email ที่ลงทะเบียนไว้ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้</p>

      {message && (
        <p className="bg-blue-50 text-blue-700 text-sm text-center rounded-lg py-2 mb-4">{message}</p>
      )}

      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@clinic.com"
        icon={
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
            <path d="m4.5 7 7.5 6 7.5-6" />
          </svg>
        }
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
        {!loading && (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>

      <p className="text-center text-sm mt-6 text-gray-500">
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          กลับไปหน้า Login
        </a>
      </p>
    </AuthLayout>
  )
}
