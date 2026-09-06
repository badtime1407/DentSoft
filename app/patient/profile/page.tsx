/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { IconUpload, IconTrash } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { Skeleton } from '@/components/shared/Skeleton'

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/patient/me')
      .then((res) => res.json())
      .then((data: { firstName?: string; lastName?: string; phone?: string | null; birthDate?: string | null; email?: string; avatarUrl?: string | null }) => {
        setValues({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          phone: data.phone ?? '',
          birthDate: data.birthDate ?? '',
        })
        setEmail(data.email ?? '')
        setAvatarUrl(data.avatarUrl ?? null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setAvatarError('')
    setIsUploadingAvatar(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      const res = await fetch('/api/patient/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAvatarError(data.error ?? 'อัปโหลดรูปไม่สำเร็จ')
        return
      }
      setAvatarUrl(data.avatarUrl)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  async function handleAvatarRemove() {
    setAvatarError('')
    const res = await fetch('/api/patient/avatar', { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      setAvatarError(data.error ?? 'ลบรูปไม่สำเร็จ')
      return
    }
    setAvatarUrl(null)
  }

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
            <div className="space-y-5">
              <div>
                <Skeleton className="h-3 w-12 mb-1.5" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Skeleton className="h-3 w-8 mb-1.5" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div>
                  <Skeleton className="h-3 w-14 mb-1.5" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-1.5" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-3 w-20 mb-1.5" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="โปรไฟล์" className="w-full h-full object-cover" />
                  ) : (
                    values.firstName.charAt(0) || '?'
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label
                      className={`cursor-pointer px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${focusRing} ${isUploadingAvatar ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <IconUpload className="w-3.5 h-3.5" />
                      {isUploadingAvatar ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปโปรไฟล์'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleAvatarRemove}
                        className={`p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition ${focusRing}`}
                        title="ลบรูปโปรไฟล์"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {avatarError && <p className="text-xs text-rose-600 font-medium">{avatarError}</p>}
                </div>
              </div>

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
