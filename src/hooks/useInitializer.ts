import { useState } from 'react'
import type { ProjectConfig, Dependency, Framework } from '../types/type'

const DEFAULT_CONFIG: ProjectConfig = {
  name: 'my-app',
  framework: 'react',
  language: 'typescript',
  styling: 'tailwind',
  packageManager: 'pnpm',
  dependencies: [],
}

export function useInitializer() {
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG)

  function setField<K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }


  function setFramework(framework: Framework) {
    setConfig(prev => ({
      ...prev,
      framework,
      dependencies: prev.dependencies.filter(
        d => !d.frameworks || d.frameworks.includes(framework)
      ),
    }))
  }

  function toggleDependency(dep: Dependency) {
    setConfig(prev => {
      const isSelected = prev.dependencies.some(d => d.id === dep.id)

      if (isSelected) {
        return { ...prev, dependencies: prev.dependencies.filter(d => d.id !== dep.id) }
      }

      // Check incompatibilities
      const hasConflict = dep.incompatibleWith?.some(id =>
        prev.dependencies.some(d => d.id === id)
      )
      if (hasConflict) return prev

      return { ...prev, dependencies: [...prev.dependencies, dep] }
    })
  }

  function isDependencySelected(id: string): boolean {
    return config.dependencies.some(d => d.id === id)
  }

  function isConflicted(dep: Dependency): boolean {
    return (
      dep.incompatibleWith?.some(id => config.dependencies.some(d => d.id === id)) ?? false
    )
  }

  function isFrameworkCompatible(dep: Dependency): boolean {
    return !dep.frameworks || dep.frameworks.includes(config.framework)
  }

  return {
    config,
    setField,
    setFramework,
    setConfig,
    toggleDependency,
    isDependencySelected,
    isConflicted,
    isFrameworkCompatible,
  }
}
