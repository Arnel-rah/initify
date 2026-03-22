import { useState } from 'react'
import { FileText } from 'lucide-react'
import type { GeneratedFile } from '../types/type'

interface Props {
  files: GeneratedFile[]
}

const LANG_COLORS: Record<string, string> = {
  json: 'text-amber-400',
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  markdown: 'text-green-400',
  bash: 'text-base-content/50',
}

export default function PreviewPanel({ files }: Props) {
  const [active, setActive] = useState(0)

  const currentFile = files[active]

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex gap-0 overflow-x-auto border-b border-base-300 flex-shrink-0">
        {files.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActive(i)}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-r border-base-300 whitespace-nowrap
              transition-colors flex-shrink-0
              ${active === i
                ? 'bg-base-300 text-base-content border-b-2 border-b-primary -mb-px'
                : 'text-base-content/40 hover:text-base-content/70 hover:bg-base-300/50'
              }
            `}
          >
            <FileText size={11} className={LANG_COLORS[f.language] ?? 'text-base-content/40'} />
            {f.name}
          </button>
        ))}
      </div>
      {currentFile ? (
        <div className="flex-1 overflow-auto bg-base-300/50 min-h-0">
          <pre className="p-4 text-xs font-mono leading-relaxed text-base-content/80 whitespace-pre-wrap">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-base-content/20 text-sm">
          <div className="text-center">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Configure your project to preview files</p>
          </div>
        </div>
      )}
      {currentFile && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-base-300 flex-shrink-0">
          <span className="text-xs text-base-content/30 font-mono">
            {currentFile.language}
          </span>
          <span className="text-xs text-base-content/30 font-mono">
            {currentFile.content.split('\n').length} lines
          </span>
        </div>
      )}
    </div>
  )
}
