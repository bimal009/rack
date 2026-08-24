import type { Metadata } from "next"

import { SignupForm } from "@/features/auth/components/signup-form"

export const metadata: Metadata = {
  title: "Sign up | Rackrage",
}

export default function SignupPage() {
  return <SignupForm />
}
