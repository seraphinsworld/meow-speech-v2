const TOKEN_KEY = 'meow-speech-v2.access-token'

/** Web token adapter. Replace with native secure storage when wiring Capacitor. */
export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}
