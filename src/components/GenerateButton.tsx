import { useState } from 'react'
import { Download, Loader2, Check } from 'lucide-react'
import type { ProjectConfig } from '../types/type'
import { generateFiles, downloadZip } from '../utils/generateCode'

interface Props {
  config: ProjectConfig
}

type Status = 'idle' | 'loading' | 'done'

export default function GenerateButton({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleGenerate() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const files = generateFiles(config)
      await downloadZip(config, files)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 2500)
    } catch (err) {
      console.error(err)
      setStatus('idle')
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={status !== 'idle' || !config.name.trim()}
      className={`
        btn w-full font-mono text-sm gap-2 transition-all
        ${status === 'done' ? 'btn-success' : 'btn-primary'}
      `}
    >
      {status === 'loading' ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Generating...
        </>
      ) : status === 'done' ? (
        <>
          <Check size={15} />
          Done!
        </>
      ) : (
        <>
          <Download size={15} />
          Generate &amp; Download
        </>
      )}
    </button>
  )
}
