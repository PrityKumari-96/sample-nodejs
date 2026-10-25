import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Component } from '../types/domain'

export function useComponents() {
  const [components, setComponents] = useState<Component[]>([])
  useEffect(() => { api<Component[]>('/api/components').then(setComponents).catch(() => setComponents([])) }, [])
  return components
}
