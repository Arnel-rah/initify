import type { GeneratedFile, ProjectConfig } from "../types/type";

function buildPackageJson(config: ProjectConfig): string {
  const isNext = config.framework === "nextjs";
  const isVue = config.framework === "vue";
  const isNuxt = config.framework === "nuxt";
  const isTs = config.language === "typescript";

  const deps: Record<string, string> = {};
  const devDeps: Record<string, string> = {};

  if (isNext) {
    deps["next"] = "^14.0.0";
    deps["react"] = "^18.0.0";
    deps["react-dom"] = "^18.0.0";
  } else if (isVue) {
    deps["vue"] = "^3.4.0";
  } else if (isNuxt) {
    deps["nuxt"] = "^3.10.0";
  } else {
    deps["react"] = "^18.0.0";
    deps["react-dom"] = "^18.0.0";
  }

  if (!isNext && !isNuxt) {
    devDeps["vite"] = "^5.0.0";
    if (isVue) {
      devDeps["@vitejs/plugin-vue"] = "^5.0.0";
    } else {
      devDeps["@vitejs/plugin-react"] = "^4.0.0";
    }
  }

  if (config.styling === "tailwind") {
    devDeps["tailwindcss"] = "^3.4.0";
    devDeps["autoprefixer"] = "^10.4.0";
    devDeps["postcss"] = "^8.4.0";
  } else if (config.styling === "styled-components") {
    deps["styled-components"] = "^6.0.0";
    if (isTs) devDeps["@types/styled-components"] = "^5.1.0";
  } else if (config.styling === "scss") {
    devDeps["sass"] = "^1.70.0";
  }

  for (const dep of config.dependencies) {
    if (dep.name === "shadcn/ui") continue;
    if (dep.devOnly) {
      devDeps[dep.name] = dep.version;
    } else {
      deps[dep.name] = dep.version;
    }
  }

  if (isTs) {
    devDeps["typescript"] = "^5.0.0";
    if (!isNext && !isNuxt) {
      devDeps["@types/react"] = "^18.0.0";
      devDeps["@types/react-dom"] = "^18.0.0";
    }
    if (isVue) {
      devDeps["vue-tsc"] = "^2.0.0";
    }
  }

  const scripts: Record<string, string> = isNext
    ? {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      }
    : isNuxt
      ? { dev: "nuxt dev", build: "nuxt build", preview: "nuxt preview" }
      : isVue
        ? {
            dev: "vite",
            build: isTs ? "vue-tsc && vite build" : "vite build",
            preview: "vite preview",
          }
        : {
            dev: "vite",
            build: isTs ? "tsc && vite build" : "vite build",
            preview: "vite preview",
          };

  return JSON.stringify(
    {
      name: config.name,
      version: "0.1.0",
      private: true,
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2,
  );
}

function buildViteConfig(config: ProjectConfig): string {
  const isVue      = config.framework === "vue"
  const isTailwind = config.styling === "tailwind"

  const pluginImport = isVue
    ? "import vue from '@vitejs/plugin-vue'"
    : "import react from '@vitejs/plugin-react'"

  const pluginCall = isVue ? "vue()" : "react()"

  return `import { defineConfig } from 'vite'
${pluginImport}

export default defineConfig({
  plugins: [${pluginCall}],
  resolve: {
    alias: { '@': '/src' },
  },
})
`
}

function buildTsConfig(config: ProjectConfig): string {
  const isVue = config.framework === "vue";

  const base = {
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: isVue ? undefined : "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      paths: { "@/*": ["./src/*"] },
    },
    include: ["src"],
  };

  if (isVue) {
    delete base.compilerOptions.jsx;
  }

  return JSON.stringify(base, null, 2);
}

function buildTailwindConfig(config: ProjectConfig): string {
  const isVue = config.framework === "vue";
  const ext = isVue ? "vue" : "tsx,jsx";

  return `/** @type {import('tailwindcss').Config} */
  export default {
  content: [
    "./index.html",
    "./src/**/*.{${ext},ts,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
}

function buildPostcssConfig(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
}

function buildIndexHtml(config: ProjectConfig): string {
  const isVue = config.framework === "vue";
  const isTs = config.language === "typescript";
  const ext = isTs ? "ts" : "js";
  const entry = isVue ? `src/main.${ext}` : `src/main.${isTs ? "tsx" : "jsx"}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="${isVue ? "app" : "root"}"></div>
    <script type="module" src="/${entry}"></script>
  </body>
</html>
`;
}

function buildMainTsx(config: ProjectConfig): string {
  const isTs = config.language === "typescript";
  return `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')${isTs ? "!" : ""}).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`;
}

function buildMainVue(): string {
  return `import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')
`;
}

function buildAppTsx(config: ProjectConfig): string {
  if (config.framework === "vue") {
    const isTs = config.language === "typescript";
    return `<template>
  <main>
    <h1>{{ title }}</h1>
  </main>
</template>

<script setup${isTs ? ' lang="ts"' : ""}>
const title = 'Hello from ${config.name}'
</script>
`;
  }

  if (config.framework === "nuxt") {
    return `<template>
  <div>
    <NuxtPage />
  </div>
</template>
`;
  }

  return `export default function App() {
  return (
    <main>
      <h1>Hello from ${config.name}</h1>
    </main>
  )
}
`;
}

function buildIndexCss(config: ProjectConfig): string {
  if (config.styling === "tailwind") {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
`
  }

  return `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}
`
}

function buildEnvDts(): string {
  return `/// <reference types="vite/client" />\n`;
}

function buildEnvExample(): string {
  return `# Rename to .env\nVITE_API_URL=http://localhost:3000\n`;
}

function buildGitignore(): string {
  return `node_modules\ndist\n.env\n.env.local\n.DS_Store\n*.log\n`;
}

function buildReadme(config: ProjectConfig): string {
  const pm = config.packageManager;
  const install =
    pm === "npm" ? "npm install" : pm === "yarn" ? "yarn" : "pnpm install";
  const dev =
    pm === "npm" ? "npm run dev" : pm === "yarn" ? "yarn dev" : "pnpm dev";

  const selectedDeps = config.dependencies
    .map((d) => `- **${d.name}** — ${d.description}`)
    .join("\n");

  return `# ${config.name}

> Generated with [Initify](https://github.com/Arnel-rah/initify)

## Stack

- **Framework**: ${config.framework}
- **Language**: ${config.language}
- **Styling**: ${config.styling}
- **Package manager**: ${config.packageManager}

## Dependencies

${selectedDeps || "_No extra dependencies selected._"}

## Getting started

\`\`\`bash
${install}
${dev}
\`\`\`
`;
}

export function generateFiles(config: ProjectConfig): GeneratedFile[] {
  const isTs = config.language === "typescript";
  const isNext = config.framework === "nextjs";
  const isVue = config.framework === "vue";
  const isNuxt = config.framework === "nuxt";
  const isNotNextNuxt = !isNext && !isNuxt;
  const srcExt = isTs ? (isVue ? "ts" : "tsx") : isVue ? "js" : "jsx";

  const files: GeneratedFile[] = [];

  files.push({
    name: "package.json",
    content: buildPackageJson(config),
    language: "json",
  });
  files.push({
    name: "README.md",
    content: buildReadme(config),
    language: "markdown",
  });
  files.push({
    name: ".env.example",
    content: buildEnvExample(),
    language: "bash",
  });
  files.push({
    name: ".gitignore",
    content: buildGitignore(),
    language: "bash",
  });

  if (isNotNextNuxt) {
    files.push({
      name: "vite.config.ts",
      content: buildViteConfig(config),
      language: "typescript",
    });
    files.push({
      name: "index.html",
      content: buildIndexHtml(config),
      language: "html",
    });
  }

  if (config.styling === "tailwind") {
    files.push({
      name: "tailwind.config.js",
      content: buildTailwindConfig(config),
      language: "javascript",
    });
    files.push({
      name: "postcss.config.js",
      content: buildPostcssConfig(),
      language: "javascript",
    });
  }

  if (isTs) {
    files.push({
      name: "tsconfig.json",
      content: buildTsConfig(config),
      language: "json",
    });
    if (isNotNextNuxt) {
      files.push({
        name: "src/vite-env.d.ts",
        content: buildEnvDts(),
        language: "typescript",
      });
    }
  }

  if (isVue) {
    files.push({
      name: `src/main.${srcExt}`,
      content: buildMainVue(),
      language: "typescript",
    });
    files.push({
      name: "src/App.vue",
      content: buildAppTsx(config),
      language: "html",
    });
  } else if (!isNuxt) {
    files.push({
      name: `src/main.${srcExt}`,
      content: buildMainTsx(config),
      language: "typescript",
    });
    files.push({
      name: `src/App.${srcExt}`,
      content: buildAppTsx(config),
      language: "typescript",
    });
  }

  files.push({
    name: "src/index.css",
    content: buildIndexCss(config),
    language: "css",
  });

  return files;
}

export async function downloadZip(
  config: ProjectConfig,
  files: GeneratedFile[],
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const folder = zip.folder(config.name)!;

  for (const file of files) {
    folder.file(file.name, file.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${config.name}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
