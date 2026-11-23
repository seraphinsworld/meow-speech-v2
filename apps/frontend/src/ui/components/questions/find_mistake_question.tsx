import { useState } from 'react'
import type {
  FindMistakeQuestion,
  QuestionAnswer,
} from '../../../domain/models/question/question.ts'
import { WordPrompt } from './word_prompt.tsx'

type Props = {
  question: FindMistakeQuestion
  disabled: boolean
  autoValidate: boolean
  pronunciationVolume: number
  onTap: () => void
  onAnswer: (answer: QuestionAnswer) => void
}

export function FindMistakeQuestionView({
  question,
  disabled,
  autoValidate,
  pronunciationVolume,
  onTap,
  onAnswer,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null | undefined>(undefined)

  function selectMistake(wrongIndex: number | null) {
    onTap()
    setSelectedIndex(wrongIndex)
    if (autoValidate) onAnswer({ type: 'find_mistake', wrongIndex })
  }

  return (
    <div className="question-content">
      <WordPrompt
        word={question.promptWord}
        pronunciationUrl={question.pronunciationUrl}
        volume={pronunciationVolume}
      />
      <p className="question-instruction">
        Repère le phonème incorrect, ou choisis « Aucune erreur ».
      </p>
      <div className="phoneme-row" aria-label="Transcription proposée">
        {question.displayedTranscription.map((phoneme, index) => (
          <button
            className={`phoneme-tile phoneme-tile--selectable ${selectedIndex === index ? 'phoneme-tile--filled' : ''}`}
            key={`${question.id}-phoneme-${index}`}
            type="button"
            disabled={disabled}
            aria-pressed={selectedIndex === index}
            onClick={() => selectMistake(index)}
          >
            {phoneme}
          </button>
        ))}
      </div>
      <button
        className="secondary-button"
        type="button"
        disabled={disabled}
        aria-pressed={selectedIndex === null}
        onClick={() => selectMistake(null)}
      >
        Aucune erreur
      </button>
      {!autoValidate && (
        <button
          className="primary-button question-submit"
          type="button"
          disabled={disabled || selectedIndex === undefined}
          onClick={() =>
            selectedIndex !== undefined &&
            onAnswer({ type: 'find_mistake', wrongIndex: selectedIndex })
          }
        >
          Valider
        </button>
      )}
    </div>
  )
}
