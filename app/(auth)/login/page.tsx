'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthField, PasswordField } from '@/components/auth/AuthField'

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
  setLoading(true)
  setError('')

  const res = await signIn('credentials', {
    identifier,
    password,
    redirect: false,
  })

  setLoading(false)

  if (res?.error) {
      setError('Email/Username หรือรหัสผ่านไม่ถูกต้อง')
    } else {
      // ดึง session เพื่อเช็ค role
      const session = await fetch('/api/auth/session').then((r) => r.json())
      const role = session?.user?.role

      if (role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else if (role === 'DENTIST') {
        router.push('/dentist/dashboard')
      } else {
      router.push('/patient/dashboard')
      }
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">เข้าสู่ระบบ</h1>
      <p className="text-sm text-gray-400 mb-6">ยินดีต้อนรับกลับ dental professional</p>

      {error && (
        <p className="bg-red-50 text-red-600 text-sm text-center rounded-lg py-2 mb-4">{error}</p>
      )}

      <div className="space-y-4">
        <AuthField
          label="Email หรือ Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="name@clinic.com"
          icon={
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
              <path d="m4.5 7 7.5 6 7.5-6" />
            </svg>
          }
        />

        <PasswordField
          label="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอกรหัสผ่าน"
          labelAction={
            <a href="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
              ลืมรหัสผ่าน?
            </a>
          }
          icon={
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
              <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
          }
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        {!loading && (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-gray-100 flex-1" />
        <span className="text-xs text-gray-400">หรือ</span>
        <div className="h-px bg-gray-100 flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => signIn('google', { callbackUrl: '/api/auth/callback-redirect' })}
          className="border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <button
          onClick={() => signIn('facebook', { callbackUrl: '/api/auth/callback-redirect' })}
          className="bg-[#1877F2] text-white py-2.5 rounded-xl hover:bg-[#166FE5] transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <p className="text-center text-sm mt-6 text-gray-500">
        ยังไม่มีบัญชี?{' '}
        <a href="/register" className="text-blue-600 font-medium hover:underline">
          สมัครสมาชิก
        </a>
      </p>
    </AuthLayout>
  )
}
