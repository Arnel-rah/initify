import type { ProjectConfig } from "../types/type";

export function buildPackageJson(config: ProjectConfig): string {
  // TODO: construire l'objet JSON selon les deps choisies
  const pkg = {
    name: config.name,
    version: "0.0.1",
    scripts: {
      /* selon framework */
    },
    dependencies: {},
    devDependencies: {},
  };
  return JSON.stringify(pkg, null, 2);
}

export function buildReadme(config: ProjectConfig): string {
  // TODO: générer un README avec les instructions d'install
  return `# ${config.name}`;
}

export async function downloadZip(config: ProjectConfig) {
  // TODO: utiliser la lib JSZip pour zipper tous les fichiers générés
  // npm install jszip
}

export async function generateFiles(config: ProjectConfig) {
  throw new Error("Not implemented");
}
