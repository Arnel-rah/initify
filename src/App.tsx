import { useMemo } from 'react'
import { Boxes, GitBranch, Layers, Package, Eye } from 'lucide-react'
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
    isFrameworkCompatible,
  } = useInitializer()

  const files = useMemo(() => generateFiles(config), [config])
  const depCount = config.dependencies.length

  return (
    <div className="min-h-screen bg-base-100 font-mono flex flex-col">
      <header className="navbar bg-base-200 border-b border-base-300 px-6 min-h-[52px] sticky top-0 z-50">
        <div className="navbar-start gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Boxes size={16} className="text-primary-content" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Initify
            <span className="text-primary">.</span>
          </span>
          <span className="badge badge-sm badge-ghost border border-base-300 ml-1">v1.0</span>
        </div>
        <div className="navbar-end gap-3">
          <span className="text-xs text-base-content/30">
            Frontend project scaffolder
          </span>
          <a
            href="https://github.com/Arnel-rah/initify.git"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-xs gap-1.5"
          >
            <GitBranch size={13} />
            GitHub
          </a>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-52px)]">
        <aside className="w-72 flex-shrink-0 border-r border-base-300 bg-base-200 overflow-y-auto flex flex-col gap-5 p-5">
          <div className="flex items-center gap-2">
            <Layers size={13} className="text-primary" />
            <span className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
              Framework
            </span>
          </div>

          <FrameworkSelector selected={config.framework} onChange={setFramework} />

          <div className="divider my-0 opacity-30" />

          <ProjectForm config={config} onChange={setField} />

          <div className="mt-auto pt-2">
            <GenerateButton config={config} />
            <p className="text-center text-xs text-base-content/20 mt-2">
              {files.length} files · {depCount} dep{depCount !== 1 ? 's' : ''}
            </p>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto flex flex-col gap-4 p-5 bg-base-100">
          <div className="flex items-center gap-2">
            <Package size={13} className="text-primary" />
            <span className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
              Dependencies
            </span>
            {depCount > 0 && (
              <span className="badge badge-primary badge-sm ml-1">{depCount}</span>
            )}
          </div>

          <DependencyPicker
            isSelected={isDependencySelected}
            isConflicted={isConflicted}
            isCompatible={isFrameworkCompatible}
            onToggle={toggleDependency}
          />
        </main>
        <aside className="w-[380px] flex-shrink-0 border-l border-base-300 bg-base-200 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300 flex-shrink-0">
            <Eye size={13} className="text-primary" />
            <span className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
              Preview
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <PreviewPanel files={files} />
          </div>
          {config.dependencies.length > 0 && (
            <div className="border-t border-base-300 p-4 flex-shrink-0">
              <p className="text-xs text-base-content/30 uppercase tracking-wider mb-2">
                Selected
              </p>
              <div className="flex flex-wrap gap-1">
                {config.dependencies.map(dep => (
                  <button
                    key={dep.id}
                    onClick={() => toggleDependency(dep)}
                    className="badge badge-sm badge-primary gap-1 cursor-pointer hover:badge-error transition-colors"
                    title="Click to remove"
                  >
                    {dep.name.split('/').pop()}
                    <span className="opacity-60">✕</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
