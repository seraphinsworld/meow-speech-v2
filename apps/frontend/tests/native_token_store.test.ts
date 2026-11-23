import { beforeEach, afterEach, expect, it, vi } from 'vitest'

const storage = vi.hoisted(() => ({ raw: null as string | null }))
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }))
vi.mock('@aparajita/capacitor-secure-storage', () => ({
  KeychainAccess: { whenUnlockedThisDeviceOnly: 1 },
  SecureStorage: {
    setKeyPrefix: async () => undefined,
    set: async (_key: string, value: string) => { storage.raw = JSON.stringify(value) },
    get: async () => storage.raw === null ? null : JSON.parse(storage.raw),
    getItem: async () => storage.raw,
    removeItem: async () => { storage.raw = null },
  },
}))

import { tokenStore } from '../src/infrastructure/http/token_store'
import { apiRequest } from '../src/infrastructure/http/api_client'

beforeEach(() => { storage.raw = null })
afterEach(() => { vi.unstubAllGlobals() })

it('sends the exact token after a native secure-storage round trip', async () => {
  const token = 'synthetic-access-token'
  await tokenStore.set(token)
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ data: [] })))
  vi.stubGlobal('fetch', fetchMock)
  await apiRequest('/units')
  expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    headers: expect.objectContaining({ Authorization: `Bearer ${token}` }),
  }))
})

it('decodes tokens already persisted by the previous native version', async () => {
  storage.raw = JSON.stringify('previously-stored-token')
  expect(await tokenStore.get()).toBe('previously-stored-token')
})

it('returns no token after clearing native storage', async () => {
  await tokenStore.set('synthetic-access-token')
  await tokenStore.clear()
  expect(await tokenStore.get()).toBeNull()
})
