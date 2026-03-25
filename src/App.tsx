import { useMemo } from 'react'
import { GitBranch, Layers, Package, Eye, Terminal, Loader2 } from 'lucide-react'
import { useInitializer } from './hooks/useInitializer'
import { generateFiles } from './utils/generateCode'
import FrameworkSelector from './components/FrameworkSelector'
import ProjectForm from './components/ProjectForm'
import DependencyPicker from './components/DependencyPicker'
import PreviewPanel from './components/PreviewPanel'
import GenerateButton from './components/GenerateButton'

export default function App() {
  const {
    config,
    setField,
    setFramework,
    toggleDependency,
    isDependencySelected,
    isConflicted,
    isFrameworkCompatible
  } = useInitializer()

  const files = useMemo(() => (config ? generateFiles(config) : []), [config])

  if (!config) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
        <Loader2 className="animate-spin" size={24} color="#1a1916" />
      </div>
    )
  }

  const depCount = config.dependencies.length

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #f7f6f3; margin: 0; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.4s ease forwards; }
        .app-scroll::-webkit-scrollbar { width: 3px; }
        .app-scroll::-webkit-scrollbar-track { background: transparent; }
        .app-scroll::-webkit-scrollbar-thumb { background: #d4d0c8; border-radius: 2px; }
        .dep-chip:hover { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
        .gh-btn:hover { background: #1a1916 !important; color: #f7f6f3 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f6f3', display: 'flex', flexDirection: 'column', fontFamily: "'DM Mono', 'Geist Mono', monospace" }}>

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, background: '#ffffff', borderBottom: '1px solid #e8e6e1', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#1a1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={13} style={{ color: '#f7f6f3' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: '#1a1916' }}>
              Initify<span style={{ color: '#9a9690' }}>.</span>
            </span>
            <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: '#f0ede8', border: '1px solid #e8e6e1', color: '#9a9690' }}>
              v1.0
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['#f97176', '#f4d23c', '#63bb5b'].map((c, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.08em', color: '#c4c0b8' }}>Frontend scaffolder</span>
            <a href="https://github.com/Arnel-rah/initify.git" target="_blank" rel="noopener noreferrer" className="gh-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, border: '1px solid #e8e6e1', background: '#f7f6f3', fontSize: 10, letterSpacing: '0.08em', color: '#6b6760', textDecoration: 'none', transition: 'all 0.15s ease' }}>
              <GitBranch size={11} /> GitHub
            </a>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 52px)', overflow: 'hidden' }}>

          <aside className="app-scroll fade-up" style={{ width: 288, flexShrink: 0, borderRight: '1px solid #e8e6e1', background: '#ffffff', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px', animationDelay: '0.05s', opacity: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <Layers size={11} style={{ color: '#c4c0b8' }} />
                <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4c0b8' }}>Framework</span>
              </div>
              <FrameworkSelector selected={config.framework} onChange={setFramework} />
            </div>

            <div style={{ height: 1, background: '#f0ede8' }} />

            <ProjectForm config={config} onChange={setField} />

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <GenerateButton config={config} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', color: '#c4c0b8' }}>{files.length} files</span>
                <span style={{ fontSize: 9, color: '#d4d0c8' }}>·</span>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', color: '#c4c0b8' }}>{depCount} dep{depCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </aside>

          <main className="app-scroll fade-up" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px', background: '#f7f6f3', animationDelay: '0.12s', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={11} style={{ color: '#c4c0b8' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4c0b8' }}>Dependencies</span>
              {depCount > 0 && (
                <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 3, background: '#1a1916', color: '#f7f6f3', letterSpacing: '0.1em' }}>{depCount}</span>
              )}
            </div>
            <DependencyPicker isSelected={isDependencySelected} isConflicted={isConflicted} isCompatible={isFrameworkCompatible} onToggle={toggleDependency} />
          </main>

          <aside className="fade-up" style={{ width: 380, flexShrink: 0, borderLeft: '1px solid #e8e6e1', background: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden', animationDelay: '0.18s', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid #f0ede8', flexShrink: 0 }}>
              <Eye size={11} style={{ color: '#c4c0b8' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4c0b8' }}>Preview</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#e8e6e1' }} />)}
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <PreviewPanel files={files} />
            </div>

            {depCount > 0 && (
              <div style={{ borderTop: '1px solid #f0ede8', padding: '12px 16px', flexShrink: 0 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4c0b8', marginBottom: 8 }}>Selected</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {config.dependencies.map(dep => (
                    <button key={dep.id} onClick={() => toggleDependency(dep)} className="dep-chip" title="Click to remove"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 4, background: '#f0ede8', border: '1px solid #e8e6e1', fontSize: 9, letterSpacing: '0.08em', color: '#6b6760', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                      {dep.name.split('/').pop()}
                      <span style={{ opacity: 0.5, fontSize: 8 }}>✕</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
