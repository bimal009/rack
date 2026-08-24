import type { ReactNode } from "react"

import { AuthHeader } from "@/features/auth/components/auth-header"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-12">
      <div className="w-full max-w-sm space-y-6">
        <AuthHeader />
        {children}
      </div>
    </div>
  )
}
