"use client"

import { useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import type { UploadedImage } from "@repo/types"

import { cn } from "@repo/ui/lib/utils"

import { useImageUpload } from "../hooks/use-image-upload"

export interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  onUploaded?: (image: UploadedImage) => void
  folder?: string
  disabled?: boolean
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function MultiImageUpload({
  value,
  onChange,
  onUploaded,
  folder,
  disabled = false,
  maxFiles = 8,
  maxSize,
  className,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const { upload, isUploading, progress } = useImageUpload({
    folder,
    maxSize,
    onError: (err) => toast.error(err.message),
  })

  const full = value.length >= maxFiles
  const busy = isUploading || disabled

  async function addFiles(files: FileList | null) {
    if (!files?.length) return
    const room = maxFiles - value.length
    if (room <= 0) {
      toast.error(`You can upload up to ${maxFiles} images.`)
      return
    }

    const uploaded: string[] = []
    for (const file of Array.from(files).slice(0, room)) {
      const image = await upload(file)
      if (image) {
        uploaded.push(image.url)
        onUploaded?.(image)
      }
    }
    if (uploaded.length) onChange([...value, ...uploaded])
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    if (!busy && !full) void addFiles(event.dataTransfer.files)
  }

  function onSelected(event: ChangeEvent<HTMLInputElement>) {
    void addFiles(event.target.files)
    event.target.value = ""
  }

  function removeImage(url: string) {
    onChange(value.filter((current) => current !== url))
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {value.map((url) => (
        <div
          key={url}
          className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="size-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-3" />
              <span className="sr-only">Remove image</span>
            </button>
          )}
        </div>
      ))}

      {!full && (
        <button
          type="button"
          disabled={busy}
          aria-label="Add images"
          className={cn(
            "flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            dragging && "border-primary bg-primary/5",
            !busy && "cursor-pointer hover:bg-muted/50"
          )}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            if (!busy) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span className="text-[0.65rem] tabular-nums">{progress}%</span>
            </>
          ) : (
            <Plus className="size-4" />
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        disabled={busy}
        onChange={onSelected}
      />
    </div>
  )
}
