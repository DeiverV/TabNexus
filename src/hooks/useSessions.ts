import { useState, useEffect, useCallback } from 'react'
import type { Session } from '@/types'
import { getSessions, saveSession, deleteSession, updateSession } from '@/storage'

interface UseSessionsReturn {
  sessions: Session[]
  loading: boolean
  error: string | null
  addSession: (session: Session) => Promise<void>
  removeSession: (id: string) => Promise<void>
  patchSession: (id: string, patch: Partial<Omit<Session, 'id' | 'createdAt'>>) => Promise<void>
  reload: () => Promise<void>
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSessions()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const addSession = useCallback(async (session: Session) => {
    await saveSession(session)
    await load()
  }, [load])

  const removeSession = useCallback(async (id: string) => {
    await deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const patchSession = useCallback(async (
    id: string,
    patch: Partial<Omit<Session, 'id' | 'createdAt'>>
  ) => {
    await updateSession(id, patch)
    await load()
  }, [load])

  return { sessions, loading, error, addSession, removeSession, patchSession, reload: load }
}
