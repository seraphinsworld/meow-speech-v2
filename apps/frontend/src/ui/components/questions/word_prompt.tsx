type Props = { word: string; pronunciationUrl: string; volume: number }

export function WordPrompt({ word, pronunciationUrl, volume }: Props) {
  function replay() {
    const audio = new Audio(pronunciationUrl)
    audio.volume = volume
    void audio.play().catch(() => undefined)
  }

  return (
    <div className="question-word-row">
      <h2 className="question-word">{word}</h2>
      <button
        className="question-audio-button"
        type="button"
        onClick={replay}
        aria-label={`Rejouer la prononciation de ${word}`}
      >
        🔊
      </button>
    </div>
  )
}
