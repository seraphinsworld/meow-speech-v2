import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import type { UserSettingsRepository } from '../../domain/settings/user_settings_repository.js'
import { defaultUserSettings, type UserSettings } from '../../domain/settings/user_settings.js'

type UserSettingsRow = {
  auto_validate: boolean | number
  auto_play_pronunciation: boolean | number
  sound_effects_enabled: boolean | number
  sound_effects_volume: number
  pronunciation_volume: number
}

export class LucidUserSettingsRepository implements UserSettingsRepository {
  async get(userId: number): Promise<UserSettings> {
    const row = (await db.from('user_settings').where('user_id', userId).first()) as
      UserSettingsRow | undefined
    return row ? mapStoredSettings(row) : { ...defaultUserSettings }
  }

  async save(userId: number, settings: UserSettings): Promise<UserSettings> {
    const values = mapSettingsToRow(settings)
    const now = DateTime.now().toSQL()
    await db
      .table('user_settings')
      .insert({ user_id: userId, ...values, created_at: now, updated_at: now })
      .onConflict('user_id')
      .merge({ ...values, updated_at: now })
    return settings
  }
}

function mapStoredSettings(row: UserSettingsRow): UserSettings {
  return {
    autoValidate: Boolean(row.auto_validate),
    autoPlayPronunciation: Boolean(row.auto_play_pronunciation),
    soundEffectsEnabled: Boolean(row.sound_effects_enabled),
    soundEffectsVolume: Number(row.sound_effects_volume),
    pronunciationVolume: Number(row.pronunciation_volume),
  }
}

function mapSettingsToRow(settings: UserSettings) {
  return {
    auto_validate: settings.autoValidate,
    auto_play_pronunciation: settings.autoPlayPronunciation,
    sound_effects_enabled: settings.soundEffectsEnabled,
    sound_effects_volume: settings.soundEffectsVolume,
    pronunciation_volume: settings.pronunciationVolume,
  }
}
