/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"signup"]],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"logout"]],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'profile.user_settings.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/settings',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"settings"]],
    types: placeholder as Registry['profile.user_settings.show']['types'],
  },
  'profile.user_settings.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/settings',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"settings"]],
    types: placeholder as Registry['profile.user_settings.update']['types'],
  },
  'units.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/units',
    tokens: [[0,"api"],[0,"v1"],[0,"units"]],
    types: placeholder as Registry['units.index']['types'],
  },
  'units.vocabulary': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/vocabulary',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"vocabulary"]],
    types: placeholder as Registry['units.vocabulary']['types'],
  },
  'levels.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/units/:unitId/levels/:level',
    tokens: [[0,"api"],[0,"v1"],[0,"units"],[1,"unitId"],[0,"levels"],[1,"level"]],
    types: placeholder as Registry['levels.show']['types'],
  },
  'levels.complete': {
    methods: ["POST"],
    pattern: '/api/v1/units/:unitId/levels/:level/complete',
    tokens: [[0,"api"],[0,"v1"],[0,"units"],[1,"unitId"],[0,"levels"],[1,"level"],[0,"complete"]],
    types: placeholder as Registry['levels.complete']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
