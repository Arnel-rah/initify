import { useState, useRef, useEffect } from 'react'
import { Search, Check, AlertTriangle, Ban, X, Package } from 'lucide-react'
import type { Dependency } from '../types/type'
import { ALL_DEPENDENCIES, CATEGORIES } from '../data/dependencies'

interface Props {
  isSelected:   (id: string) => boolean
  isConflicted: (dep: Dependency) => boolean
  isCompatible: (dep: Dependency) => boolean
  onToggle:     (dep: Dependency) => void
}

const CAT_COLORS: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  ui:       { bg: 'rgba(97,218,251,0.08)',  text: '#93c5fd', dot: '#61dafb', glow: 'rgba(97,218,251,0.3)'  },
  state:    { bg: 'rgba(244,162,60,0.08)',  text: '#fbbf24', dot: '#f4a23c', glow: 'rgba(244,162,60,0.3)'  },
  routing:  { bg: 'rgba(66,184,131,0.08)',  text: '#6ee7b7', dot: '#42b883', glow: 'rgba(66,184,131,0.3)'  },
  fetching: { bg: 'rgba(170,107,200,0.08)', text: '#c4b5fd', dot: '#aa6bc8', glow: 'rgba(170,107,200,0.3)' },
  forms:    { bg: 'rgba(236,143,230,0.08)', text: '#f0abfc', dot: '#ec8fe6', glow: 'rgba(236,143,230,0.3)' },
  testing:  { bg: 'rgba(249,113,118,0.08)', text: '#fca5a5', dot: '#f97176', glow: 'rgba(249,113,118,0.3)' },
  utils:    { bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', dot: '#9099a1', glow: 'rgba(148,163,184,0.3)' },
}

