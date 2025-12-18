import React, { useMemo, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MediaPicker } from '@/Components/Admin/MediaPicker'

type Props = {
  value: string[]
  onChange: (next: string[]) => void
}

const MAX_FILES = 6
const MIN_FILES = 0

export default function SupportingImagesUploader({ value, onChange }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const gridCols = useMemo(() => {
    const count = value.length
    if (count <= 3) return 'grid-cols-2'
    return 'grid-cols-3'
  }, [value.length])

  const addSelected = (url: string) => {
    const merged = Array.from(new Set([...value, url])).slice(0, MAX_FILES)
    onChange(merged)
  }

  const removePersisted = (url: string) => {
    const next = value.filter(v => v !== url)
    onChange(next)
  }

  const showMinError = value.length < MIN_FILES

  return (
    <div className="space-y-3">
      <div className="border rounded-xl p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Pilih dari Media Library</div>
            <div className="text-xs text-gray-600">Hanya gambar yang sudah diunggah di halaman Media</div>
          </div>
        </div>
        <Button type="button" onClick={() => setPickerOpen(true)}>
          Pilih Gambar
        </Button>
      </div>

      <div className={cn('grid gap-3', gridCols)}>
        {value.map(url => (
          <div key={url} className="relative rounded-lg border overflow-hidden bg-white">
            <img
              src={url}
              alt=""
              className="w-full h-40 object-cover"
              loading="lazy"
              onClick={() => setLightbox(url)}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button type="button" size="icon" variant="ghost" onClick={() => setLightbox(url)}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => removePersisted(url)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          {value.length}/{MAX_FILES} gambar
        </div>
        <Button type="button" variant="outline" onClick={() => onChange([])}>Reset</Button>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" />
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => addSelected(url)}
        multiple
        accept={['image/jpeg','image/png','image/webp','image/gif']}
        title="Pilih Gambar Pendukung"
        allowUpload={false}
      />
    </div>
  )
}
