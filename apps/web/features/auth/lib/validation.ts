import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.literal(true, {
      error: "You must accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignupInput = z.infer<typeof signupSchema>

export function fieldErrors<T>(error: z.ZodError<T> | undefined) {
  if (!error) return {} as Record<string, string>
  const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>
  return Object.fromEntries(
    Object.entries(flat).map(([key, messages]) => [key, messages?.[0] ?? ""])
  )
}
