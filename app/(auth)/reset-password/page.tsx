'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordField } from '@/components/auth/AuthField'

const lockIcon = (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
)

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/new-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setMessage('เปลี่ยนรหัสผ่านสำเร็จ!')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งรหัสผ่านใหม่</h1>
      <p className="text-sm text-gray-400 mb-6">กรอกรหัสผ่านใหม่ของคุณด้านล่าง</p>

      {message && (
        <p className="bg-blue-50 text-blue-700 text-sm text-center rounded-lg py-2 mb-4">{message}</p>
      )}
      {error && (
        <p className="bg-red-50 text-red-600 text-sm text-center rounded-lg py-2 mb-4">{error}</p>
      )}

      <div className="space-y-4">
        <PasswordField
          label="รหัสผ่านใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอกรหัสผ่านใหม่"
          icon={lockIcon}
        />
        <PasswordField
          label="ยืนยันรหัสผ่านใหม่"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          icon={lockIcon}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'กำลังบันทึก...' : 'ยืนยันรหัสผ่านใหม่'}
        {!loading && (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
