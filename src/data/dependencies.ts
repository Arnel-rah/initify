import type { Dependency } from '../types/type'

export const ALL_DEPENDENCIES: Dependency[] = [
  {
    id: 'react-query',
    name: '@tanstack/react-query',
    version: '^5.0.0',
    description: 'Server state management & data fetching',
    category: 'fetching',
  },
  {
    id: 'zustand',
    name: 'zustand',
    version: '^4.5.0',
    description: 'Lightweight client state management',
    category: 'state',
    incompatibleWith: ['redux-toolkit'],
  },
]
