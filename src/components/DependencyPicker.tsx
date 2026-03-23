import { useState } from 'react'
import { Search, Plus, Check, AlertTriangle, Ban } from 'lucide-react'
import type { Dependency } from '../types/type'
import { ALL_DEPENDENCIES, CATEGORIES } from '../data/dependencies'

interface Props {
  isSelected:   (id: string) => boolean
  isConflicted: (dep: Dependency) => boolean
  isCompatible: (dep: Dependency) => boolean
  onToggle:     (dep: Dependency) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  ui:       '#61dafb',
  state:    '#f4d23c',
  routing:  '#63bb5b',
  fetching: '#aa6bc8',
  forms:    '#ec8fe6',
  testing:  '#f97176',
  utils:    '#9099a1',
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered = ALL_DEPENDENCIES.filter(dep => {
    const matchSearch =
      dep.name.toLowerCase().includes(search.toLowerCase()) ||
      dep.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'all' || dep.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <>
      <style>{`
        .dep-scrollbar::-webkit-scrollbar { width: 3px; }
        .dep-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .dep-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 2px; }
        .dep-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
        @keyframes dep-check {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .dep-check-pop { animation: dep-check 0.2s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center',
        }}>
          <Search size={12} style={{
            position: 'absolute', left: 12,
            color: 'rgba(99,102,241,0.4)', flexShrink: 0, pointerEvents: 'none'
          }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dependencies..."
            style={{
              width: '100%',
              background: 'rgba(8,8,16,0.8)',
              border: '1px solid rgba(99,102,241,0.12)',
              borderRadius: 8,
              padding: '9px 36px',
              fontFamily: "'DM Mono', 'Geist Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.05em',
              color: 'rgba(200,210,230,0.7)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.35)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(99,102,241,0.12)'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.2)', fontSize: 12, padding: 2,
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              ✕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id
            const catColor = CATEGORY_COLORS[cat.id] ?? '#9099a1'
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 5,
                  border: isActive
                    ? `1px solid ${catColor}40`
                    : '1px solid rgba(255,255,255,0.06)',
                  background: isActive
                    ? `${catColor}12`
                    : 'rgba(255,255,255,0.02)',
                  color: isActive ? catColor : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
        <div
          className="dep-scrollbar"
          style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1, maxHeight: 420, paddingRight: 4 }}
        >
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 10 }}>
              <span style={{ fontSize: 20, color: 'rgba(99,102,241,0.2)' }}>◎</span>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', margin: 0 }}>
                No results
              </p>
            </div>
          ) : (
            filtered.map(dep => {
              const selected   = isSelected(dep.id)
              const conflicted = isConflicted(dep)
              const compatible = isCompatible(dep)
              const disabled   = conflicted || !compatible
              const isHov      = hovered === dep.id
              const catColor   = CATEGORY_COLORS[dep.category] ?? '#9099a1'

              return (
                <button
                  key={dep.id}
                  onClick={() => !disabled && onToggle(dep)}
                  disabled={disabled && !selected}
                  onMouseEnter={() => !disabled && setHovered(dep.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: selected
                      ? '1px solid rgba(99,102,241,0.3)'
                      : isHov
                        ? '1px solid rgba(255,255,255,0.07)'
                        : '1px solid rgba(255,255,255,0.03)',
                    background: selected
                      ? 'rgba(99,102,241,0.07)'
                      : isHov
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(8,8,16,0.5)',
                    opacity: disabled && !selected ? 0.35 : 1,
                    cursor: disabled && !selected ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: selected
                      ? '1px solid rgba(99,102,241,0.6)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: selected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.15s ease',
                    boxShadow: selected ? '0 0 8px rgba(99,102,241,0.2)' : 'none',
                  }}>
                    {selected && (
                      <Check size={9} strokeWidth={3} className="dep-check-pop" style={{ color: 'rgba(165,180,252,0.9)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: "'DM Mono', 'Geist Mono', monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: selected ? 'rgba(165,180,252,0.9)' : 'rgba(255,255,255,0.55)',
                        transition: 'color 0.15s ease',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {dep.name}
                      </span>

                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '1px 6px', borderRadius: 3,
                        background: `${catColor}12`,
                        border: `1px solid ${catColor}25`,
                        color: `${catColor}90`,
                      }}>
                        {dep.category}
                      </span>

                      {dep.devOnly && (
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
                          padding: '1px 6px', borderRadius: 3,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.25)',
                        }}>
                          dev
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: '3px 0 0',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10, letterSpacing: '0.03em',
                      color: 'rgba(255,255,255,0.18)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {dep.description}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {conflicted ? (
                      <Ban size={12} style={{ color: 'rgba(249,113,118,0.6)' }} />
                    ) : !compatible ? (
                      <AlertTriangle size={12} style={{ color: 'rgba(244,210,60,0.6)' }} />
                    ) : !selected ? (
                      <Plus size={12} style={{ color: isHov ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)', transition: 'color 0.15s' }} />
                    ) : null}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
