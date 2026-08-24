import type { OnboardingInput } from "@repo/types"
import { Input } from "@repo/ui/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@repo/ui/components/ui/field"

type BusinessDetailsValue = Pick<
  OnboardingInput,
  "businessName" | "address" | "phone" | "email" | "website"
>

interface BusinessDetailsStepProps {
  value: BusinessDetailsValue
  errors: Record<string, string>
  onChange: (patch: Partial<BusinessDetailsValue>) => void
}

export function BusinessDetailsStep({
  value,
  errors,
  onChange,
}: BusinessDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Tell us about your business
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll use these details on invoices and member communications.
        </p>
      </div>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.businessName)}>
          <FieldLabel htmlFor="businessName">Business name</FieldLabel>
          <Input
            id="businessName"
            placeholder="Golds Gym"
            value={value.businessName}
            aria-invalid={Boolean(errors.businessName)}
            onChange={(e) => onChange({ businessName: e.target.value })}
          />
          <FieldError>{errors.businessName}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.address)}>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input
            id="address"
            placeholder="Street, city, postcode, country"
            value={value.address}
            aria-invalid={Boolean(errors.address)}
            onChange={(e) => onChange({ address: e.target.value })}
          />
          <FieldError>{errors.address}</FieldError>
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="98XXXXXXXX"
              value={value.phone}
              aria-invalid={Boolean(errors.phone)}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
            <FieldError>{errors.phone}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="businessEmail">Email</FieldLabel>
            <Input
              id="businessEmail"
              type="email"
              placeholder="hello@yourbusiness.com"
              value={value.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => onChange({ email: e.target.value })}
            />
            <FieldError>{errors.email}</FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.website)}>
          <FieldLabel htmlFor="website">
            Website <span className="text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Input
            id="website"
            placeholder="https://yourbusiness.com"
            value={value.website}
            aria-invalid={Boolean(errors.website)}
            onChange={(e) => onChange({ website: e.target.value })}
          />
          <FieldError>{errors.website}</FieldError>
        </Field>
      </FieldGroup>
    </div>
  )
}
