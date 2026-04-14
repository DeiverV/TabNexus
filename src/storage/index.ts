/**
 * Storage abstraction layer.
 * All chrome.storage.sync access goes through here — never call it directly from components.
 */

import type { Session, StorageData } from '@/types'

const STORAGE_KEY = 'tabnexus_data'

async function getData(): Promise<StorageData> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEY, (result) => {
      const data = result[STORAGE_KEY] as StorageData | undefined
      resolve(data ?? { sessions: [] })
    })
  })
}

async function setData(data: StorageData): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: data }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve()
      }
    })
  })
}

export async function getSessions(): Promise<Session[]> {
  const data = await getData()
  return data.sessions
}

export async function saveSession(session: Session): Promise<void> {
  const data = await getData()
  const existing = data.sessions.findIndex((s) => s.id === session.id)
  if (existing >= 0) {
    data.sessions[existing] = session
  } else {
    data.sessions.push(session)
  }
  await setData(data)
}

export async function deleteSession(id: string): Promise<void> {
  const data = await getData()
  data.sessions = data.sessions.filter((s) => s.id !== id)
  await setData(data)
}

export async function updateSession(
  id: string,
  patch: Partial<Omit<Session, 'id' | 'createdAt'>>
): Promise<void> {
  const data = await getData()
  const index = data.sessions.findIndex((s) => s.id === id)
  if (index < 0) throw new Error(`Session ${id} not found`)
  data.sessions[index] = { ...data.sessions[index], ...patch }
  await setData(data)
}
