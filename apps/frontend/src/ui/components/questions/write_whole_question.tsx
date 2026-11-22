import { useState } from 'react'
import type { QuestionAnswer, WriteWholeQuestion } from '../../../domain/models/question/question.ts'
import { WordPrompt } from './word_prompt.tsx'

type Props = {
  question: WriteWholeQuestion
  keyboardPhonemes: string[]
  disabled: boolean
  onAnswer: (answer: QuestionAnswer) => void
}

export function WriteWholeQuestionView({ question, keyboardPhonemes, disabled, onAnswer }: Props) {
  const [answer, setAnswer] = useState<string[]>([])

  function addPhoneme(phoneme: string) {
    setAnswer((current) =>
      current.length < question.answerPhonemes.length ? [...current, phoneme] : current
    )
  }

  return (
    <div className="question-content">
      <WordPrompt word={question.promptWord} pronunciationUrl={question.pronunciationUrl} />
      <p className="question-instruction">Écris toute la transcription phonétique.</p>
      <div className="phoneme-row" aria-label="Ta transcription">
        {question.answerPhonemes.map((_, index) => (
          <button
            className={`phoneme-tile ${answer[index] ? 'phoneme-tile--filled' : ''}`}
            key={`${question.id}-slot-${index}`}
            type="button"
            disabled={disabled || !answer[index]}
            onClick={() => setAnswer((current) => current.filter((__, item) => item !== index))}
            aria-label={answer[index] ? `Retirer ${answer[index]}` : 'Emplacement vide'}
          >
            {answer[index] ?? '·'}
          </button>
        ))}
      </div>
      <div className="phoneme-options" aria-label="Phonèmes disponibles">
        {keyboardPhonemes.map((phoneme, index) => (
          <button
            className="phoneme-option"
            key={`${phoneme}-${index}`}
            type="button"
            disabled={disabled || answer.length === question.answerPhonemes.length}
            onClick={() => addPhoneme(phoneme)}
          >
            {phoneme}
          </button>
        ))}
      </div>
      <button
        className="primary-button question-submit"
        type="button"
        disabled={disabled || answer.length !== question.answerPhonemes.length}
        onClick={() => onAnswer({ type: 'write_whole', phonemes: answer })}
      >
        Valider
      </button>
    </div>
  )
}
