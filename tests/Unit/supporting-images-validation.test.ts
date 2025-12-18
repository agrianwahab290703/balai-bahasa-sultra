import { describe, it, expect } from 'vitest'
import { validateFile, MAX_SIZE_BYTES } from '../../resources/js/lib/supportingImages'

describe('supporting images validation', () => {
  it('accepts jpeg within size', () => {
    const err = validateFile({ type: 'image/jpeg', size: MAX_SIZE_BYTES - 1024 } as any)
    expect(err).toBeNull()
  })
  it('accepts png within size', () => {
    const err = validateFile({ type: 'image/png', size: MAX_SIZE_BYTES - 1024 } as any)
    expect(err).toBeNull()
  })
  it('rejects gif', () => {
    const err = validateFile({ type: 'image/gif', size: 1024 } as any)
    expect(err).toBeTypeOf('string')
  })
  it('rejects oversize', () => {
    const err = validateFile({ type: 'image/jpeg', size: MAX_SIZE_BYTES + 1 } as any)
    expect(err).toBeTypeOf('string')
  })
})
