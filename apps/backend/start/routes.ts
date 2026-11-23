/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
const UnitsController = () => import('#controllers/units_controller')
const LevelsController = () => import('#controllers/levels_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router.get('units', [UnitsController, 'index']).use(middleware.auth())
    router.get('units/:unitId/levels/:level', [LevelsController, 'show']).use(middleware.auth())
    router
      .post('units/:unitId/levels/:level/complete', [LevelsController, 'complete'])
      .use(middleware.auth())
  })
  .prefix('/api/v1')
