"use client"

import { Button } from "@repo/ui/components/ui/button"
import { Spinner } from "@repo/ui/components/ui/spinner"

import { GoogleIcon } from "@/features/auth/components/google-icon"
import { useGoogleAuthMutation } from "@/features/auth/hooks/use-google-auth-mutation"

interface GoogleAuthButtonProps {
  label?: string
}

export function GoogleAuthButton({
  label = "Continue with Google",
}: GoogleAuthButtonProps) {
  const googleAuth = useGoogleAuthMutation()

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={googleAuth.isPending}
      onClick={() => googleAuth.mutate()}
    >
      {googleAuth.isPending ? (
        <Spinner />
      ) : (
        <GoogleIcon className="size-4" />
      )}
      {label}
    </Button>
  )
}
