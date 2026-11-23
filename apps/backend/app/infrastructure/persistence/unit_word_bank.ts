import { readFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import type { UnitDefinition } from '../../domain/units/unit.js'
import type { WordEntry } from '../../domain/units/vocabulary_scheduler.js'

const phonemeTokens = [
  'tʃ',
  'dʒ',
  'ɔɪ',
  'eɪ',
  'aɪ',
  'oʊ',
  'aʊ',
  'ɝ',
  'ɚ',
  'θ',
  'ð',
  'ʃ',
  'ʒ',
  'ŋ',
  'i',
  'ɪ',
  'ɛ',
  'ə',
  'æ',
  'ʌ',
  'ɑ',
  'ɔ',
  'ʊ',
  'u',
  'p',
  'b',
  't',
  'd',
  'k',
  'g',
  'f',
  'v',
  's',
  'z',
  'm',
  'n',
  'w',
  'l',
  'j',
  'h',
  'r',
].sort((a, b) => b.length - a.length)

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let value = ''
  let quoted = false
  for (let index = 0; index < line.length; index++) {
    const char = line[index]
    if (char === '"' && quoted && line[index + 1] === '"') {
      value += '"'
      index++
      continue
    }
    if (char === '"') {
      quoted = !quoted
      continue
    }
    if (char === ',' && !quoted) {
      values.push(value.trim())
      value = ''
      continue
    }
    value += char
  }
  values.push(value.trim())
  return values
}

function tokenizeIpa(ipa: string): string[] {
  const normalized =
    ipa
      .split(',')[0]
      ?.trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[ˈˌ.ː]/g, '')
      .replaceAll('ɹ', 'r')
      .replaceAll('ɡ', 'g')
      .replace(/\s+/g, '') ?? ''
  const result: string[] = []
  for (let cursor = 0; cursor < normalized.length;) {
    const phoneme = phonemeTokens.find((candidate) => normalized.startsWith(candidate, cursor))
    if (phoneme) {
      result.push(phoneme)
      cursor += phoneme.length
    } else cursor++
  }
  return result
}

export async function loadUnitWordBank(unit: UnitDefinition): Promise<WordEntry[]> {
  const content = await readFile(app.makePath(unit.wordBankCsvPath), 'utf8')
  const seen = new Set<string>()
  return content
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => line.trim())
    .flatMap((line) => {
      const [wordValue, ipaValue, active] = parseCsvLine(line)
      const word = wordValue?.trim()
      const ipa = ipaValue?.trim() ?? ''
      if (!word || active?.toLowerCase() === 'false' || seen.has(word.toLowerCase())) return []
      const parsed = tokenizeIpa(ipa)
      if (!parsed.length) return []
      seen.add(word.toLowerCase())
      return [{ word, ipa, phonemes: parsed }]
    })
}
