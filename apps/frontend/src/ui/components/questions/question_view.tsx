import type { Question, QuestionAnswer } from '../../../domain/models/question/question.ts'
import { FindMistakeQuestionView } from './find_mistake_question.tsx'
import { MissingPhonemeQuestionView } from './missing_phoneme_question.tsx'
import { WriteWholeQuestionView } from './write_whole_question.tsx'

type Props = {
  question: Question
  keyboardPhonemes: string[]
  disabled: boolean
  onAnswer: (answer: QuestionAnswer) => void
}

export function QuestionView({ question, keyboardPhonemes, disabled, onAnswer }: Props) {
  switch (question.type) {
    case 'write_whole':
      return (
        <WriteWholeQuestionView
          question={question}
          keyboardPhonemes={keyboardPhonemes}
          disabled={disabled}
          onAnswer={onAnswer}
        />
      )
    case 'missing_phoneme':
      return (
        <MissingPhonemeQuestionView question={question} disabled={disabled} onAnswer={onAnswer} />
      )
    case 'find_mistake':
      return <FindMistakeQuestionView question={question} disabled={disabled} onAnswer={onAnswer} />
  }
}
