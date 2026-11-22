import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { useLevel } from '../../application/use_level.ts'
import { useUnits } from '../../application/use_units.ts'
import type { Question, QuestionAnswer } from '../../domain/models/question/question.ts'
import { isLevelActive, isUnitActive } from '../../domain/models/units.ts'
import { AppHeader } from '../components/app_header.tsx'
import { LevelSummary } from '../components/questions/level_summary.tsx'
import { QuestionFeedback } from '../components/questions/question_feedback.tsx'
import { QuestionView } from '../components/questions/question_view.tsx'

type Props = { onLogout: () => void; isLoggingOut: boolean }

const questionTitles: Record<Question['type'], string> = {
  write_whole: 'Transcription phonétique',
  missing_phoneme: 'Phonème manquant',
  find_mistake: 'Détecte la faute',
}

export function LevelQuestionnaireScreen({ onLogout, isLoggingOut }: Props) {
  const { unitId: rawUnitId, levelNumber: rawLevelNumber } = useParams()
  const unitId = Number(rawUnitId)
  const levelNumber = Number(rawLevelNumber)
  const validRoute =
    Number.isInteger(unitId) && unitId > 0 && Number.isInteger(levelNumber) && levelNumber > 0
  const unitsQuery = useUnits()
  const levelQuery = useLevel(unitId, levelNumber)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [revealedQuestion, setRevealedQuestion] = useState<Question | null>(null)
  const [mistakes, setMistakes] = useState<Question[]>([])

  if (!validRoute) return <Navigate to="/" replace />

  const unit = unitsQuery.units.find((candidate) => candidate.id === unitId)

  if (unitsQuery.isLoading || levelQuery.isLoading) {
    return (
      <main className="account-layout">
        <AppHeader
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          backTo={{ to: `/units/${unitId}`, label: 'Retour aux niveaux' }}
        />
        <section className="levels-section">
          <p className="units-state" role="status">
            Chargement du questionnaire…
          </p>
        </section>
      </main>
    )
  }

  if (unitsQuery.error || levelQuery.error) {
    return (
      <main className="account-layout">
        <AppHeader
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          backTo={{ to: `/units/${unitId}`, label: 'Retour aux niveaux' }}
        />
        <section className="levels-section">
          <p className="units-state units-error" role="alert">
            Impossible de charger le questionnaire.
          </p>
        </section>
      </main>
    )
  }

  if (!unit || !isUnitActive(unit)) return <Navigate to="/" replace />
  if (!isLevelActive(unit, levelNumber)) return <Navigate to={`/units/${unitId}`} replace />

  const level = levelQuery.level
  if (!level) return <Navigate to={`/units/${unitId}`} replace />

  if (questionIndex >= level.questions.length) {
    return (
      <LevelSummary
        unitId={unitId}
        levelNumber={levelNumber}
        questionCount={level.questions.length}
        mistakes={mistakes}
      />
    )
  }

  const question = level.questions[questionIndex]

  function submitAnswer(answer: QuestionAnswer) {
    if (revealedQuestion) return

    if (question.checkAnswer(answer)) {
      setQuestionIndex((current) => current + 1)
      return
    }

    setMistakes((current) => [...current, question])
    setRevealedQuestion(question)
  }

  function continueAfterCorrection() {
    setRevealedQuestion(null)
    setQuestionIndex((current) => current + 1)
  }

  const progress = ((questionIndex + (revealedQuestion ? 1 : 0)) / level.questions.length) * 100

  return (
    <main className="questionnaire-screen">
      <AppHeader
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        backTo={{ to: `/units/${unitId}`, label: 'Retour aux niveaux' }}
      />
      <section className="questionnaire-content">
        <div className="question-progress">
          <span>
            Question {questionIndex + 1} / {level.questions.length}
          </span>
          <div className="question-progress-track" aria-label="Progression du niveau">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <article className="questionnaire-card">
          <span className="eyebrow">NIVEAU {levelNumber}</span>
          <h1>{questionTitles[question.type]}</h1>
          <QuestionView
            key={question.id}
            question={question}
            keyboardPhonemes={level.keyboardPhonemes}
            disabled={revealedQuestion !== null}
            onAnswer={submitAnswer}
          />
          {revealedQuestion && (
            <>
              <QuestionFeedback question={revealedQuestion} />
              <button
                className="primary-button question-submit"
                type="button"
                onClick={continueAfterCorrection}
              >
                Continuer
              </button>
            </>
          )}
        </article>
      </section>
    </main>
  )
}
