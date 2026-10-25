import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { login } from '../services/auth'
import { readableError } from '../utils/formatters'

export default function LoginPage({ navigate, onAuthenticated }: { navigate: (path: string) => void; onAuthenticated: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); if (!email.trim() || !password) { setError('Enter your email and password.'); return } setBusy(true); try { await login({ email: email.trim(), password }); onAuthenticated() } catch (e) { setError(readableError(e)) } finally { setBusy(false) } }
  return <AuthLayout eyebrow="Salesperson access" title="Welcome back" subtitle="Sign in to price cycles and manage saved builds."><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{error && <div className="inline-error">{error}</div>}<button className="primary auth-submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form><p className="auth-switch">New salesperson? <button onClick={() => navigate('/signup')}>Create an account</button></p></AuthLayout>
}

export function AuthLayout({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) { return <div className="auth-page"><div className="auth-visual"><span className="auth-mark">HC</span><p className="eyebrow">HeroCycle / Pricing engine</p><h1>Build the right<br /><em>ride.</em></h1><p>Precise pricing for every component, every salesperson, every time.</p></div><section className="auth-card"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="auth-subtitle">{subtitle}</p>{children}</section></div> }
