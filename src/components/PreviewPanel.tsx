import { useState } from 'react'
import { FileText } from 'lucide-react'
import type { GeneratedFile } from '../types/type'

interface Props {
  files: GeneratedFile[]
}

const LANG_COLORS: Record<string, string> = {
  json:       '#f4d23c',
  typescript: '#4d90d5',
  javascript: '#f4d23c',
  markdown:   '#63bb5b',
  bash:       '#9099a1',
}

const LANG_LABEL: Record<string, string> = {
  json:       'JSON',
  typescript: 'TS',
  javascript: 'JS',
  markdown:   'MD',
  bash:       'SH',
}

export default function PreviewPanel({ files }: Props) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const currentFile = files[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <style>{`
        .preview-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .preview-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .preview-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 2px; }
        .preview-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
      `}</style>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        flexShrink: 0,
        borderBottom: '1px solid rgba(99,102,241,0.12)',
        background: 'rgba(10,10,20,0.6)',
      }} className="preview-scrollbar">
        {files.map((f, i) => {
          const isActive = active === i
          const isHovered = hovered === i
          const langColor = LANG_COLORS[f.language] ?? '#9099a1'
          return (
            <button
              key={f.name}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 16px',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                fontFamily: "'DM Mono', 'Geist Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                background: isActive
                  ? 'rgba(99,102,241,0.07)'
                  : isHovered ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderRight: '1px solid rgba(99,102,241,0.08)',
                borderBottom: isActive
                  ? '1px solid rgba(99,102,241,0.5)'
                  : '1px solid transparent',
                marginBottom: isActive ? -1 : 0,
                color: isActive
                  ? 'rgba(165,180,252,0.9)'
                  : isHovered
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.25)',
                transition: 'all 0.18s ease',
                border: 'none',
                outline: 'none',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: langColor,
                opacity: isActive ? 1 : 0.4,
                flexShrink: 0,
                transition: 'opacity 0.18s ease',
                boxShadow: isActive ? `0 0 6px ${langColor}` : 'none',
              }} />
              {f.name}
            </button>
          )
        })}
      </div>
      {currentFile ? (
        <div
          className="preview-scrollbar"
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'auto',
            background: 'rgba(8,8,16,0.8)',
            minHeight: 0,
          }}
        >
          <pre style={{
            margin: 0,
            padding: '20px 24px',
            fontFamily: "'DM Mono', 'Geist Mono', monospace",
            fontSize: 12,
            lineHeight: 1.8,
            color: 'rgba(200,210,230,0.65)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            <code>{currentFile.content}</code>
          </pre>
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(8,8,16,0.8)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              background: 'rgba(99,102,241,0.04)',
            }}>
              <FileText size={20} style={{ color: 'rgba(99,102,241,0.3)' }} />
            </div>
            <p style={{
              fontFamily: "'DM Mono', 'Geist Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.15)',
              textTransform: 'uppercase',
            }}>
              Configure your project to preview files
            </p>
          </div>
        </div>
      )}
      {currentFile && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px',
          borderTop: '1px solid rgba(99,102,241,0.08)',
          background: 'rgba(10,10,20,0.6)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 4,
              background: `${LANG_COLORS[currentFile.language] ?? '#9099a1'}18`,
              border: `1px solid ${LANG_COLORS[currentFile.language] ?? '#9099a1'}30`,
              color: LANG_COLORS[currentFile.language] ?? '#9099a1',
            }}>
              {LANG_LABEL[currentFile.language] ?? currentFile.language}
            </span>
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.08em',
          }}>
            {currentFile.content.split('\n').length} lignes
          </span>
        </div>
      )}
    </div>
  )
}
