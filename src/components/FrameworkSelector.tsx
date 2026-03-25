import { useState } from 'react'
import type { Framework } from '../types/type'

interface Props { selected: Framework; onChange: (f: Framework) => void }

const FRAMEWORKS: { value: Framework; label: string; description: string; badge?: string; color: string }[] = [
  { value: 'react',  label: 'React',   description: 'UI library',        badge: 'Vite',       color: '#61dafb' },
  { value: 'nextjs', label: 'Next.js', description: 'Full-stack React',  badge: 'App Router', color: '#000000' },
  { value: 'vue',    label: 'Vue',     description: 'Progressive fw',    badge: 'Vite',       color: '#42b883' },
  { value: 'nuxt',   label: 'Nuxt',   description: 'Full-stack Vue',    badge: 'v3',         color: '#00dc82' },
]

function ReactLogo() {
  return <svg viewBox="-11.5 -10.23 23 20.46" width="22" height="22" fill="#61dafb"><circle r="2.05" /><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g></svg>
}
function NextLogo() {
  return <svg viewBox="0 0 180 180" width="22" height="22"><mask id="nm"><circle cx="90" cy="90" r="90" fill="white" /></mask><circle cx="90" cy="90" r="90" fill="black" /><path d="M149 161L69.2 60H60v59.9h9V72.4l74 84.7c2.1-1.9 4.1-3.9 6-6z" fill="url(#ng1)" mask="url(#nm)" /><path d="M120 60h9v60h-9z" fill="url(#ng2)" mask="url(#nm)" /><defs><linearGradient id="ng1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient><linearGradient id="ng2" x1="120.5" y1="60" x2="120" y2="93.5" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs></svg>
}
function VueLogo() {
  return <svg viewBox="0 0 261.76 226.69" width="22" height="22"><path fill="#41b883" d="M161.1 0L130.88 52.35 100.66 0H0l130.88 226.69L261.76 0H161.1z" /><path fill="#34495e" d="M161.1 0L130.88 52.35 100.66 0H52.43l78.45 135.89L209.33 0H161.1z" /></svg>
}
function NuxtLogo() {
  return <svg viewBox="0 0 400 400" width="22" height="22"><path fill="#00dc82" d="M228 268H64c-5.5 0-10-4.5-10-10 0-2 .6-4 1.6-5.6L196 74c2.7-4.5 8.5-6 13-3.3 1.4.8 2.5 1.9 3.3 3.3l45.2 75.4-30.7 51.3L185 136 104 268h124l-30.2-50.3 26.2-43.7 45 91c.9 1.8 1.4 3.7 1.4 5.7.1 5.5-4.4 10-9.9 10.3h-.5z" /><path fill="#00dc82" d="M347.8 265.3l-80-132c-1.4-2.3-3.9-3.7-6.6-3.7s-5.2 1.4-6.6 3.7l-17.3 28.6 26.2 43.7L281 168l54.2 90H310c-5.5 0-10 4.5-10 10s4.5 10 10 10h44.6c3.7 0 7.1-2 8.9-5.2.9-1.6 1.4-3.4 1.4-5.3-.2-2.2-.8-4.3-2.1-6.5z" /></svg>
}

const LOGOS: Record<Framework, React.ReactNode> = { react: <ReactLogo />, nextjs: <NextLogo />, vue: <VueLogo />, nuxt: <NuxtLogo /> }

export default function FrameworkSelector({ selected, onChange }: Props) {
  const [hov, setHov] = useState<Framework | null>(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {FRAMEWORKS.map(fw => {
        const isActive = selected === fw.value
        const isHov = hov === fw.value
        return (
          <button key={fw.value} onClick={() => onChange(fw.value)} onMouseEnter={() => setHov(fw.value)} onMouseLeave={() => setHov(null)}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: '12px', borderRadius: 8, border: isActive ? '1px solid #1a1916' : isHov ? '1px solid #c4c0b8' : '1px solid #e8e6e1', background: isActive ? '#1a1916' : isHov ? '#f7f6f3' : '#ffffff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease', outline: 'none' }}>
            {isActive && <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#f7f6f3' }} />}
            <div style={{ opacity: isActive ? 0.9 : isHov ? 0.8 : 0.5, transition: 'opacity 0.18s', filter: isActive ? 'brightness(0) invert(1)' : 'none' }}>
              {LOGOS[fw.value]}
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: isActive ? '#f7f6f3' : '#1a1916' }}>{fw.label}</p>
              <p style={{ margin: '2px 0 0', fontFamily: "'DM Mono', monospace", fontSize: 9, color: isActive ? 'rgba(247,246,243,0.5)' : '#c4c0b8' }}>{fw.description}</p>
            </div>
            {fw.badge && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, background: isActive ? 'rgba(247,246,243,0.1)' : '#f0ede8', border: isActive ? '1px solid rgba(247,246,243,0.2)' : '1px solid #e8e6e1', color: isActive ? 'rgba(247,246,243,0.6)' : '#9a9690' }}>
                {fw.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
