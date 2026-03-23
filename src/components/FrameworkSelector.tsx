import { useState } from 'react'
import type { Framework } from '../types/type'

interface Props {
  selected: Framework
  onChange: (f: Framework) => void
}

const FRAMEWORKS: {
  value: Framework
  label: string
  description: string
  badge?: string
  color: string
}[] = [
  { value: 'react',  label: 'React',   description: 'UI library',          badge: 'Vite',       color: '#61dafb' },
  { value: 'nextjs', label: 'Next.js', description: 'Full-stack React',    badge: 'App Router', color: '#ffffff' },
  { value: 'vue',    label: 'Vue',     description: 'Progressive framework', badge: 'Vite',      color: '#42b883' },
  { value: 'nuxt',   label: 'Nuxt',   description: 'Full-stack Vue',       badge: 'v3',         color: '#00dc82' },
]

function ReactLogo() {
  return (
    <svg viewBox="-11.5 -10.23 23 20.46" width="26" height="26" fill="#61dafb">
      <circle r="2.05" />
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  )
}

function NextLogo() {
  return (
    <svg viewBox="0 0 180 180" width="26" height="26" fill="white">
      <mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <circle cx="90" cy="90" r="90" fill="black" />
      <path d="M149 161L69.2 60H60v59.9h9V72.4l74 84.7c2.1-1.9 4.1-3.9 6-6z" fill="url(#g1)" mask="url(#m)" />
      <path d="M120 60h9v60h-9z" fill="url(#g2)" mask="url(#m)" />
      <defs>
        <linearGradient id="g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g2" x1="120.5" y1="60" x2="120" y2="93.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function VueLogo() {
  return (
    <svg viewBox="0 0 261.76 226.69" width="26" height="26">
      <path fill="#41b883" d="M161.1 0L130.88 52.35 100.66 0H0l130.88 226.69L261.76 0H161.1z" />
      <path fill="#34495e" d="M161.1 0L130.88 52.35 100.66 0H52.43l78.45 135.89L209.33 0H161.1z" />
    </svg>
  )
}

function NuxtLogo() {
  return (
    <svg viewBox="0 0 400 400" width="26" height="26">
      <path fill="#00dc82" d="M228 268H64c-5.5 0-10-4.5-10-10 0-2 .6-4 1.6-5.6L196 74c2.7-4.5 8.5-6 13-3.3 1.4.8 2.5 1.9 3.3 3.3l45.2 75.4-30.7 51.3L185 136 104 268h124l-30.2-50.3 26.2-43.7 45 91c.9 1.8 1.4 3.7 1.4 5.7.1 5.5-4.4 10-9.9 10.3h-.5z" />
      <path fill="#00dc82" d="M347.8 265.3l-80-132c-1.4-2.3-3.9-3.7-6.6-3.7s-5.2 1.4-6.6 3.7l-17.3 28.6 26.2 43.7L281 168l54.2 90H310c-5.5 0-10 4.5-10 10s4.5 10 10 10h44.6c3.7 0 7.1-2 8.9-5.2.9-1.6 1.4-3.4 1.4-5.3-.2-2.2-.8-4.3-2.1-6.5z" />
    </svg>
  )
}

const LOGOS: Record<Framework, React.ReactNode> = {
  react:  <ReactLogo />,
  nextjs: <NextLogo />,
  vue:    <VueLogo />,
  nuxt:   <NuxtLogo />,
}

export default function FrameworkSelector({ selected, onChange }: Props) {
  const [hovered, setHovered] = useState<Framework | null>(null)

  return (
    <>
      <style>{`
        @keyframes fw-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .fw-dot-pop { animation: fw-pop 0.25s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {FRAMEWORKS.map(fw => {
          const isActive  = selected === fw.value
          const isHovered = hovered === fw.value

          return (
            <button
              key={fw.value}
              onClick={() => onChange(fw.value)}
              onMouseEnter={() => setHovered(fw.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 10,
                padding: '14px 16px',
                borderRadius: 10,
                border: isActive
                  ? `1px solid ${fw.color}40`
                  : isHovered
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.04)',
                background: isActive
                  ? `linear-gradient(135deg, ${fw.color}0d 0%, rgba(8,8,16,0.9) 100%)`
                  : isHovered
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(8,8,16,0.6)',
                boxShadow: isActive
                  ? `0 0 24px ${fw.color}10, inset 0 1px 0 ${fw.color}18`
                  : 'inset 0 1px 0 rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderRadius: '10px 10px 0 0',
                background: isActive
                  ? `linear-gradient(to right, transparent, ${fw.color}50, transparent)`
                  : 'transparent',
                transition: 'background 0.2s ease'
              }} />
              {isActive && (
                <span className="fw-dot-pop" style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 6, height: 6, borderRadius: '50%',
                  background: fw.color,
                  boxShadow: `0 0 8px ${fw.color}`,
                }} />
              )}
              <div style={{
                opacity: isActive ? 1 : isHovered ? 0.7 : 0.4,
                transition: 'opacity 0.2s ease',
                transform: isHovered && !isActive ? 'scale(1.05)' : 'scale(1)',
              }}>
                {LOGOS[fw.value]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <p style={{
                  margin: 0,
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: isActive ? fw.color : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.2s ease',
                }}>
                  {fw.label}
                </p>
                <p style={{
                  margin: 0,
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.18)',
                }}>
                  {fw.description}
                </p>
              </div>
              {fw.badge && (
                <span style={{
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: isActive ? `${fw.color}12` : 'rgba(255,255,255,0.04)',
                  border: isActive ? `1px solid ${fw.color}25` : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? `${fw.color}99` : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease',
                }}>
                  {fw.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}
