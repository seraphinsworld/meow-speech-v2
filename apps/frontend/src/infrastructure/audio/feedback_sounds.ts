let audioContext: AudioContext | null = null

export function playKeyboardTap(volume: number) {
  playTone(620, 0.045, volume)
}

export function playSuccessChime(volume: number) {
  playTone(587, 0.16, volume, 0)
  playTone(740, 0.2, volume, 0.1)
  playTone(880, 0.26, volume, 0.2)
}

function playTone(frequency: number, duration: number, volume: number, delay = 0) {
  if (volume <= 0 || typeof window === 'undefined') return
  const context = getAudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const startAt = context.currentTime + delay

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startAt)
  gain.gain.setValueAtTime(Math.min(volume, 1) * 0.18, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

function getAudioContext() {
  if (!audioContext) audioContext = new window.AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}
