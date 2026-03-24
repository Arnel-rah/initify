import { useMemo } from 'react';
import { GitBranch, Layers, Package, Eye, Terminal } from 'lucide-react';
import { useInitializer } from './hooks/useInitializer';
import { generateFiles } from './utils/generateCode';
import FrameworkSelector from './components/FrameworkSelector';
import ProjectForm from './components/ProjectForm';
import DependencyPicker from './components/DependencyPicker';
import PreviewPanel from './components/PreviewPanel';
import GenerateButton from './components/GenerateButton';

export default function App() {
  const {
    config,
    setField,
    setFramework,
    toggleDependency,
    isDependencySelected,
    isConflicted,
    isFrameworkCompatible,
  } = useInitializer();

  const files = useMemo(() => generateFiles(config), [config]);
  const depCount = config.dependencies.length;

  return (
    <>
      <style>{`
        @keyframes app-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .app-fade { animation: app-fade-in 0.5s ease forwards; }
        .app-scrollbar::-webkit-scrollbar { width: 3px; }
        .app-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .app-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.18); border-radius: 2px; }
        .app-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.35); }
        .dep-tag-btn:hover {
          background: rgba(249,113,118,0.12) !important;
          border-color: rgba(249,113,118,0.3) !important;
          color: rgba(249,113,118,0.8) !important;
        }
        .gh-link:hover {
          border-color: rgba(99,102,241,0.3) !important;
          color: rgba(165,180,252,0.7) !important;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#05050d',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Mono', 'Geist Mono', monospace"
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 52,
          background: 'rgba(8,8,18,0.95)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99,102,241,0.1)'
            }}>
              <Terminal size={13} style={{ color: 'rgba(165,180,252,0.8)' }} />
            </div>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Initify<span style={{ color: 'rgba(99,102,241,0.7)' }}>.</span>
            </span>
            <span style={{
              fontSize: 9,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: 4,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
              color: 'rgba(99,102,241,0.5)'
            }}>
              v1.0
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {(['#f97176', '#f4d23c', '#63bb5b'] as const).map((color, i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: color,
                  opacity: 0.6
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontSize: 10,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.15)'
            }}>
              Frontend project scaffolder
            </span>

            <a
              href="https://github.com/Arnel-rah/initify.git"
              target="_blank"
              rel="noopener noreferrer"
              className="gh-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                fontSize: 10,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <GitBranch size={11} />
              GitHub
            </a>
          </div>
        </header>

        <div style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 52px)',
          overflow: 'hidden'
        }}>
          <aside
            className="app-scrollbar app-fade"
            style={{
              width: 288,
              flexShrink: 0,
              borderRight: '1px solid rgba(99,102,241,0.08)',
              background: 'rgba(8,8,18,0.6)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              padding: '20px 16px',
              animationDelay: '0.05s',
              opacity: 0
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <Layers size={11} style={{ color: 'rgba(99,102,241,0.4)' }} />
                <span style={{
                  fontSize: 9,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(99,102,241,0.4)'
                }}>
                  Framework
                </span>
              </div>
              <FrameworkSelector selected={config.framework} onChange={setFramework} />
            </div>

            <div style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.12), transparent)'
            }} />

            <ProjectForm config={config} onChange={setField} />

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <GenerateButton config={config} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.12)' }}>
                  {files.length} files
                </span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.08)' }}>·</span>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.12)' }}>
                  {depCount} dep{depCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </aside>
          <main
            className="app-scrollbar app-fade"
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: '20px',
              background: '#05050d',
              animationDelay: '0.12s',
              opacity: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={11} style={{ color: 'rgba(99,102,241,0.4)' }} />
              <span style={{
                fontSize: 9,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(99,102,241,0.4)'
              }}>
                Dependencies
              </span>
              {depCount > 0 && (
                <span style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  padding: '1px 7px',
                  borderRadius: 3,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: 'rgba(165,180,252,0.7)'
                }}>
                  {depCount}
                </span>
              )}
            </div>

            <DependencyPicker
              isSelected={isDependencySelected}
              isConflicted={isConflicted}
              isCompatible={isFrameworkCompatible}
              onToggle={toggleDependency}
            />
          </main>
          <aside
            className="app-fade"
            style={{
              width: 380,
              flexShrink: 0,
              borderLeft: '1px solid rgba(99,102,241,0.08)',
              background: 'rgba(6,6,14,0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animationDelay: '0.18s',
              opacity: 0
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 20px',
              borderBottom: '1px solid rgba(99,102,241,0.08)',
              flexShrink: 0
            }}>
              <Eye size={11} style={{ color: 'rgba(99,102,241,0.4)' }} />
              <span style={{
                fontSize: 9,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(99,102,241,0.4)'
              }}>
                Preview
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'rgba(99,102,241,0.15)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <PreviewPanel files={files} />
            </div>

            {depCount > 0 && (
              <div style={{
                borderTop: '1px solid rgba(99,102,241,0.08)',
                padding: '12px 16px',
                flexShrink: 0
              }}>
                <p style={{
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(99,102,241,0.35)',
                  marginBottom: 8
                }}>
                  Selected
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {config.dependencies.map(dep => (
                    <button
                      key={dep.id}
                      onClick={() => toggleDependency(dep)}
                      className="dep-tag-btn"
                      title="Click to remove"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 9px',
                        borderRadius: 4,
                        background: 'rgba(99,102,241,0.07)',
                        border: '1px solid rgba(99,102,241,0.18)',
                        fontSize: 9,
                        letterSpacing: '0.08em',
                        color: 'rgba(165,180,252,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
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
  );
}
