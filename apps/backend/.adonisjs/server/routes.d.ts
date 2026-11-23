import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'units.index': { paramsTuple?: []; params?: {} }
    'levels.show': { paramsTuple: [ParamValue,ParamValue]; params: {'unitId': ParamValue,'level': ParamValue} }
    'levels.complete': { paramsTuple: [ParamValue,ParamValue]; params: {'unitId': ParamValue,'level': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'units.index': { paramsTuple?: []; params?: {} }
    'levels.show': { paramsTuple: [ParamValue,ParamValue]; params: {'unitId': ParamValue,'level': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'units.index': { paramsTuple?: []; params?: {} }
    'levels.show': { paramsTuple: [ParamValue,ParamValue]; params: {'unitId': ParamValue,'level': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'levels.complete': { paramsTuple: [ParamValue,ParamValue]; params: {'unitId': ParamValue,'level': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}