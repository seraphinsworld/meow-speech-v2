import { useState } from 'react'
import type {
  QuestionAnswer,
  WriteWholeQuestion,
} from '../../../domain/models/question/question.ts'
import { WordPrompt } from './word_prompt.tsx'

type Props = {
  question: WriteWholeQuestion
  keyboardPhonemes: string[]
  disabled: boolean
  autoValidate: boolean
  pronunciationVolume: number
  onTap: () => void
  onAnswer: (answer: QuestionAnswer) => void
}

export function WriteWholeQuestionView({
  question,
  keyboardPhonemes,
  disabled,
  autoValidate,
  pronunciationVolume,
  onTap,
  onAnswer,
}: Props) {
  const [answer, setAnswer] = useState<string[]>([])

  function addPhoneme(phoneme: string) {
    onTap()
    if (answer.length >= question.answerPhonemes.length) return
    const nextAnswer = [...answer, phoneme]
    setAnswer(nextAnswer)
    if (autoValidate && nextAnswer.length === question.answerPhonemes.length) {
      onAnswer({ type: 'write_whole', phonemes: nextAnswer })
    }
  }

  return (
    <div className="question-content">
      <WordPrompt
        word={question.promptWord}
        pronunciationUrl={question.pronunciationUrl}
        volume={pronunciationVolume}
      />
      <p className="question-instruction">Écris toute la transcription phonétique.</p>
      <div className="phoneme-row" aria-label="Ta transcription">
        {question.answerPhonemes.map((_, index) => (
          <button
            className={`phoneme-tile ${answer[index] ? 'phoneme-tile--filled' : ''}`}
            key={`${question.id}-slot-${index}`}
            type="button"
            disabled={disabled || !answer[index]}
            onClick={() => {
              onTap()
              setAnswer((current) => current.filter((__, item) => item !== index))
            }}
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
      {!autoValidate && (
        <button
          className="primary-button question-submit"
          type="button"
          disabled={disabled || answer.length !== question.answerPhonemes.length}
          onClick={() => {
            onTap()
            onAnswer({ type: 'write_whole', phonemes: answer })
          }}
        >
          Valider
        </button>
      )}
    </div>
  )
}
