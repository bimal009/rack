import { z } from "zod"

export function fieldErrors<T>(error: z.ZodError<T> | undefined) {
  if (!error) return {} as Record<string, string>
  return Object.fromEntries(
    error.issues.map((issue) => [issue.path.join("."), issue.message])
  )
}
