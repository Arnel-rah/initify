import { useState } from 'react'
import { Terminal, Globe, Palette, Box } from 'lucide-react'
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
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '10px 12px', borderRadius: 8,
        border: '1px solid',
        borderColor: active ? '#1a1916' : hov ? '#d4d0c8' : '#f0ede8',
        background: active ? '#1a1916' : 'white',
        fontFamily: "inherit", fontSize: 11, fontWeight: active ? 600 : 400,
        color: active ? 'white' : '#666',
        cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none', textAlign: 'center'
      }}>
      {label}
    </button>
  )
}

function SectionHeader({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <Icon size={12} style={{ color: '#c4c0b8' }} />
      <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9a9690' }}>
        {children}
      </p>
    </div>
  )
}

export default function ProjectForm({ config, onChange }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ background: '#fcfcfb', border: '1px solid #e8e6e1', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ height: 3, background: '#1a1916' }} />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <SectionHeader icon={Terminal}>Project Name</SectionHeader>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, color: focused ? '#1a1916' : '#c4c0b8', transition: 'color 0.2s'
            }}>~/</span>
            <input
              type="text"
              value={config.name}
              onChange={e => onChange('name', e.target.value.replace(/\s+/g, '-').toLowerCase())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="my-awesome-app"
              style={{
                width: '100%', background: 'white',
                border: '1px solid',
                borderColor: focused ? '#1a1916' : '#e8e6e1',
                borderRadius: 10, padding: '12px 12px 12px 34px',
                fontSize: 13, color: '#1a1916', outline: 'none',
                transition: 'all 0.2s', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ height: '1px', background: '#f0ede8' }} />
        <div>
          <SectionHeader icon={Globe}>Language</SectionHeader>
          <div style={{ display: 'flex', gap: 8 }}>
            {LANGUAGES.map(l => (
              <OptionBtn key={l.value} active={config.language === l.value} label={l.label} onClick={() => onChange('language', l.value)} />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader icon={Palette}>Styling Strategy</SectionHeader>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {STYLINGS.map(s => (
              <OptionBtn key={s.value} active={config.styling === s.value} label={s.label} onClick={() => onChange('styling', s.value)} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader icon={Box}>Package Manager</SectionHeader>
          <div style={{ display: 'flex', gap: 8 }}>
            {MANAGERS.map(m => (
              <OptionBtn key={m.value} active={config.packageManager === m.value} label={m.label} onClick={() => onChange('packageManager', m.value)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
