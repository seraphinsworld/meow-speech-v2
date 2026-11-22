import { useState } from 'react'
import type { MissingPhonemeQuestion, QuestionAnswer } from '../../../domain/models/question.ts'
import { WordPrompt } from './word_prompt.tsx'

type Props = {
  question: MissingPhonemeQuestion
  disabled: boolean
  onAnswer: (answer: QuestionAnswer) => void
}

export function MissingPhonemeQuestionView({ question, disabled, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="question-content">
      <WordPrompt word={question.promptWord} pronunciationUrl={question.pronunciationUrl} />
      <p className="question-instruction">Choisis le phonème manquant.</p>
      <div className="phoneme-row" aria-label="Transcription à compléter">
        {question.transcription.map((phoneme, index) => (
          <span
            className={`phoneme-tile ${index === question.targetIndex ? 'phoneme-tile--blank' : ''}`}
            key={`${question.id}-phoneme-${index}`}
          >
            {index === question.targetIndex ? (selected ?? '✦') : phoneme}
          </span>
        ))}
      </div>
      <div className="phoneme-options" aria-label="Réponses possibles">
        {question.options.map((option, index) => (
          <button
            className={`phoneme-option ${selected === option ? 'phoneme-option--selected' : ''}`}
            key={`${option}-${index}`}
            type="button"
            disabled={disabled}
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="primary-button question-submit"
        type="button"
        disabled={disabled || selected === null}
        onClick={() => selected && onAnswer({ type: 'missing_phoneme', phoneme: selected })}
      >
        Valider
      </button>
    </div>
  )
}