function DepCard({ dep, selected, conflicted, compatible, onToggle }: {
  dep: Dependency; selected: boolean; conflicted: boolean; compatible: boolean; onToggle: () => void
}) {
  const [hov, setHov] = useState(false)
  const disabled = (conflicted || !compatible) && !selected
  const cat = CAT_COLORS[dep.category] ?? CAT_COLORS.utils

  return (
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px', borderRadius: 16, width: '100%',
        textAlign: 'left', outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        border: selected
          ? `1px solid ${cat.glow}`
          : hov ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
        background: selected
          ? `linear-gradient(135deg, ${cat.bg} 0%, rgba(255,255,255,0.05) 100%)`
          : hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: selected
          ? `0 4px 24px ${cat.glow}40, inset 0 1px 0 rgba(255,255,255,0.1)`
          : hov ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        transform: hov && !disabled && !selected ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: selected ? `1.5px solid ${cat.dot}` : hov ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(255,255,255,0.12)',
        background: selected ? `${cat.dot}22` : 'rgba(255,255,255,0.05)',
        transition: 'all 0.18s ease',
        boxShadow: selected ? `0 0 8px ${cat.glow}` : 'none',
      }}>
        {selected && <Check size={11} strokeWidth={3} style={{ color: cat.dot }} />}
      </div>

      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: cat.bg,
        border: `1px solid ${cat.dot}20`,
        boxShadow: selected ? `0 0 12px ${cat.glow}30` : 'none',
        transition: 'all 0.18s ease',
      }}>
        <Package size={15} style={{ color: cat.dot }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
            color: selected ? cat.text : 'rgba(255,255,255,0.85)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: "'DM Mono', monospace",
            textShadow: selected ? `0 0 20px ${cat.glow}` : 'none',
          }}>
            {dep.name}
          </span>
          {dep.devOnly && (
            <span style={{
              fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '2px 6px', borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'DM Mono', monospace",
            }}>dev</span>
          )}
        </div>
        <p style={{
          margin: 0, fontSize: 11, lineHeight: 1.4,
          color: 'rgba(255,255,255,0.35)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: "'DM Mono', monospace",
        }}>
          {dep.description}
        </p>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        <span style={{
          fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 6,
          background: cat.bg, border: `1px solid ${cat.dot}25`,
          color: cat.text, fontFamily: "'DM Mono', monospace",
        }}>
          {dep.category}
        </span>
        {conflicted ? <Ban size={13} style={{ color: '#f97176' }} />
          : !compatible ? <AlertTriangle size={13} style={{ color: '#fbbf24' }} />
          : null}
      </div>
    </button>
  )
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: Props) {
  const [search, setSearch]           = useState('')
  const [cat, setCat]                 = useState('all')
  const [searchFocused, setFocused]   = useState(false)
  const searchRef                     = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const filtered = ALL_DEPENDENCIES.filter(dep => {
    const matchS = dep.name.toLowerCase().includes(search.toLowerCase())
                || dep.description.toLowerCase().includes(search.toLowerCase())
    return (cat === 'all' || dep.category === cat) && matchS
  })

  const selectedCount = ALL_DEPENDENCIES.filter(d => isSelected(d.id)).length

  return (
    <>
      <style>{`
        .dep-scroll::-webkit-scrollbar { width: 3px; }
        .dep-scroll::-webkit-scrollbar-track { background: transparent; }
        .dep-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .dep-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes dep-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dep-item { animation: dep-in 0.22s ease forwards; }
        .cat-pill:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em' }}>
            {filtered.length} package{filtered.length !== 1 ? 's' : ''}
            {search && <span style={{ color: 'rgba(255,255,255,0.2)' }}> · « {search} »</span>}
          </p>
          {selectedCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <Check size={10} style={{ color: 'rgba(255,255,255,0.7)' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: "'DM Mono', monospace" }}>
                {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: searchFocused ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', pointerEvents: 'none', transition: 'color 0.2s' }} />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Rechercher… ( / )"
            style={{
              width: '100%',
              background: searchFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: searchFocused ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '11px 40px',
              fontSize: 13, color: 'rgba(255,255,255,0.8)', outline: 'none',
              boxSizing: 'border-box', transition: 'all 0.2s ease',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.2)' : 'none',
              fontFamily: "'DM Mono', monospace",
            }}
          />
          {search ? (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <X size={11} />
            </button>
          ) : (
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '2px 6px', fontFamily: "'DM Mono', monospace", pointerEvents: 'none' }}>/</span>
          )}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => {
            const isAct = cat === c.id
            const cc    = CAT_COLORS[c.id]
            return (
              <button key={c.id} onClick={() => setCat(c.id)} className="cat-pill"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 11, padding: '5px 12px', borderRadius: 20,
                  border: isAct ? `1px solid ${cc?.dot ?? 'rgba(255,255,255,0.3)'}60` : '1px solid rgba(255,255,255,0.08)',
                  background: isAct ? `${cc?.bg ?? 'rgba(255,255,255,0.1)'}` : 'rgba(255,255,255,0.04)',
                  color: isAct ? (cc?.text ?? 'rgba(255,255,255,0.8)') : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: isAct ? `0 2px 12px ${cc?.glow ?? 'rgba(255,255,255,0.1)'}40` : 'none',
                  fontFamily: "'DM Mono', monospace",
                }}>
                {cc && <span style={{ width: 5, height: 5, borderRadius: '50%', background: cc.dot, flexShrink: 0, opacity: isAct ? 1 : 0.5, boxShadow: isAct ? `0 0 6px ${cc.glow}` : 'none' }} />}
                {c.label}
              </button>
            )
          })}
        </div>

        <div style={{ height: 1, background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }} />

        {/* List */}
        <div className="dep-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
                <Search size={22} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace" }}>Aucun résultat</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>Essaie un autre terme ou catégorie</p>
              </div>
            </div>
          ) : (
            filtered.map((dep, i) => (
              <div key={dep.id} className="dep-item" style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s`, opacity: 0 }}>
                <DepCard
                  dep={dep}
                  selected={isSelected(dep.id)}
                  conflicted={isConflicted(dep)}
                  compatible={isCompatible(dep)}
                  onToggle={() => onToggle(dep)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
