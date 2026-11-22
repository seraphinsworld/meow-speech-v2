import type { Question } from '../../../domain/models/question.ts'

export function correctionForQuestion(question: Question): string {
  switch (question.type) {
    case 'write_whole':
      return `La bonne transcription était /${question.answerPhonemes.join('')}/.`
    case 'missing_phoneme':
      return `Le phonème attendu était ${question.answer}.`
    case 'find_mistake':
      if (!question.hasMistake) return "Il n'y avait pas d'erreur."
      return `Le son incorrect était ${question.wrongPhoneme} ; il fallait ${question.expectedPhoneme}.`
  }
}

export function QuestionFeedback({ question }: { question: Question }) {
  return (
    <aside className="question-feedback" role="status">
      <strong>Presque.</strong>
      <span>{correctionForQuestion(question)}</span>
    </aside>
  )
}
