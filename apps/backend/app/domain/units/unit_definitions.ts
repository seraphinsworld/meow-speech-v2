import type { UnitDefinition } from './unit.js'

const learningCapacity = 42
const createUnitDefinition = (
  id: number,
  slug: string,
  title: string,
  activePhonemes: string[]
): UnitDefinition => ({
  id,
  slug,
  title,
  activePhonemes,
  totalLevels: 7,
  learningCapacity,
  wordBankCsvPath: `content/units/unit-${String(id).padStart(2, '0')}.csv`,
})

/** Shared curriculum metadata; progression is stored separately for each user. */
export const unitDefinitions: UnitDefinition[] = [
  createUnitDefinition(1, '1', 'Sheep vs ship', ['ɪ', 'i']),
  createUnitDefinition(2, 'unit-2', 'Seven and eleven', ['ə', 'ɛ']),
  createUnitDefinition(3, 'unit-3', 'Boy, play and bike', ['ɔɪ', 'eɪ', 'aɪ']),
  createUnitDefinition(4, 'unit-4', 'Child and shy', ['tʃ', 'ʃ']),
  createUnitDefinition(5, 'unit-5', 'Good food', ['ʊ', 'u']),
  createUnitDefinition(6, 'unit-6', 'Go out', ['oʊ', 'aʊ']),
  createUnitDefinition(7, 'unit-7', 'Cat and not', ['æ', 'ɑ']),
  createUnitDefinition(8, 'unit-8', 'Talk and walk', ['oʊ', 'ɔ']),
  createUnitDefinition(9, 'unit-9', 'Couple', ['ʌ', 'ə']),
  createUnitDefinition(10, 'unit-10', 'Enjoy and jump', ['ʒ', 'dʒ']),
  createUnitDefinition(11, 'unit-11', 'Yummy and cutie', ['j', 'i']),
  createUnitDefinition(12, 'unit-12', 'Morning', ['ŋ', 'n']),
  createUnitDefinition(13, 'unit-13', 'Right, how and where', ['r', 'h']),
  createUnitDefinition(14, 'unit-14', 'Worker and burger', ['ɝ', 'ɚ']),
  createUnitDefinition(15, 'unit-15', 'Think and this', ['θ', 'ð']),
]
