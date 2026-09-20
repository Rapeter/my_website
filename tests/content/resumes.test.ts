import { describe, expect, test } from 'vitest'
import { selectCurrentResume } from '@/lib/content/resumes'

describe('resume selection', () => {
  test('rejects zero current resumes', () => {
    expect(() => selectCurrentResume([])).toThrow(/exactly one current resume/i)
  })

  test('rejects multiple current resumes', () => {
    expect(() =>
      selectCurrentResume([
        { meta: { version: 'a', current: true } },
        { meta: { version: 'b', current: true } }
      ] as never)
    ).toThrow(/exactly one current resume/i)
  })
})
