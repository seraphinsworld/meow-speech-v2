import type { WordEntry, WordProgress, ScheduledWord } from './vocabulary_types.js'

type ScheduleOptions = {
  wordBank: WordEntry[]
  progress: WordProgress[]
  capacity: number
  questionCount: number
  now: number
  activePhonemes: string[]
}

type ScheduleContext = {
  wordBank: WordEntry[]
  progress: WordProgress[]
  progressByWord: Map<string, WordProgress>
  entryByWord: Map<string, WordEntry>
  bankOrder: Map<string, number>
  activePhonemes: Set<string>
  introducedTargetCounts: Map<string, number>
}

export function scheduleWords(options: ScheduleOptions): ScheduledWord[] {
  const context = createScheduleContext(options)
  const selected = new SelectedWords(options.questionCount)

  selected.addAll(selectDueLearningWords(context, options.now))
  selected.addAll(selectNewWords(context, selected.size, options))
  selected.addAll(selectFutureLearningWords(context, options.now))
  selected.addAll(selectKnownWords(context))
  return selected.words
}

function createScheduleContext({
  wordBank,
  progress,
  activePhonemes,
}: ScheduleOptions): ScheduleContext {
  const entryByWord = new Map(wordBank.map((entry) => [normalizeWord(entry.word), entry]))
  const bankOrder = new Map(wordBank.map((entry, index) => [normalizeWord(entry.word), index]))
  const context: ScheduleContext = {
    wordBank,
    progress,
    progressByWord: new Map(progress.map((word) => [normalizeWord(word.word), word])),
    entryByWord,
    bankOrder,
    activePhonemes: new Set(activePhonemes),
    introducedTargetCounts: new Map(activePhonemes.map((phoneme) => [phoneme, 0])),
  }
  countExistingTargetCoverage(context)
  return context
}

function countExistingTargetCoverage(context: ScheduleContext) {
  for (const progress of context.progress) {
    if (progress.state === 'unseen') continue
    const entry = context.entryByWord.get(normalizeWord(progress.word))
    for (const phoneme of entry?.phonemes ?? []) {
      if (context.activePhonemes.has(phoneme)) incrementTargetCount(context, phoneme)
    }
  }
}

function selectDueLearningWords(context: ScheduleContext, now: number): ScheduledWord[] {
  return sortLearningWords(context)
    .filter((word) => (word.nextDueAt ?? 0) <= now)
    .flatMap((progress) => toScheduledWord(context, progress))
}

function selectFutureLearningWords(context: ScheduleContext, now: number): ScheduledWord[] {
  return sortLearningWords(context)
    .filter((word) => (word.nextDueAt ?? 0) > now)
    .flatMap((progress) => toScheduledWord(context, progress))
}

function sortLearningWords(context: ScheduleContext): WordProgress[] {
  return context.progress
    .filter(
      (word) => word.state === 'learning' && context.entryByWord.has(normalizeWord(word.word))
    )
    .sort(
      (left, right) =>
        (left.nextDueAt ?? 0) - (right.nextDueAt ?? 0) ||
        left.step - right.step ||
        bankPosition(context, left.word) - bankPosition(context, right.word)
    )
}

function selectNewWords(
  context: ScheduleContext,
  alreadySelected: number,
  options: ScheduleOptions
): ScheduledWord[] {
  const learningCount = context.progress.filter((word) => word.state === 'learning').length
  const availableSlots = Math.max(
    0,
    Math.min(options.questionCount - alreadySelected, options.capacity - learningCount)
  )
  const unseenWords = context.wordBank.filter(
    (entry) => context.progressByWord.get(normalizeWord(entry.word))?.state === 'unseen'
  )
  const selected: ScheduledWord[] = []

  while (selected.length < availableSlots && unseenWords.length > 0) {
    const entry = takeLeastCoveredUnseenWord(context, unseenWords)
    if (!entry) break
    selected.push(introduceWord(context, entry, options.now))
  }
  return selected
}

function takeLeastCoveredUnseenWord(
  context: ScheduleContext,
  candidates: WordEntry[]
): WordEntry | undefined {
  const availableTargets = new Set(
    candidates.flatMap((entry) =>
      entry.phonemes.filter((phoneme) => context.activePhonemes.has(phoneme))
    )
  )
  const leastCoveredTarget = [...context.activePhonemes]
    .filter((phoneme) => availableTargets.has(phoneme))
    .sort((left, right) => targetCount(context, left) - targetCount(context, right))[0]
  const candidateIndex = candidates.findIndex(
    (entry) => leastCoveredTarget && entry.phonemes.includes(leastCoveredTarget)
  )
  const [entry] = candidates.splice(candidateIndex < 0 ? 0 : candidateIndex, 1)
  return entry
}

function introduceWord(context: ScheduleContext, entry: WordEntry, now: number): ScheduledWord {
  const existing = context.progressByWord.get(normalizeWord(entry.word))
  if (!existing) throw new Error(`Missing progress for unseen word "${entry.word}".`)

  const progress: WordProgress = {
    ...existing,
    state: 'learning',
    step: 0,
    nextDueAt: now,
    lastReviewedAt: null,
  }
  for (const phoneme of entry.phonemes) {
    if (context.activePhonemes.has(phoneme)) incrementTargetCount(context, phoneme)
  }
  return { entry, progress, introduced: true }
}

function selectKnownWords(context: ScheduleContext): ScheduledWord[] {
  return context.progress
    .filter((word) => word.state === 'known')
    .sort(
      (left, right) =>
        (left.lastReviewedAt ?? 0) - (right.lastReviewedAt ?? 0) ||
        bankPosition(context, left.word) - bankPosition(context, right.word)
    )
    .flatMap((progress) => toScheduledWord(context, progress))
}

function toScheduledWord(context: ScheduleContext, progress: WordProgress): ScheduledWord[] {
  const entry = context.entryByWord.get(normalizeWord(progress.word))
  return entry ? [{ entry, progress, introduced: false }] : []
}

class SelectedWords {
  readonly words: ScheduledWord[] = []
  private readonly seen = new Set<string>()

  constructor(private readonly capacity: number) {}

  get size() {
    return this.words.length
  }

  addAll(candidates: ScheduledWord[]) {
    for (const candidate of candidates) this.add(candidate)
  }

  private add(candidate: ScheduledWord) {
    const word = normalizeWord(candidate.entry.word)
    if (this.size >= this.capacity || this.seen.has(word)) return
    this.seen.add(word)
    this.words.push(candidate)
  }
}

function incrementTargetCount(context: ScheduleContext, phoneme: string) {
  context.introducedTargetCounts.set(phoneme, targetCount(context, phoneme) + 1)
}

function targetCount(context: ScheduleContext, phoneme: string) {
  return context.introducedTargetCounts.get(phoneme) ?? 0
}

function bankPosition(context: ScheduleContext, word: string) {
  return context.bankOrder.get(normalizeWord(word)) ?? Number.MAX_SAFE_INTEGER
}

function normalizeWord(word: string) {
  return word.toLowerCase()
}
