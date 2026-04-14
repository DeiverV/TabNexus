import type { Session } from '@/types'
import { SessionModule } from '@/components/molecules/SessionModule/SessionModule'
import styles from './SessionLibrary.module.css'

export interface SessionLibraryProps {
  sessions: Session[]
  loading: boolean
  error: string | null
  onOpen: (id: string) => void
  onInspect: (id: string) => void
  onDelete: (id: string) => void
}

export function SessionLibrary({
  sessions,
  loading,
  error,
  onOpen,
  onInspect,
  onDelete,
}: SessionLibraryProps) {
  if (loading) {
    return (
      <div data-testid="session-library" className={styles.library}>
        <div
          className={styles.loadingState}
          role="status"
          aria-label="Loading sessions"
          aria-busy="true"
        >
          <span>LOADING SESSIONS..._</span>
        </div>
      </div>
    )
  }

  if (error !== null) {
    return (
      <div data-testid="session-library" className={styles.library}>
        <div className={styles.errorState} role="alert">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div data-testid="session-library" className={styles.library}>
        <div className={styles.emptyState}>
          <span>NO SESSIONS FOUND</span>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="session-library" className={styles.library}>
      <div className={styles.grid} role="list">
        {sessions.map((session) => (
          <div key={session.id} role="listitem">
            <SessionModule
              session={session}
              onOpen={onOpen}
              onInspect={onInspect}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
