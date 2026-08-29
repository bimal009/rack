import { apiClient } from "@/api-client"
import type { ImageKitAuthParams, UploadedImage } from "@repo/types"
import { isAxiosError } from "axios"

export class MediaError extends Error {}

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload"

export async function getImageKitAuth(): Promise<ImageKitAuthParams> {
  try {
    const { data } = await apiClient.get<{ data: ImageKitAuthParams }>(
      "/api/v1/media/imagekit/auth"
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new MediaError(
        error.response?.data?.message ?? "Could not authorize upload."
      )
    }
    throw error
  }
}

export interface UploadImageOptions {
  folder?: string
  fileName?: string
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

export async function uploadImage(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadedImage> {
  const auth = await getImageKitAuth()

  const form = new FormData()
  form.append("file", file)
  form.append("fileName", options.fileName ?? file.name)
  form.append("publicKey", auth.publicKey)
  form.append("signature", auth.signature)
  form.append("expire", String(auth.expire))
  form.append("token", auth.token)
  form.append("useUniqueFileName", "true")
  if (options.folder) form.append("folder", options.folder)

  return new Promise<UploadedImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", IMAGEKIT_UPLOAD_URL)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        options.onProgress?.(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      let body: Record<string, unknown> | null = null
      try {
        body = JSON.parse(xhr.responseText) as Record<string, unknown>
      } catch {
        body = null
      }

      if (xhr.status >= 200 && xhr.status < 300 && body && "url" in body) {
        resolve(body as unknown as UploadedImage)
      } else {
        const message =
          (body && typeof body.message === "string" && body.message) ||
          "Image upload failed."
        reject(new MediaError(message))
      }
    }

    xhr.onerror = () => reject(new MediaError("Image upload failed."))
    xhr.onabort = () => reject(new MediaError("Upload cancelled."))

    options.signal?.addEventListener("abort", () => xhr.abort())

    xhr.send(form)
  })
}
