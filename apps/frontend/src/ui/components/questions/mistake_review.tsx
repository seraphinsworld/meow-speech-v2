import type { Question } from '../../../domain/models/question.ts'
import { correctionForQuestion } from './question_feedback.tsx'

export function MistakeReview({ mistakes }: { mistakes: Question[] }) {
  return (
    <section className="mistake-review" aria-labelledby="mistake-review-title">
      <span className="eyebrow">RÉVISION</span>
      <h2 id="mistake-review-title">À revoir</h2>
      <p>Voici les questions auxquelles tu pourras revenir.</p>
      <ol className="mistake-review-list">
        {mistakes.map((question) => (
          <li className="mistake-review-item" key={question.id}>
            <strong>{question.promptWord}</strong>
            <span>{correctionForQuestion(question)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
