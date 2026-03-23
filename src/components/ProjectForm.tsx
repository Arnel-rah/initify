import { Settings } from 'lucide-react'
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
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'css-modules', label: 'CSS Modules' },
  { value: 'styled-components', label: 'Styled Components' },
]

const MANAGERS: { value: Manager; label: string }[] = [
  { value: 'pnpm', label: 'pnpm' },
  { value: 'npm', label: 'npm' },
  { value: 'yarn', label: 'yarn' },
]

export default function ProjectForm({ config, onChange }: Props) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm">
      <div className="card-body p-5 gap-5">
        <div className="flex items-center gap-2">
          <Settings size={15} className="text-primary" />
          <h2 className="font-bold text-sm tracking-wide uppercase text-base-content/60">
            Project
          </h2>
        </div>
        <label className="form-control w-full">
          <div className="label pb-1">
            <span className="label-text text-xs text-base-content/50 uppercase tracking-wider">
              Name
            </span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full font-mono bg-base-300 focus:input-primary"
            value={config.name}
            onChange={e => onChange('name', e.target.value.replace(/\s+/g, '-').toLowerCase())}
            placeholder="my-app"
          />
        </label>
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">Language</p>
          <div className="flex gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.value}
                onClick={() => onChange('language', lang.value)}
                className={`btn btn-sm flex-1 font-mono ${
                  config.language === lang.value
                    ? 'btn-primary'
                    : 'btn-ghost border border-base-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">Styling</p>
          <div className="grid grid-cols-2 gap-2">
            {STYLINGS.map(s => (
              <button
                key={s.value}
                onClick={() => onChange('styling', s.value)}
                className={`btn btn-xs font-mono justify-start ${
                  config.styling === s.value
                    ? 'btn-primary'
                    : 'btn-ghost border border-base-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">
            Package Manager
          </p>
          <div className="flex gap-2">
            {MANAGERS.map(m => (
              <button
                key={m.value}
                onClick={() => onChange('packageManager', m.value)}
                className={`btn btn-sm flex-1 font-mono ${
                  config.packageManager === m.value
                    ? 'btn-primary'
                    : 'btn-ghost border border-base-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
