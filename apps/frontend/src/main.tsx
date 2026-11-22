import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  setAuthRepository,
  setLevelRepository,
  setUnitRepository,
} from './application/dependencies'
import { HttpAuthRepository } from './infrastructure/repositories/auth_repository'
import { MockLevelRepository } from './infrastructure/repositories/mock_level_repository'
import { HttpUnitRepository } from './infrastructure/repositories/units_repository'
import { App } from './ui/app'
import './ui/styles.css'
import './ui/questionnaire.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 15_000 } },
})
setAuthRepository(new HttpAuthRepository())
setUnitRepository(new HttpUnitRepository())
setLevelRepository(new MockLevelRepository())

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
