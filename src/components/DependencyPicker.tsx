import { useState, useRef, useMemo } from 'react'
import { Search, Check, AlertTriangle, Ban, ChevronRight } from 'lucide-react'
import { ALL_DEPENDENCIES, CATEGORIES } from '../data/dependencies'

const THEME = {
  bg: '#0a0a0c',
  cardBg: 'rgba(18, 18, 22, 0.8)',
  border: 'rgba(255, 255, 255, 0.05)',
  accent: '#7c3aed'
}

const CAT_STYLES: Record<string, { color: string; glow: string }> = {
  ui:       { color: '#00d2ff', glow: 'rgba(0, 210, 255, 0.15)' },
  state:    { color: '#ffaf00', glow: 'rgba(255, 175, 0, 0.15)' },
  routing:  { color: '#00ff9f', glow: 'rgba(0, 255, 159, 0.15)' },
  fetching: { color: '#bd00ff', glow: 'rgba(189, 0, 255, 0.15)' },
  forms:    { color: '#ff00e5', glow: 'rgba(255, 0, 229, 0.15)' },
  testing:  { color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.15)' },
  utils:    { color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.15)' },
}

function DepCard({ dep, selected, conflicted, compatible, onToggle }: any) {
  const [hov, setHov] = useState(false)
  const disabled = (conflicted || !compatible) && !selected
  const style = CAT_STYLES[dep.category] ?? CAT_STYLES.utils

  return (
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px', borderRadius: 12, width: '100%',
        textAlign: 'left', outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        border: selected ? `1px solid ${style.color}` : `1px solid ${THEME.border}`,
        background: selected ? style.glow : hov ? 'rgba(255,255,255,0.03)' : THEME.cardBg,
        boxShadow: selected ? `0 0 20px ${style.glow}` : 'none',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        transform: hov && !disabled && !selected ? 'translateX(4px)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${selected ? style.color : 'rgba(255,255,255,0.1)'}`,
        background: selected ? style.color : 'transparent',
        transition: 'all 0.2s'
      }}>
        {selected && <Check size={12} strokeWidth={4} color="#000" />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: selected ? '#fff' : 'rgba(255,255,255,0.9)',
            fontFamily: 'Inter, sans-serif'
          }}>
            {dep.name}
          </span>
          {dep.devOnly && <span style={{ fontSize: 9, color: style.color, opacity: 0.8 }}>[DEV]</span>}
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
          {dep.description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {conflicted && <Ban size={14} color="#ff4d4d" />}
        {!compatible && <AlertTriangle size={14} color="#ffaf00" />}
        <ChevronRight size={14} style={{ opacity: hov ? 1 : 0, transition: '0.2s' }} />
      </div>
    </button>
  )
}

export default function DependencyPicker({ isSelected, isConflicted, isCompatible, onToggle }: any) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() =>
    ALL_DEPENDENCIES.filter(d =>
      (cat === 'all' || d.category === cat) &&
      d.name.toLowerCase().includes(search.toLowerCase())
    ), [search, cat]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', background: THEME.bg, padding: 20, borderRadius: 20 }}>
      <style>{`
        .dep-scroll::-webkit-scrollbar { width: 4px; }
        .dep-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dependencies..."
          style={{
            width: '100%', background: 'rgba(0,0,0,0.3)', border: `1px solid ${THEME.border}`,
            borderRadius: 10, padding: '12px 40px', color: '#fff', outline: 'none', fontSize: 14
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 5 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, border: 'none', cursor: 'pointer',
              background: cat === c.id ? '#fff' : 'rgba(255,255,255,0.03)',
              color: cat === c.id ? '#000' : 'rgba(255,255,255,0.5)',
              transition: '0.2s', whiteSpace: 'nowrap'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="dep-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
        {filtered.map((dep, i) => (
          <div key={dep.id} style={{ animation: `fadeIn 0.3s ease forwards ${i * 0.02}s`, opacity: 0 }}>
            <DepCard
              dep={dep}
              selected={isSelected(dep.id)}
              conflicted={isConflicted(dep)}
              compatible={isCompatible(dep)}
              onToggle={() => onToggle(dep)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
