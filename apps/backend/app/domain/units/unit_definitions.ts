import type { UnitDefinition } from './unit.js'

/** Shared curriculum metadata; progression is stored separately for each user. */
export const unitDefinitions: UnitDefinition[] = [
  { id: 1, slug: '1', title: 'Sheep vs ship', activePhonemes: ['ɪ', 'i'], totalLevels: 7 },
  { id: 2, slug: 'unit-2', title: 'Seven and eleven', activePhonemes: ['ə', 'ɛ'], totalLevels: 7 },
  {
    id: 3,
    slug: 'unit-3',
    title: 'Boy, play and bike',
    activePhonemes: ['ɔɪ', 'eɪ', 'aɪ'],
    totalLevels: 7,
  },
  { id: 4, slug: 'unit-4', title: 'Child and shy', activePhonemes: ['tʃ', 'ʃ'], totalLevels: 7 },
  { id: 5, slug: 'unit-5', title: 'Good food', activePhonemes: ['ʊ', 'u'], totalLevels: 7 },
  { id: 6, slug: 'unit-6', title: 'Go out', activePhonemes: ['oʊ', 'aʊ'], totalLevels: 7 },
  { id: 7, slug: 'unit-7', title: 'Cat and not', activePhonemes: ['æ', 'ɑ'], totalLevels: 7 },
  { id: 8, slug: 'unit-8', title: 'Talk and walk', activePhonemes: ['oʊ', 'ɔ'], totalLevels: 7 },
  { id: 9, slug: 'unit-9', title: 'Couple', activePhonemes: ['ʌ', 'ə'], totalLevels: 7 },
  { id: 10, slug: 'unit-10', title: 'Enjoy and jump', activePhonemes: ['ʒ', 'dʒ'], totalLevels: 7 },
  { id: 11, slug: 'unit-11', title: 'Yummy and cutie', activePhonemes: ['j', 'i'], totalLevels: 7 },
  { id: 12, slug: 'unit-12', title: 'Morning', activePhonemes: ['ŋ', 'n'], totalLevels: 7 },
  {
    id: 13,
    slug: 'unit-13',
    title: 'Right, how and where',
    activePhonemes: ['r', 'h'],
    totalLevels: 7,
  },
  {
    id: 14,
    slug: 'unit-14',
    title: 'Worker and burger',
    activePhonemes: ['ɝ', 'ɚ'],
    totalLevels: 7,
  },
  { id: 15, slug: 'unit-15', title: 'Think and this', activePhonemes: ['θ', 'ð'], totalLevels: 7 },
]

