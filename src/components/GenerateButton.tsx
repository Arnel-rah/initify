import { useState } from 'react'
import { Download, Loader2, Check } from 'lucide-react'
import type { ProjectConfig } from '../types/type'
import { generateFiles, downloadZip } from '../utils/generateCode'

interface Props { config: ProjectConfig }
type Status = 'idle' | 'loading' | 'done'

export default function GenerateButton({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [hov, setHov]       = useState(false)
  const disabled = status !== 'idle' || !config.name.trim()

  async function handle() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const files = generateFiles(config)
      await downloadZip(config, files)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 2500)
    } catch (e) {
      console.error(e)
      setStatus('idle')
    }
  }

  const bg    = status === 'done' ? '#16a34a' : status === 'loading' ? '#3a3835' : hov && !disabled ? '#2a2926' : '#1a1916'
  const color = '#f7f6f3'

  return (
    <>
      <style>{`
        @keyframes gb-spin { to { transform: rotate(360deg); } }
        @keyframes gb-shimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
        .gb-shimmer { animation: gb-shimmer 1.6s ease infinite; }
      `}</style>
      <button onClick={handle} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ position: 'relative', width: '100%', padding: '11px 20px', borderRadius: 8, border: 'none', background: bg, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled && status === 'idle' ? 0.4 : 1, overflow: 'hidden', transition: 'background 0.2s ease', outline: 'none' }}>

        {status === 'loading' && (
          <div className="gb-shimmer" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', pointerEvents: 'none' }} />
        )}

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {status === 'loading' ? (
            <>
              <Loader2 size={13} style={{ color, animation: 'gb-spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>Generating…</span>
            </>
          ) : status === 'done' ? (
            <>
              <Check size={13} style={{ color }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>Downloaded</span>
            </>
          ) : (
            <>
              <Download size={13} style={{ color, transition: 'transform 0.2s', transform: hov ? 'translateY(1px)' : 'translateY(0)' }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>Generate &amp; Download</span>
            </>
          )}
        </div>
      </button>
    </>
  )
}
