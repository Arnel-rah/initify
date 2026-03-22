import { useState } from 'react'
import type { ProjectConfig, Dependency, Framework } from '../types/type'

const DEFAULT_CONFIG: ProjectConfig = {
  name: 'mon-projet',
  framework: 'react',
  language: 'typescript',
  styling: 'tailwind',
  packageManager: 'pnpm',
  dependencies: [],
}

export function useInitializer() {
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG)

  function setFramework(framework: Framework) {
    // TODO: reset certaines deps incompatibles selon le framework
    setConfig(prev => ({ ...prev, framework }))
  }

  function toggleDependency(dep: Dependency) {
    setConfig(prev => {
      const already = prev.dependencies.find(d => d.id === dep.id)
      if (already) {
        return { ...prev, dependencies: prev.dependencies.filter(d => d.id !== dep.id) }
      }
      // TODO: vérifier incompatibleWith avant d'ajouter
      return { ...prev, dependencies: [...prev.dependencies, dep] }
    })
  }

  function generate() {
    // TODO: appeler generateCode(config) → produire un zip
  }

  return { config, setFramework, toggleDependency, generate, setConfig }
}
