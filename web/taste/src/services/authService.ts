import axios from 'axios'

export interface User {
  id: string
  phone: string
  name: string
  role: string
}

export function normalizeCambodianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `+855${digits.startsWith('855') ? digits.slice(3) : digits}`
}

export async function loginWithPhone(phone: string, password: string, verificationCode: string): Promise<User> {
  try {
    const { data } = await axios.post<User>('/api/auth/login', { phone, password, verificationCode })
    return data
  } catch (cause) {
    if (axios.isAxiosError<{ message?: string }>(cause)) {
      throw new Error(cause.response?.data?.message ?? 'Unable to sign in.')
    }
    throw cause
  }
}

export async function signUpWithPhone(phone: string, password: string, verificationCode: string): Promise<User> {
  try {
    const { data } = await axios.post<User>('/api/auth/signup', { phone, password, verificationCode })
    return data
  } catch (cause) {
    if (axios.isAxiosError<{ message?: string }>(cause)) {
      throw new Error(cause.response?.data?.message ?? 'Unable to create the account.')
    }
    throw cause
  }
}
