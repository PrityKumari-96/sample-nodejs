import { API_BASE } from '../constants/app'
import type { AuthResponse, LoginPayload, SignupPayload } from '../types/auth'

const TOKEN_KEY = 'herocycle.auth.token'
const USER_KEY = 'herocycle.auth.user'

async function authRequest<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const text = await response.text()
  let body: unknown = text
  try { body = text ? JSON.parse(text) : null } catch { /* plain text response */ }
  if (!response.ok) throw new Error(typeof body === 'object' && body && 'message' in body ? String(body.message) : `Request failed (${response.status})`)
  return body as T
}

export async function login(payload: LoginPayload) {
  const response = await authRequest<AuthResponse>('/api/auth/login', payload)
  localStorage.setItem(TOKEN_KEY, response.token)
  if (response.user) localStorage.setItem(USER_KEY, JSON.stringify(response.user))
  return response
}

export async function signup(payload: SignupPayload) {
  return authRequest<AuthResponse>('/api/auth/signup', { name: payload.name, email: payload.email, password: payload.password })
}

export function getAuthToken() { return localStorage.getItem(TOKEN_KEY) }
export function getAuthUser() { const value = localStorage.getItem(USER_KEY); try { return value ? JSON.parse(value) : null } catch { return null } }
export function logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) }
