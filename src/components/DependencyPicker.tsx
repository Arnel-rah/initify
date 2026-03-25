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

const CAT_COLORS: Record<string, string> = {
  ui: '#61dafb', state: '#f4a23c', routing: '#42b883',
  fetching: '#aa6bc8', forms: '#ec8fe6', testing: '#f97176', utils: '#9099a1',
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: Props) {
  const [search, setSearch]         = useState('')
  const [cat, setCat]               = useState('all')
  const [hov, setHov]               = useState<string | null>(null)

  const filtered = ALL_DEPENDENCIES.filter(dep => {
    const matchS = dep.name.toLowerCase().includes(search.toLowerCase()) || dep.description.toLowerCase().includes(search.toLowerCase())
    const matchC = cat === 'all' || dep.category === cat
    return matchS && matchC
  })

  return (
    <>
      <style>{`
        .dep-list::-webkit-scrollbar { width: 3px; }
        .dep-list::-webkit-scrollbar-track { background: transparent; }
        .dep-list::-webkit-scrollbar-thumb { background: #d4d0c8; border-radius: 2px; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>

        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#c4c0b8', pointerEvents: 'none' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dependencies..."
            style={{ width: '100%', background: '#ffffff', border: '1px solid #e8e6e1', borderRadius: 7, padding: '8px 32px', fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#1a1916', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.18s' }}
            onFocus={e => e.target.style.borderColor = '#1a1916'}
            onBlur={e  => e.target.style.borderColor = '#e8e6e1'} />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#c4c0b8', fontSize: 12, padding: 2 }}>✕</button>}
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => {
            const isAct = cat === c.id
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, border: isAct ? '1px solid #1a1916' : '1px solid #e8e6e1', background: isAct ? '#1a1916' : '#ffffff', color: isAct ? '#f7f6f3' : '#9a9690', cursor: 'pointer', transition: 'all 0.15s' }}>
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="dep-list" style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1, maxHeight: 420 }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 8 }}>
              <span style={{ fontSize: 20, color: '#e8e6e1' }}>◎</span>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: '#c4c0b8', textTransform: 'uppercase', margin: 0 }}>No results</p>
            </div>
          ) : filtered.map(dep => {
            const sel  = isSelected(dep.id)
            const conf = isConflicted(dep)
            const comp = isCompatible(dep)
            const dis  = conf || !comp
            const isH  = hov === dep.id
            const cc   = CAT_COLORS[dep.category] ?? '#9099a1'

            return (
              <button key={dep.id} onClick={() => !dis && onToggle(dep)} disabled={dis && !sel}
                onMouseEnter={() => !dis && setHov(dep.id)} onMouseLeave={() => setHov(null)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, border: sel ? '1px solid #1a1916' : isH ? '1px solid #c4c0b8' : '1px solid #e8e6e1', background: sel ? '#1a1916' : isH ? '#f7f6f3' : '#ffffff', opacity: dis && !sel ? 0.35 : 1, cursor: dis && !sel ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all 0.15s', outline: 'none', width: '100%' }}>
                <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: sel ? '1px solid rgba(247,246,243,0.4)' : '1px solid #d4d0c8', background: sel ? 'rgba(247,246,243,0.15)' : '#f7f6f3', transition: 'all 0.15s' }}>
                  {sel && <Check size={9} strokeWidth={3} style={{ color: '#f7f6f3' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: sel ? '#f7f6f3' : '#1a1916', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dep.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1px 5px', borderRadius: 3, background: sel ? 'transparent' : `${cc}18`, border: `1px solid ${cc}30`, color: sel ? `${cc}cc` : cc }}>{dep.category}</span>
                    {dep.devOnly && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1px 5px', borderRadius: 3, background: '#f0ede8', border: '1px solid #e8e6e1', color: '#9a9690' }}>dev</span>}
                  </div>
                  <p style={{ margin: '2px 0 0', fontFamily: "'DM Mono', monospace", fontSize: 10, color: sel ? 'rgba(247,246,243,0.5)' : '#9a9690', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dep.description}</p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {conf     ? <Ban size={12} style={{ color: '#f97176' }} />
                  : !comp   ? <AlertTriangle size={12} style={{ color: '#f4a23c' }} />
                  : !sel    ? <Plus size={12} style={{ color: isH ? '#1a1916' : '#d4d0c8', transition: 'color 0.15s' }} />
                  : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
