import { z } from "zod"

export function fieldErrors<T>(error: z.ZodError<T> | undefined) {
  if (!error) return {} as Record<string, string>
  const flat = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >
  return Object.fromEntries(
    Object.entries(flat).map(([key, messages]) => [key, messages?.[0] ?? ""])
  )
}
