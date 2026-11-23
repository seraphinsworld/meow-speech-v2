import { Capacitor } from '@capacitor/core'
import { KeychainAccess, SecureStorage } from '@aparajita/capacitor-secure-storage'

const TOKEN_KEY = 'meow-speech-v2.access-token'
const NATIVE_TOKEN_KEY = 'access-token'
const secureStorageReady = Capacitor.isNativePlatform()
  ? SecureStorage.setKeyPrefix('meow-speech-v2_')
  : Promise.resolve()

/** Use Keychain/Keystore in native builds and preserve the existing browser token. */
export const tokenStore = {
  async get(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) return localStorage.getItem(TOKEN_KEY)
    await secureStorageReady
    // set() serializes JSON; get() decodes it (getItem() would keep the quotes).
    const token = await SecureStorage.get(NATIVE_TOKEN_KEY, false, false)
    if (token !== null && typeof token !== 'string') {
      throw new Error('Invalid access token in secure storage')
    }
    return token
  },
  async set(token: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      localStorage.setItem(TOKEN_KEY, token)
      return
    }
    await secureStorageReady
    await SecureStorage.set(
      NATIVE_TOKEN_KEY,
      token,
      false,
      false,
      KeychainAccess.whenUnlockedThisDeviceOnly
    )
  },
  async clear(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      localStorage.removeItem(TOKEN_KEY)
      return
    }
    await secureStorageReady
    await SecureStorage.removeItem(NATIVE_TOKEN_KEY)
  },
}
