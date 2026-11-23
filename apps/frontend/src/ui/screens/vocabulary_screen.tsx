import type { User } from '../../domain/models/user.ts'
import { useVocabulary } from '../../application/use_vocabulary.ts'
import { AppHeader } from '../components/app_header.tsx'

type Props = { user: User; onLogout: () => void; isLoggingOut: boolean }

export function VocabularyScreen({ user, onLogout, isLoggingOut }: Props) {
  const { units, isLoading, error } = useVocabulary()

  return (
    <main className="account-layout vocabulary-layout">
      <AppHeader
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        backTo={{ to: '/', label: 'Unités' }}
      />
      <section className="vocabulary-section" aria-labelledby="vocabulary-heading">
        <div className="vocabulary-player">
          <span className="vocabulary-avatar" aria-hidden="true">
            {user.initials || 'M'}
          </span>
          <span>{user.fullName || user.email}</span>
        </div>
        <span className="eyebrow">TON VOCABULAIRE</span>
        <h1 id="vocabulary-heading">My Vocabulary</h1>
        <p className="muted">Les mots que tu apprends et ceux que tu connais déjà.</p>

        {isLoading && (
          <p className="units-state" role="status">
            Chargement du vocabulaire…
          </p>
        )}
        {error && (
          <p className="units-state units-error" role="alert">
            Impossible de charger ton vocabulaire.
          </p>
        )}
        {!isLoading && !error && (
          <div className="vocabulary-units">
            {units.map((unit) =>
              unit.locked ? (
                <article className="vocabulary-unit vocabulary-unit--locked" key={unit.id}>
                  <span className="vocabulary-lock" aria-hidden="true">
                    ✦
                  </span>
                  <h2>Unit secrète</h2>
                  <p>Termine un niveau dans l’unité précédente pour la découvrir.</p>
                </article>
              ) : (
                <article className="vocabulary-unit" key={unit.id}>
                  <span className="eyebrow">UNITÉ {unit.id}</span>
                  <h2>{unit.title}</h2>
                  <p className="vocabulary-phonemes">{unit.activePhonemes.join(' · ')}</p>
                  <VocabularyGroup
                    title="Known words"
                    words={unit.knownWords}
                    empty="Aucun mot connu pour le moment."
                  />
                  <VocabularyGroup
                    title="Learning words"
                    words={unit.learningWords}
                    empty="Aucun mot en cours d’apprentissage pour le moment."
                  />
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  )
}

function VocabularyGroup({
  title,
  words,
  empty,
}: {
  title: string
  words: Array<{ word: string; ipa: string }>
  empty: string
}) {
  return (
    <section className="vocabulary-group" aria-label={title}>
      <h3>{title}</h3>
      {words.length ? (
        <ul className="vocabulary-word-list">
          {words.map(({ word, ipa }) => (
            <li key={word}>
              <span>{word}</span>
              <small>/{ipa.replace(/^\/+|\/+$/g, '')}/</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vocabulary-empty">{empty}</p>
      )}
    </section>
  )
}
