import { useState } from 'react'
import { Settings } from 'lucide-react'
import type { ProjectConfig, Language, Styling, Manager } from '../types/type'

interface Props {
  config: ProjectConfig
  onChange: <K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) => void
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
]
const STYLINGS: { value: Styling; label: string }[] = [
  { value: 'tailwind',          label: 'Tailwind CSS' },
  { value: 'scss',              label: 'SCSS' },
  { value: 'css-modules',       label: 'CSS Modules' },
  { value: 'styled-components', label: 'Styled Comp.' },
]
const MANAGERS: { value: Manager; label: string }[] = [
  { value: 'pnpm', label: 'pnpm' },
  { value: 'npm',  label: 'npm'  },
  { value: 'yarn', label: 'yarn' },
]

function OptionBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: active ? '1px solid #1a1916' : hov ? '1px solid #c4c0b8' : '1px solid #e8e6e1', background: active ? '#1a1916' : hov ? '#f7f6f3' : '#ffffff', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.05em', color: active ? '#f7f6f3' : hov ? '#1a1916' : '#9a9690', cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none' }}>
      {label}
    </button>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 7px', fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4c0b8' }}>{children}</p>
}

export default function ProjectForm({ config, onChange }: Props) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e8e6e1', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e8e6e1, transparent)' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Settings size={11} style={{ color: '#c4c0b8' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4c0b8' }}>Config</span>
        </div>

        <div>
          <Label>Name</Label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'DM Mono', monospace", fontSize: 11, color: focused ? '#1a1916' : '#c4c0b8', pointerEvents: 'none', transition: 'color 0.2s' }}>~/</span>
            <input type="text" value={config.name} onChange={e => onChange('name', e.target.value.replace(/\s+/g, '-').toLowerCase())}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="my-app"
              style={{ width: '100%', background: '#f7f6f3', border: focused ? '1px solid #1a1916' : '1px solid #e8e6e1', borderRadius: 6, padding: '8px 12px 8px 30px', fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#1a1916', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <Label>Language</Label>
          <div style={{ display: 'flex', gap: 6 }}>
            {LANGUAGES.map(l => <OptionBtn key={l.value} active={config.language === l.value} label={l.label} onClick={() => onChange('language', l.value)} />)}
          </div>
        </div>

        <div>
          <Label>Styling</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {STYLINGS.map(s => <OptionBtn key={s.value} active={config.styling === s.value} label={s.label} onClick={() => onChange('styling', s.value)} />)}
          </div>
        </div>

        <div>
          <Label>Package Manager</Label>
          <div style={{ display: 'flex', gap: 6 }}>
            {MANAGERS.map(m => <OptionBtn key={m.value} active={config.packageManager === m.value} label={m.label} onClick={() => onChange('packageManager', m.value)} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
