"use client"

import { useState } from "react"
import Link from "next/link"

import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Field, FieldLabel } from "@repo/ui/components/ui/field"
import { Card, CardContent } from "@repo/ui/components/ui/card"

import type { BusinessType, OnboardingData } from "@/features/auth/types"

interface ReviewStepProps {
  data: OnboardingData
  businessType?: BusinessType
}

export function ReviewStep({ data, businessType }: ReviewStepProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [confirmedAuthority, setConfirmedAuthority] = useState(true)
  const [wantsUpdates, setWantsUpdates] = useState(true)

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Almost there
        </h1>
        <p className="text-sm text-muted-foreground">
          Review your plan and confirm a few details before we set up your club.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              You&apos;re starting on Grow — free for 30 days
            </p>
            <p className="text-sm text-muted-foreground">
              Full access, no credit card required. Cancel anytime before the
              trial ends.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-border pt-3 text-sm">
            <dt className="text-muted-foreground">Business</dt>
            <dd className="text-right text-foreground">
              {data.businessName || "—"}
            </dd>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="text-right text-foreground">
              {businessType?.title ?? "—"}
            </dd>
            <dt className="text-muted-foreground">Specialties</dt>
            <dd className="text-right text-foreground">
              {data.specialties.length > 0 ? data.specialties.length : "—"}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Field orientation="horizontal">
          <Checkbox
            id="confirmAuthority"
            checked={confirmedAuthority}
            onCheckedChange={(checked) => setConfirmedAuthority(checked === true)}
          />
          <FieldLabel htmlFor="confirmAuthority" className="font-normal">
            I confirm I am authorized to create this organization and to accept
            these terms on its behalf.
          </FieldLabel>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="agreeTerms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <FieldLabel htmlFor="agreeTerms" className="font-normal">
            I agree to the{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </FieldLabel>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="productUpdates"
            checked={wantsUpdates}
            onCheckedChange={(checked) => setWantsUpdates(checked === true)}
          />
          <FieldLabel htmlFor="productUpdates" className="font-normal">
            Send me product updates, tips, and offers. (Optional)
          </FieldLabel>
        </Field>
      </div>
    </div>
  )
}
