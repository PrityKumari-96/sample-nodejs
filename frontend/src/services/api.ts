import { API_BASE } from '../constants/app'
import { getAuthToken } from './auth'
import type { Result } from '../types/domain'

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers } })
  const text = await response.text(); let body: unknown = text
  try { body = text ? JSON.parse(text) : null } catch { /* plain text response */ }
  if (!response.ok) throw new Error(typeof body === 'object' && body && 'message' in body ? String(body.message) : `Request failed (${response.status})`)
  return body as T
}

export function normalizeResult(value: unknown): Result {
  const root = (value || {}) as Record<string, unknown>
  const source = (root.configuration && typeof root.configuration === 'object' ? root.configuration : root) as Record<string, unknown>
  const rawItems = source.items || source.snapshots || source.configurationItems || source.componentSnapshots || source.configurationSnapshots || source.components || source.configurationComponents || []
  const items = Array.isArray(rawItems) ? rawItems.map((raw) => { const item = raw as Record<string, unknown>; const quantity = Number(item.quantity || 1); const unitPrice = Number(item.unitPrice ?? item.price ?? 0); return { id: Number(item.componentId ?? item.id ?? 0), componentType: String(item.componentType || ''), brand: String(item.brand || ''), name: String(item.name || ''), size: item.size as string | null, specification: item.specification as string | null, quantity, unitPrice, lineTotal: Number(item.lineTotal ?? item.totalPrice ?? unitPrice * quantity) } }) : []
  return { ...source as Result, id: Number(source.id ?? source.configurationId ?? root.id ?? root.configurationId ?? 0), items, subtotal: Number(source.subtotal || 0), gstPercent: Number(source.gstPercent || 0), gstAmount: Number(source.gstAmount || 0), discountPercent: Number(source.discountPercent || 0), discountAmount: Number(source.discountAmount || 0), totalPrice: Number(source.totalPrice ?? source.total ?? 0) }
}
