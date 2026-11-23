import { Link } from 'react-router'
import type { Question } from '../../../domain/models/question/question.ts'
import { MistakeReview } from './mistake_review.tsx'

type Props = {
  unitId: number
  levelNumber: number
  questionCount: number
  mistakes: Question[]
  completionStatus: 'pending' | 'saving' | 'saved' | 'error'
  completionError: string | null
  onRetry: () => void
}

export function LevelSummary({
  unitId,
  levelNumber,
  questionCount,
  mistakes,
  completionStatus,
  completionError,
  onRetry,
}: Props) {
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
        {completionStatus === 'saving' && <p role="status">Enregistrement de votre progression…</p>}
        {completionStatus === 'saved' && <p role="status">Votre progression est enregistrée.</p>}
        {completionStatus === 'error' && (
          <p className="units-error" role="alert">
            {completionError ?? 'Impossible d’enregistrer votre progression.'}{' '}
            <button type="button" onClick={onRetry}>
              Réessayer
            </button>
          </p>
        )}
        <Link className="primary-button question-submit" to={`/units/${unitId}`}>
          Retour aux niveaux
        </Link>
      </section>
    </main>
  )
}
