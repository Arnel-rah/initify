import type { ProjectConfig, GeneratedFile } from '../types/type'

function buildPackageJson(config: ProjectConfig): string {
  const isNext = config.framework === 'nextjs'
  const isVue = config.framework === 'vue'
  const isNuxt = config.framework === 'nuxt'
  const isTs = config.language === 'typescript'

  const deps: Record<string, string> = {}
  const devDeps: Record<string, string> = {}

  // Framework core deps
  if (isNext) {
    deps['next'] = '^14.0.0'
    deps['react'] = '^18.0.0'
    deps['react-dom'] = '^18.0.0'
  } else if (isVue) {
    deps['vue'] = '^3.4.0'
  } else if (isNuxt) {
    deps['nuxt'] = '^3.10.0'
  } else {
    deps['react'] = '^18.0.0'
    deps['react-dom'] = '^18.0.0'
  }

  // Styling
  if (config.styling === 'tailwind') {
    devDeps['tailwindcss'] = '^3.4.0'
    devDeps['autoprefixer'] = '^10.4.0'
    devDeps['postcss'] = '^8.4.0'
  } else if (config.styling === 'styled-components') {
    deps['styled-components'] = '^6.0.0'
  }

  // User-selected dependencies
  for (const dep of config.dependencies) {
    if (dep.name === 'shadcn/ui') continue // handled via CLI
    if (dep.devOnly) {
      devDeps[dep.name] = dep.version
    } else {
      deps[dep.name] = dep.version
    }
  }

  // TypeScript devDeps
  if (isTs) {
    devDeps['typescript'] = '^5.0.0'
    if (!isNext && !isNuxt) {
      devDeps['@types/react'] = '^18.0.0'
      devDeps['@types/react-dom'] = '^18.0.0'
    }
  }

  const scripts: Record<string, string> = isNext
    ? { dev: 'next dev', build: 'next build', start: 'next start', lint: 'next lint' }
    : isNuxt
    ? { dev: 'nuxt dev', build: 'nuxt build', preview: 'nuxt preview' }
    : isVue
    ? { dev: 'vite', build: 'vite build', preview: 'vite preview' }
    : { dev: 'vite', build: 'vite build', preview: 'vite preview', test: 'vitest' }

  return JSON.stringify(
    { name: config.name, version: '0.1.0', private: true, scripts, dependencies: deps, devDependencies: devDeps },
    null,
    2
  )
}

function buildReadme(config: ProjectConfig): string {
  const installCmd =
    config.packageManager === 'npm'
      ? 'npm install'
      : config.packageManager === 'yarn'
      ? 'yarn'
      : 'pnpm install'

  const devCmd =
    config.packageManager === 'npm'
      ? 'npm run dev'
      : config.packageManager === 'yarn'
      ? 'yarn dev'
      : 'pnpm dev'

  const selectedDeps = config.dependencies.map(d => `- **${d.name}** — ${d.description}`).join('\n')

  return `# ${config.name}

> Generated with [Initify](https://github.com/you/initify)

## Stack

- **Framework**: ${config.framework}
- **Language**: ${config.language}
- **Styling**: ${config.styling}
- **Package manager**: ${config.packageManager}

## Dependencies

${selectedDeps || '_No extra dependencies selected._'}

## Getting started

\`\`\`bash
${installCmd}
${devCmd}
\`\`\`
`
}

function buildViteConfig(config: ProjectConfig): string {
  const isTs = config.language === 'typescript'
  const isReact = config.framework === 'react'
  const ext = isTs ? 'ts' : 'js'

  return `import { defineConfig } from 'vite'
${isReact ? "import react from '@vitejs/plugin-react'\n" : ''}
export default defineConfig({
  plugins: [${isReact ? 'react()' : ''}],
  resolve: {
    alias: { '@': '/src' },
  },
})
`
}

function buildTsConfig(config: ProjectConfig): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        paths: { '@/*': ['./src/*'] },
      },
      include: ['src'],
    },
    null,
    2
  )
}

function buildEnvExample(): string {
  return `# Rename to .env.local
VITE_API_URL=http://localhost:3000
`
}

function buildGitignore(): string {
  return `node_modules
dist
.env
.env.local
.DS_Store
*.log
`
}

export function generateFiles(config: ProjectConfig): GeneratedFile[] {
  const isTs = config.language === 'typescript'
  const isNextOrNuxt = config.framework === 'nextjs' || config.framework === 'nuxt'
  const files: GeneratedFile[] = []

  files.push({ name: 'package.json', content: buildPackageJson(config), language: 'json' })
  files.push({ name: 'README.md', content: buildReadme(config), language: 'markdown' })
  files.push({ name: '.env.example', content: buildEnvExample(), language: 'bash' })
  files.push({ name: '.gitignore', content: buildGitignore(), language: 'bash' })

  if (!isNextOrNuxt) {
    files.push({ name: 'vite.config.ts', content: buildViteConfig(config), language: 'typescript' })
  }

  if (isTs) {
    files.push({ name: 'tsconfig.json', content: buildTsConfig(config), language: 'json' })
  }

  return files
}

export async function downloadZip(config: ProjectConfig, files: GeneratedFile[]) {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const folder = zip.folder(config.name)!

  for (const file of files) {
    folder.file(file.name, file.content)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.name}.zip`
  a.click()
  URL.revokeObjectURL(url)
}
