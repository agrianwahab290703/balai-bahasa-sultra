export const MAX_FILES = 6
export const MIN_FILES = 2
export const MAX_SIZE_BYTES = 2 * 1024 * 1024
export const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export function validateFile(file: Pick<File, 'type' | 'size'>): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format harus JPG/JPEG atau PNG'
  if (file.size > MAX_SIZE_BYTES) return 'Ukuran maksimal 2MB per file'
  return null
}
