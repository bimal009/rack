"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, TriangleAlert } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@repo/ui/components/ui/field"
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert"

import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button"
import { useSignupMutation } from "@/features/auth/hooks/use-signup-mutation"
import { signupSchema, fieldErrors } from "@/features/auth/lib/validation"

export function SignupForm() {
  const router = useRouter()
  const signup = useSignupMutation()

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = signupSchema.safeParse(values)
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    signup.mutate(result.data, {
      onSuccess: () => router.push("/onboarding"),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up your club in a few minutes.
        </p>
      </div>

      {signup.isError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{signup.error.message}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Alex Rivera"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

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
                autoComplete="new-password"
                placeholder="At least 8 characters"
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

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              aria-invalid={Boolean(errors.confirmPassword)}
              onChange={(e) =>
                setValues((v) => ({ ...v, confirmPassword: e.target.value }))
              }
            />
            <FieldError>{errors.confirmPassword}</FieldError>
          </Field>

          <Field
            orientation="horizontal"
            className="items-start"
            data-invalid={Boolean(errors.acceptTerms)}
          >
            <Checkbox
              id="acceptTerms"
              className="mt-0.5"
              checked={values.acceptTerms}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, acceptTerms: checked === true }))
              }
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm leading-snug text-foreground text-pretty [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary"
            >
              I agree to the{" "}
              <Link href="/terms">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </label>
          </Field>
          <FieldError className="-mt-3">{errors.acceptTerms}</FieldError>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={signup.isPending}
        >
          {signup.isPending && <Spinner />}
          Create account
        </Button>
      </form>

      <AuthDivider />

      <GoogleAuthButton label="Sign up with Google" callbackURL="/onboarding" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
