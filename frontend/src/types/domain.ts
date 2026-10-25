export type Component = { id: number; componentType: string; brand: string; name: string; size?: string | null; specification?: string | null; active?: boolean }
export type Price = { price: number; effectiveFrom: string; effectiveTo?: string | null }
export type Line = Component & { quantity: number }
export type Result = { items?: Array<Line & { unitPrice: number; lineTotal: number }>; subtotal: number; gstPercent?: number; gstAmount?: number; discountPercent?: number; discountAmount?: number; totalPrice: number; id?: number; configurationName?: string; pricingDate?: string; createdAt?: string }
export type Notify = (value: { kind: 'success' | 'error'; text: string }) => void
export type SavedItem = { id?: number; configurationId?: number; configurationName?: string; pricingDate?: string; createdAt?: string; subtotal?: number; gstPercent?: number; gstAmount?: number; discountPercent?: number; discountAmount?: number; totalPrice?: number; items?: Array<Record<string, unknown>>; snapshots?: Array<Record<string, unknown>>; componentSnapshots?: Array<Record<string, unknown>>; configurationItems?: Array<Record<string, unknown>> }
