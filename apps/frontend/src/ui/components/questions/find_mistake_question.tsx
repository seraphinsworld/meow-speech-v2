import type { FindMistakeQuestion, QuestionAnswer } from '../../../domain/models/question.ts'
import { WordPrompt } from './word_prompt.tsx'

type Props = {
  question: FindMistakeQuestion
  disabled: boolean
  onAnswer: (answer: QuestionAnswer) => void
}

export function FindMistakeQuestionView({ question, disabled, onAnswer }: Props) {
  return (
    <div className="question-content">
      <WordPrompt word={question.promptWord} pronunciationUrl={question.pronunciationUrl} />
      <p className="question-instruction">
        Repère le phonème incorrect, ou choisis « Aucune erreur ».
      </p>
      <div className="phoneme-row" aria-label="Transcription proposée">
        {question.displayedTranscription.map((phoneme, index) => (
          <button
            className="phoneme-tile phoneme-tile--selectable"
            key={`${question.id}-phoneme-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer({ type: 'find_mistake', wrongIndex: index })}
          >
            {phoneme}
          </button>
        ))}
      </div>
      <button
        className="secondary-button"
        type="button"
        disabled={disabled}
        onClick={() => onAnswer({ type: 'find_mistake', wrongIndex: null })}
      >
        Aucune erreur
      </button>
    </div>
  )
}
