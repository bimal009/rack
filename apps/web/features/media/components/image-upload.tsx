"use client"

import { useRef, useState, type DragEvent } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import type { UploadedImage } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Progress } from "@repo/ui/components/ui/progress"
import { cn } from "@repo/ui/lib/utils"

import { useImageUpload } from "../hooks/use-image-upload"

export interface ImageUploadProps {
  /** Current image URL (controlled). */
  value?: string | null
  onChange: (url: string | null) => void
  /** Full ImageKit result, if the caller wants more than the URL. */
  onUploaded?: (image: UploadedImage) => void
  /** ImageKit folder to upload into, e.g. `"staff/avatars"`. */
  folder?: string
  disabled?: boolean
  shape?: "circle" | "square" | "wide"
  /** Max file size in bytes (default 5 MB). */
  maxSize?: number
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onUploaded,
  folder,
  disabled = false,
  shape = "square",
  maxSize,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const { upload, cancel, isUploading, progress, error } = useImageUpload({
    folder,
    maxSize,
    onUploaded: (image) => {
      onChange(image.url)
      onUploaded?.(image)
    },
    onError: (err) => toast.error(err.message),
  })

  const busy = isUploading || disabled

  function pick(files: FileList | null) {
    const file = files?.[0]
    if (file) void upload(file)
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    if (!busy) pick(event.dataTransfer.files)
  }

  const frame =
    shape === "circle"
      ? "aspect-square rounded-full w-28"
      : shape === "wide"
        ? "aspect-[16/6] rounded-xl w-full"
        : "aspect-square rounded-xl w-32"

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-label="Upload image"
        className={cn(
          "group relative flex items-center justify-center overflow-hidden border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          frame,
          dragging && "border-primary bg-primary/5",
          !busy && "cursor-pointer hover:border-primary/60"
        )}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !busy) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 p-3 text-center">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-xs tabular-nums">{progress}%</span>
          </div>
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-3 text-center">
            <Upload className="size-5" />
            <span className="text-xs">Click or drop an image</span>
          </div>
        )}

        {value && !isUploading && !disabled && (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute top-1.5 right-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            onClick={(event) => {
              event.stopPropagation()
              onChange(null)
            }}
          >
            <X className="size-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="flex-1" />
          <Button type="button" size="sm" variant="ghost" onClick={cancel}>
            Cancel
          </Button>
        </div>
      )}

      {error && !isUploading && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          pick(event.target.files)
          event.target.value = ""
        }}
      />
    </div>
  )
}
