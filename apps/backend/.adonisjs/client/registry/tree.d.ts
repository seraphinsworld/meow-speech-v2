/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
    userSettings: {
      show: typeof routes['profile.user_settings.show']
      update: typeof routes['profile.user_settings.update']
    }
  }
  units: {
    index: typeof routes['units.index']
  }
  levels: {
    show: typeof routes['levels.show']
    complete: typeof routes['levels.complete']
  }
}
