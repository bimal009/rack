"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, TriangleAlert } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@repo/ui/components/ui/field"
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert"
import { Checkbox } from "@repo/ui/components/ui/checkbox"

import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button"
import { useLoginMutation } from "@/features/auth/hooks/use-login-mutation"
import { loginSchema, fieldErrors } from "@/features/auth/lib/validation"

export function LoginForm() {
  const router = useRouter()
  const login = useLoginMutation()

  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = loginSchema.safeParse(values)
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    login.mutate(result.data, {
      onSuccess: () => router.push("/"),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your club.
        </p>
      </div>

      {login.isError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{login.error.message}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
            />
            <FieldError>{errors.email}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, password: e.target.value }))
                }
                className="pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.password}</FieldError>
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between">
          <label
            htmlFor="rememberMe"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={login.isPending}
        >
          {login.isPending && <Spinner />}
          Sign in
        </Button>
      </form>

      <AuthDivider />

      <GoogleAuthButton callbackURL="/" />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
