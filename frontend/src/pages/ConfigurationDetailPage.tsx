import { useEffect, useState } from 'react'
import Heading from '../components/common/Heading'
import ResultPanel from '../components/common/ResultPanel'
import { api, normalizeResult } from '../services/api'
import { readableError } from '../utils/formatters'
import type { Result } from '../types/domain'
export default function ConfigurationDetailPage({ id, navigate }: { id: string; navigate: (path: string) => void }) { const [result, setResult] = useState<Result | null>(null); const [error, setError] = useState(''); useEffect(() => { api<unknown>(`/api/configurations/${id}`).then((data) => setResult(normalizeResult(data))).catch((e) => setError(readableError(e))) }, [id]); return <div className="page"><button className="back" onClick={() => navigate('/configurations')}>← Saved builds</button><Heading eyebrow={`Snapshot / #${id}`} title={result?.configurationName || 'Configuration detail'} subtitle={result ? `Pricing date ${result.pricingDate}` : 'Loading snapshot...'} />{error ? <div className="inline-error">{error}</div> : <div className="detail-result"><ResultPanel result={result} navigate={navigate} /></div>}</div> }
