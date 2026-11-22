type Props = { word: string; pronunciationUrl: string }

export function WordPrompt({ word, pronunciationUrl }: Props) {
  function replay() {
    void new Audio(pronunciationUrl).play().catch(() => undefined)
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
