import { useEffect, useState } from 'react'
import { API_BASE } from './constants/app'
import type { Notify } from './types/domain'
import { useComponents } from './hooks/useComponents'
import DashboardPage from './pages/DashboardPage'
import ComponentsPage from './pages/ComponentsPage'
import ComponentDetailPage from './pages/ComponentDetailPage'
import CalculatorPage from './pages/CalculatorPage'
import ConfigurationDetailPage from './pages/ConfigurationDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Configurations from './SavedBuilds'
import { getAuthToken, logout } from './services/auth'
import './cycle.css'

export default function CycleApp() {
  const [path, setPath] = useState(window.location.pathname)
  const [authenticated, setAuthenticated] = useState(Boolean(getAuthToken()))
  const components = useComponents()
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const navigate = (next: string) => { window.history.pushState({}, '', next); setPath(next); window.scrollTo(0, 0) }
  useEffect(() => { const pop = () => setPath(window.location.pathname); addEventListener('popstate', pop); return () => removeEventListener('popstate', pop) }, [])
  const notify: Notify = setNotice
  if (!authenticated) return path === '/signup' ? <SignupPage navigate={navigate} /> : <LoginPage navigate={navigate} onAuthenticated={() => { setAuthenticated(true); navigate('/') }} />
  const page = path === '/' ? <DashboardPage components={components} navigate={navigate} /> : path === '/components' ? <ComponentsPage components={components} navigate={navigate} /> : path.startsWith('/components/') ? <ComponentDetailPage id={path.split('/')[2]} navigate={navigate} notify={notify} /> : path === '/calculator' ? <CalculatorPage components={components} navigate={navigate} notify={notify} /> : path === '/configurations' ? <Configurations /> : path.startsWith('/configurations/') ? <ConfigurationDetailPage id={path.split('/')[2]} navigate={navigate} /> : <DashboardPage components={components} navigate={navigate} />
  return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => navigate('/')}><span className="brand-mark">HC</span>Hero<span className="brand-accent">Cycle</span></button><nav><button onClick={() => navigate('/components')}>Inventory</button><button onClick={() => navigate('/calculator')}>Price a cycle</button><button onClick={() => navigate('/configurations')}>Saved builds</button></nav><span className="api-status"><i /> API live</span><button className="logout-button" onClick={() => { logout(); setAuthenticated(false); navigate('/login') }}>Logout</button></header><main>{notice && <div className={`notice ${notice.kind}`} role="alert">{notice.text}<button onClick={() => setNotice(null)} aria-label="Dismiss">×</button></div>}{page}</main><footer><span>HERO CYCLE / PRICING ENGINE</span><span>Live data from <b>{API_BASE}</b></span></footer></div>
}
