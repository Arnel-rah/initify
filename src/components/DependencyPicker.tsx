import { useState } from 'react'
import { Search, Plus, Check, AlertTriangle, Ban } from 'lucide-react'
import type { Dependency } from '../types/type'
import { ALL_DEPENDENCIES, CATEGORIES } from '../data/dependencies'

interface Props {
  isSelected: (id: string) => boolean
  isConflicted: (dep: Dependency) => boolean
  isCompatible: (dep: Dependency) => boolean
  onToggle: (dep: Dependency) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  ui: 'badge-info',
  state: 'badge-warning',
  routing: 'badge-success',
  fetching: 'badge-secondary',
  forms: 'badge-accent',
  testing: 'badge-error',
  utils: 'badge-ghost',
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = ALL_DEPENDENCIES.filter(dep => {
    const matchSearch =
      dep.name.toLowerCase().includes(search.toLowerCase()) ||
      dep.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'all' || dep.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Search */}
      <label className="input input-sm input-bordered flex items-center gap-2 bg-base-300">
        <Search size={13} className="text-base-content/40" />
        <input
          type="text"
          className="grow font-mono text-xs bg-transparent outline-none"
          placeholder="Search dependencies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-base-content/40 hover:text-base-content text-xs">
            ✕
          </button>
        )}
      </label>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`btn btn-xs font-mono ${
              activeCategory === cat.id ? 'btn-primary' : 'btn-ghost border border-base-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 max-h-[420px]">
        {filtered.length === 0 ? (
          <p className="text-center text-base-content/30 text-xs py-8">No results</p>
        ) : (
          filtered.map(dep => {
            const selected = isSelected(dep.id)
            const conflicted = isConflicted(dep)
            const compatible = isCompatible(dep)
            const disabled = conflicted || !compatible

            return (
              <button
                key={dep.id}
                onClick={() => !disabled && onToggle(dep)}
                disabled={disabled && !selected}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-100
                  ${selected
                    ? 'border-primary/50 bg-primary/10'
                    : disabled
                    ? 'border-base-300/50 bg-base-200/50 opacity-40 cursor-not-allowed'
                    : 'border-base-300 bg-base-200 hover:border-base-content/20 hover:bg-base-300 cursor-pointer'
                  }
                `}
              >
                {/* Checkbox */}
                <div
                  className={`
                    w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all
                    ${selected ? 'bg-primary border-primary' : 'border-base-content/20 bg-base-300'}
                  `}
                >
                  {selected && <Check size={10} strokeWidth={3} className="text-primary-content" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-base-content truncate">
                      {dep.name}
                    </span>
                    <span className={`badge badge-xs ${CATEGORY_COLORS[dep.category] ?? 'badge-ghost'}`}>
                      {dep.category}
                    </span>
                    {dep.devOnly && (
                      <span className="badge badge-xs badge-ghost font-mono border border-base-300">
                        dev
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/40 mt-0.5 truncate">{dep.description}</p>
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0">
                  {conflicted ? (
                    <div className="tooltip tooltip-left" data-tip="Conflicts with selected dep">
                      <Ban size={13} className="text-error/70" />
                    </div>
                  ) : !compatible ? (
                    <div className="tooltip tooltip-left" data-tip="Not compatible with framework">
                      <AlertTriangle size={13} className="text-warning/70" />
                    </div>
                  ) : !selected ? (
                    <Plus size={13} className="text-base-content/20" />
                  ) : null}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
