export type Framework = 'react' | 'nextjs' | 'vue' | 'nuxt'
export type Language  = 'typescript' | 'javascript'
export type Styling   = 'tailwind' | 'scss' | 'css-modules' | 'styled-components'
export type Manager   = 'npm' | 'yarn' | 'pnpm'
export type Category  = 'ui' | 'state' | 'routing' | 'fetching' | 'testing' | 'utils' | 'forms'

export interface Dependency {
  id: string
  name: string
  version: string
  description: string
  category: Category
  devOnly?: boolean
  incompatibleWith?: string[]
  requiredWith?: string[]
  frameworks?: Framework[]
}

export interface ProjectConfig {
  name: string
  framework: Framework
  language: Language
  styling: Styling
  packageManager: Manager
  dependencies: Dependency[]
}

export interface GeneratedFile {
  name: string
  content: string
  language: string
}
