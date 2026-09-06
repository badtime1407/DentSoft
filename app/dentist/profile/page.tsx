/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { IconUpload, IconTrash } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { Skeleton } from '@/components/shared/Skeleton'

type ProfileValues = {
  title: string
  firstName: string
  lastName: string
  specialty: string
  phone: string
}

const titles = ['ทพ.', 'ทพญ.']
const specialties = ['ทันตกรรมทั่วไป', 'ทันตกรรมจัดฟัน', 'ศัลยกรรมช่องปาก']

const emptyValues: ProfileValues = { title: 'ทพ.', firstName: '', lastName: '', specialty: '', phone: '' }
const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-bold text-gray-700 mb-1.5 block'

export default function DentistProfilePage() {
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
    fetch('/api/dentist/me')
      .then((res) => res.json())
      .then((data: {
        title?: string; firstName?: string; lastName?: string; specialty?: string | null
        phone?: string | null; email?: string; avatarUrl?: string | null
      }) => {
        setValues({
          title: data.title ?? 'ทพ.',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          specialty: data.specialty ?? '',
          phone: data.phone ?? '',
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
      const res = await fetch('/api/avatar', {
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
    const res = await fetch('/api/avatar', { method: 'DELETE' })
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
      const res = await fetch('/api/dentist/me', {
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
    <>
      <PageHeader title="แก้ไขโปรไฟล์" subtitle="แก้ไขข้อมูลส่วนตัวของคุณ" />

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5 max-w-xl">
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
                      className={`p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition ${focusRing}`}
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
              <input disabled value={email} className={`${inputClass} bg-gray-50 text-gray-400`} />
            </div>

            <div className="grid grid-cols-[100px_1fr_1fr] gap-3">
              <div>
                <label className={labelClass}>คำนำหน้า</label>
                <select className={inputClass} value={values.title} onChange={(e) => update('title', e.target.value)}>
                  {titles.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
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
              <label className={labelClass}>ความเชี่ยวชาญ</label>
              <select className={inputClass} value={values.specialty} onChange={(e) => update('specialty', e.target.value)}>
                <option value="">ไม่ระบุ</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>เบอร์โทร</label>
              <input className={inputClass} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
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
    </>
  )
}
