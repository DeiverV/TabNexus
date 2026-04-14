import { useState, useCallback } from 'react'
import type { TabEntry } from '@/types'

interface UseChromeTabs {
  captureCurrentWindow: () => Promise<TabEntry[]>
  capturing: boolean
  error: string | null
}

export function useChromeTabs(): UseChromeTabs {
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const captureCurrentWindow = useCallback(async (): Promise<TabEntry[]> => {
    try {
      setCapturing(true)
      setError(null)

      const tabs = await chrome.tabs.query({ currentWindow: true })

      return tabs
        .filter((tab) => tab.url && !tab.url.startsWith('chrome://'))
        .map((tab) => ({
          title: tab.title ?? tab.url ?? 'Untitled',
          url: tab.url ?? '',
          favIcon: tab.favIconUrl,
        }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to capture tabs'
      setError(message)
      return []
    } finally {
      setCapturing(false)
    }
  }, [])

  return { captureCurrentWindow, capturing, error }
}
