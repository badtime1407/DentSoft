export function validatePassword(password: string): string | null {
  if (typeof password !== 'string' || password.length < 8) {
    return 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return 'รหัสผ่านต้องมีทั้งตัวพิมพ์เล็กและตัวพิมพ์ใหญ่'
  }
  return null
}
