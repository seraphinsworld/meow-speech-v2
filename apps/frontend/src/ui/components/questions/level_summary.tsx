import { Link } from 'react-router'
import type { Question } from '../../../domain/models/question/question.ts'
import { MistakeReview } from './mistake_review.tsx'

type Props = {
  unitId: number
  levelNumber: number
  questionCount: number
  mistakes: Question[]
}

export function LevelSummary({ unitId, levelNumber, questionCount, mistakes }: Props) {
  return (
    <main className="questionnaire-screen">
      <section className="questionnaire-card level-summary">
        <span className="eyebrow">NIVEAU {levelNumber} TERMINÉ</span>
        <h1>{mistakes.length === 0 ? 'Bravo !' : 'C’est terminé.'}</h1>
        <p className="summary-score">
          {questionCount - mistakes.length} bonnes réponses sur {questionCount}
        </p>
        {mistakes.length > 0 ? (
          <MistakeReview mistakes={mistakes} />
        ) : (
          <p className="summary-perfect">Aucune faute à revoir. Bien joué !</p>
        )}
        <Link className="primary-button question-submit" to={`/units/${unitId}`}>
          Retour aux niveaux
        </Link>
      </section>
    </main>
  )
}
