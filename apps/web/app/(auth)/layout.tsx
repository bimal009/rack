import { AuthHeader } from "@/features/auth/components/auth-header"
import { AuthAside } from "@/features/auth/components/auth-aside"

export default function AuthLayout({ children }: LayoutProps<"/(auth)">) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="flex flex-col gap-10 px-6 py-8 sm:px-12 lg:px-16 lg:py-10">
        <AuthHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <AuthAside
        title="Run every class, member, and payment from one place."
        description="Rackrage brings booking, billing, and staff scheduling together so you can spend less time on admin and more time on the floor."
        tags={["Class scheduling", "Membership billing", "Staff tools"]}
      />
    </div>
  )
}
