import { useState } from 'react'
import { FileText } from 'lucide-react'
import type { GeneratedFile } from '../types/type'

interface Props { files: GeneratedFile[] }

const LANG_COLORS: Record<string, string> = {
  json: '#f4a23c', typescript: '#4d90d5', javascript: '#f4d23c',
  markdown: '#42b883', bash: '#9099a1', css: '#ec8fe6', html: '#f97176',
}
const LANG_LABEL: Record<string, string> = {
  json: 'JSON', typescript: 'TS', javascript: 'JS',
  markdown: 'MD', bash: 'SH', css: 'CSS', html: 'HTML',
}

export default function PreviewPanel({ files }: Props) {
  const [active, setActive] = useState(0)
  const [hov, setHov]       = useState<number | null>(null)
  const cur = files[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        .prev-scroll::-webkit-scrollbar { width: 3px; height: 3px; }
        .prev-scroll::-webkit-scrollbar-track { background: transparent; }
        .prev-scroll::-webkit-scrollbar-thumb { background: #d4d0c8; border-radius: 2px; }
      `}</style>

      {/* Tabs */}
      <div className="prev-scroll" style={{ display: 'flex', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid #f0ede8', background: '#fafaf8' }}>
        {files.map((f, i) => {
          const isAct = active === i
          const isH   = hov === i
          const lc    = LANG_COLORS[f.language] ?? '#9099a1'
          return (
            <button key={f.name} onClick={() => setActive(i)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', flexShrink: 0, whiteSpace: 'nowrap', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.05em', cursor: 'pointer', background: isAct ? '#ffffff' : isH ? '#f7f6f3' : 'transparent', borderRight: '1px solid #f0ede8', borderBottom: isAct ? '2px solid #1a1916' : '2px solid transparent', color: isAct ? '#1a1916' : '#9a9690', border: 'none', outline: 'none', transition: 'all 0.15s', marginBottom: isAct ? -1 : 0 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: lc, flexShrink: 0, opacity: isAct ? 1 : 0.5 }} />
              {f.name}
            </button>
          )
        })}
      </div>

      {/* Code */}
      {cur ? (
        <div className="prev-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', background: '#fafaf8', minHeight: 0 }}>
          <pre style={{ margin: 0, padding: '18px 20px', fontFamily: "'DM Mono', 'Geist Mono', monospace", fontSize: 11, lineHeight: 1.8, color: '#4a4740', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{cur.content}</code>
          </pre>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #e8e6e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', background: '#f7f6f3' }}>
              <FileText size={18} style={{ color: '#c4c0b8' }} />
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: '#c4c0b8', textTransform: 'uppercase', margin: 0 }}>Configure to preview</p>
          </div>
        </div>
      )}

      {/* Footer */}
      {cur && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 16px', borderTop: '1px solid #f0ede8', background: '#fafaf8', flexShrink: 0 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, background: `${LANG_COLORS[cur.language] ?? '#9099a1'}15`, border: `1px solid ${LANG_COLORS[cur.language] ?? '#9099a1'}25`, color: LANG_COLORS[cur.language] ?? '#9099a1' }}>
            {LANG_LABEL[cur.language] ?? cur.language}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c4c0b8', letterSpacing: '0.05em' }}>
            {cur.content.split('\n').length} lines
          </span>
        </div>
      )}
    </div>
  )
}
