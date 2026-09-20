import path from 'node:path'
import { parseContentMeta, readContentFile, readContentFiles } from '@/lib/content/filesystem'
import { resumeSchema, type ContentEntry, type ResumeMeta } from '@/lib/content/schemas'

export type ResumeEntry = ContentEntry<ResumeMeta>

const resumesDirectory = path.join(process.cwd(), 'content', 'resumes')

function parseResume(raw: ReturnType<typeof readContentFile>): ResumeEntry {
  return {
    meta: parseContentMeta(resumeSchema, raw.data, raw.sourcePath),
    body: raw.body,
    sourcePath: raw.sourcePath
  }
}

export function parseResumeFile(sourcePath: string): ResumeEntry {
  return parseResume(readContentFile(sourcePath))
}

export function selectCurrentResume(resumes: ResumeEntry[]): ResumeEntry {
  const current = resumes.filter((resume) => resume.meta.current)
  if (current.length !== 1) {
    throw new Error(`Expected exactly one current resume, received ${current.length}`)
  }
  return current[0]
}

export function getCurrentResume(): ResumeEntry {
  return selectCurrentResume(readContentFiles(resumesDirectory).map(parseResume))
}
