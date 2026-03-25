import { useState } from 'react'
import { Download, Loader2, Check } from 'lucide-react'
import type { ProjectConfig } from '../types/type'
import { generateFiles, downloadZip } from '../utils/generateCode'

interface Props { config: ProjectConfig }
type Status = 'idle' | 'loading' | 'done'

export default function GenerateButton({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [hov, setHov] = useState(false)
  const isNameEmpty = !config.name.trim()
  const disabled = status !== 'idle' || isNameEmpty

  async function handle() {
    if (disabled) return
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
  const getStyles = () => {
    if (status === 'done') return { bg: '#16a34a', text: 'Succès !' }
    if (status === 'loading') return { bg: '#1a1916', text: 'Génération...' }
    return { bg: hov ? '#2a2926' : '#1a1916', text: 'Générer le projet' }
  }

  const { bg, text } = getStyles()

  return (
    <>
      <style>{`
        @keyframes gb-spin { to { transform: rotate(360deg); } }
        @keyframes gb-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .btn-active:active { transform: translateY(1px) scale(0.99); }
        .shimmer-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: gb-shimmer 1.5s infinite;
        }
      `}</style>

      <button
        onClick={handle}
        disabled={disabled}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={!disabled ? 'btn-active' : ''}
        style={{
          position: 'relative', width: '100%', padding: '14px 24px', borderRadius: 12,
          border: 'none', background: bg, color: '#f7f6f3',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: isNameEmpty ? 0.3 : 1,
          overflow: 'hidden', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none', boxShadow: hov && !disabled ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }}
      >
        {status === 'loading' && <div className="shimmer-overlay" />}

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {status === 'loading' ? (
            <>
              <Loader2 size={16} style={{ animation: 'gb-spin 0.8s linear infinite' }} />
              <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.02em' }}>{text}</span>
            </>
          ) : status === 'done' ? (
            <>
              <Check size={16} strokeWidth={3} />
              <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.02em' }}>Prêt !</span>
            </>
          ) : (
            <>
              <Download size={16} style={{ transform: hov ? 'translateY(1px)' : 'none', transition: 'transform 0.2s' }} />
              <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.02em' }}>{text}</span>
            </>
          )}
        </div>
      </button>

      {isNameEmpty && (
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9a9690', marginTop: 8, fontFamily: 'inherit' }}>
          Veuillez donner un nom à votre projet
        </p>
      )}
    </>
  )
}
