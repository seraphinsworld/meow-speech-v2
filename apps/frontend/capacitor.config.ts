import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'be.seraphinsworld.meowspeechv2',
  appName: 'Meow Speech',
  webDir: 'dist',
  server: {
    iosScheme: 'capacitor',
    androidScheme: 'https',
  },
}

export default config
