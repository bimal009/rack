"use client"

import { useCallback, useRef, useState } from "react"
import type { UploadedImage } from "@repo/types"

import { uploadImage } from "../api/media"

export interface UseImageUploadOptions {
  folder?: string
  /** Reject files larger than this many bytes (default 5 MB). */
  maxSize?: number
  onUploaded?: (image: UploadedImage) => void
  onError?: (error: Error) => void
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024

export function useImageUpload({
  folder,
  maxSize = DEFAULT_MAX_SIZE,
  onUploaded,
  onError,
}: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fail = useCallback(
    (message: string) => {
      const err = new Error(message)
      setError(message)
      onError?.(err)
      return null
    },
    [onError]
  )

  const upload = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      if (!file.type.startsWith("image/")) {
        return fail("Choose an image file.")
      }
      if (file.size > maxSize) {
        return fail(`Image must be under ${Math.round(maxSize / 1024 / 1024)} MB.`)
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsUploading(true)
      setProgress(0)
      setError(null)

      try {
        const image = await uploadImage(file, {
          folder,
          signal: controller.signal,
          onProgress: setProgress,
        })
        onUploaded?.(image)
        return image
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed."
        return fail(message)
      } finally {
        setIsUploading(false)
        abortRef.current = null
      }
    },
    [fail, folder, maxSize, onUploaded]
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
  }, [])

  return { upload, cancel, reset, isUploading, progress, error }
}
