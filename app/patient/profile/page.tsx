'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { focusRing } from '@/lib/shared/focus-ring'

type ProfileValues = {
  firstName: string
  lastName: string
  phone: string
  birthDate: string
}

const emptyValues: ProfileValues = { firstName: '', lastName: '', phone: '', birthDate: '' }
const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-bold text-slate-700 mb-1.5 block'

export default function PatientProfilePage() {
  const [email, setEmail] = useState('')
  const [values, setValues] = useState<ProfileValues>(emptyValues)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/patient/me')
      .then((res) => res.json())
      .then((data: { firstName?: string; lastName?: string; phone?: string | null; birthDate?: string | null; email?: string }) => {
        setValues({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          phone: data.phone ?? '',
          birthDate: data.birthDate ?? '',
        })
        setEmail(data.email ?? '')
      })
      .finally(() => setIsLoading(false))
  }, [])

  function update<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setError('')
    setIsSaving(true)
    try {
      const res = await fetch('/api/patient/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'บันทึกไม่สำเร็จ')
        return
      }
      setSaved(true)
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">แก้ไขโปรไฟล์</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">แก้ไขข้อมูลส่วนตัวของคุณ</p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition shrink-0 ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5 max-w-xl">
          {isLoading ? (
            <p className="text-sm text-slate-400 text-center py-6">กำลังโหลดข้อมูล...</p>
          ) : (
            <>
              <div>
                <label className={labelClass}>Email</label>
                <input disabled value={email} className={`${inputClass} bg-slate-50 text-slate-400`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>ชื่อ</label>
                  <input className={inputClass} value={values.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="ชื่อ" />
                </div>
                <div>
                  <label className={labelClass}>นามสกุล</label>
                  <input className={inputClass} value={values.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="นามสกุล" />
                </div>
              </div>

              <div>
                <label className={labelClass}>เบอร์โทร</label>
                <input className={inputClass} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
              </div>

              <div>
                <label className={labelClass}>วันเกิด</label>
                <input type="date" className={inputClass} value={values.birthDate} onChange={(e) => update('birthDate', e.target.value)} />
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
              {saved && <p className="text-xs text-emerald-600 font-medium">บันทึกข้อมูลเรียบร้อยแล้ว</p>}

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className={`w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md transition ${focusRing}`}
              >
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </>
          )}
        </div>
      </main>

      <PatientFooter />
    </div>
  )
}
