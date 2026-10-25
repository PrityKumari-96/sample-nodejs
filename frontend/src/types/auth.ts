export type AuthUser = { id: number; name?: string; email?: string; salespersonId?: number }
export type AuthResponse = { token: string; user?: AuthUser }
export type LoginPayload = { email: string; password: string }
export type SignupPayload = { name: string; email: string; password: string; confirmPassword: string }
