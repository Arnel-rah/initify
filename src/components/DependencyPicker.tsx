import { useState } from 'react'
import { Search, Plus, Check, AlertTriangle, Ban, X } from 'lucide-react'
import type { Dependency } from '../types/type'
import { ALL_DEPENDENCIES, CATEGORIES } from '../data/dependencies'

interface Props {
  isSelected: (id: string) => boolean
  isConflicted: (dep: Dependency) => boolean
  isCompatible: (dep: Dependency) => boolean
  onToggle: (dep: Dependency) => void
}

const CAT_COLORS: Record<string, string> = {
  ui: '#61dafb', state: '#f4a23c', routing: '#42b883',
  fetching: '#aa6bc8', forms: '#ec8fe6', testing: '#f97176', utils: '#9099a1',
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: Props) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [hov, setHov] = useState<string | null>(null)

  const filtered = ALL_DEPENDENCIES.filter(dep => {
    const matchS = dep.name.toLowerCase().includes(search.toLowerCase()) ||
                   dep.description.toLowerCase().includes(search.toLowerCase())
    const matchC = cat === 'all' || dep.category === cat
    return matchS && matchC
  })

  return (
    <>
      <style>{`
        .dep-list::-webkit-scrollbar { width: 4px; }
        .dep-list::-webkit-scrollbar-track { background: transparent; }
        .dep-list::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 10px; }
        .dep-card { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .dep-card:hover:not(:disabled) { transform: translateX(4px); }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', padding: 4 }}>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9690', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une dépendance..."
            style={{
              width: '100%', background: '#fcfbf9', border: '1px solid #e8e6e1', borderRadius: 10,
              padding: '10px 36px', fontFamily: "inherit", fontSize: 13, color: '#1a1916',
              outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#1a1916'}
            onBlur={e  => e.target.style.borderColor = '#e8e6e1'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9a9690' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => {
            const isAct = cat === c.id
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                style={{
                  fontSize: 10, fontWeight: 600, textTransform: 'uppercase', padding: '6px 12px',
                  borderRadius: 20, border: '1px solid', borderColor: isAct ? '#1a1916' : '#e8e6e1',
                  background: isAct ? '#1a1916' : 'white', color: isAct ? 'white' : '#666',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {c.label}
              </button>
            )
          })}
        </div>

        {/* List */}
        <div className="dep-list" style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9a9690' }}>
              <p style={{ fontSize: 13 }}>Aucun résultat trouvé</p>
            </div>
          ) : filtered.map(dep => {
            const sel = isSelected(dep.id)
            const conf = isConflicted(dep)
            const comp = isCompatible(dep)
            const dis = (conf || !comp) && !sel
            const cc = CAT_COLORS[dep.category] ?? '#9099a1'

            return (
              <button
                key={dep.id}
                onClick={() => !dis && onToggle(dep)}
                disabled={dis}
                onMouseEnter={() => setHov(dep.id)}
                onMouseLeave={() => setHov(null)}
                className="dep-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12,
                  border: '1px solid', borderColor: sel ? '#1a1916' : '#e8e6e1',
                  background: sel ? '#1a1916' : 'white',
                  opacity: dis ? 0.5 : 1, cursor: dis ? 'not-allowed' : 'pointer',
                  textAlign: 'left', width: '100%', outline: 'none'
                }}>

                {/* Checkbox Icon */}
                <div style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${sel ? '#ffffff40' : '#d4d0c8'}`,
                  background: sel ? '#ffffff20' : '#f7f6f3'
                }}>
                  {sel && <Check size={12} strokeWidth={3} color="white" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: sel ? 'white' : '#1a1916' }}>{dep.name}</span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${cc}15`, color: cc, border: `1px solid ${cc}30` }}>
                      {dep.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: sel ? '#ffffff80' : '#666', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dep.description}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {conf ? <Ban size={14} color="#f97176" />
                    : !comp ? <AlertTriangle size={14} color="#f4a23c" />
                    : !sel ? <Plus size={14} color="#d4d0c8" /> : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
