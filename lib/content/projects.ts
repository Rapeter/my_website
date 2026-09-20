import path from 'node:path'
import { parseContentMeta, readContentFile, readContentFiles } from '@/lib/content/filesystem'
import { projectSchema, type ContentEntry, type ProjectMeta } from '@/lib/content/schemas'

export type ProjectEntry = ContentEntry<ProjectMeta>

const projectsDirectory = path.join(process.cwd(), 'content', 'projects')

function parseProject(raw: ReturnType<typeof readContentFile>): ProjectEntry {
  return {
    meta: parseContentMeta(projectSchema, raw.data, raw.sourcePath),
    body: raw.body,
    sourcePath: raw.sourcePath
  }
}

export function parseProjectFile(sourcePath: string): ProjectEntry {
  return parseProject(readContentFile(sourcePath))
}

export function getAllProjects(): ProjectEntry[] {
  return readContentFiles(projectsDirectory)
    .map(parseProject)
    .sort((a, b) => a.meta.order - b.meta.order)
}

export function getProjectBySlug(slug: string): ProjectEntry | null {
  return getAllProjects().find((project) => project.meta.slug === slug) ?? null
}
