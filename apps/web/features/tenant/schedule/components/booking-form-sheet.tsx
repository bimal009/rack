"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { TimeSelect } from "@/components/time-select"
import { fullName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import { initialAreaTypes } from "@/features/tenant/settings/types/lib/data"

import { fieldErrors } from "../lib/validation"
import { bookingSchema, type Booking, type BookingInput } from "../lib/booking-schema"

interface BookingFormValues {
  memberId: string
  areaId: string
  date: string
  startTime: string
  endTime: string
  notes: string
}

function toFormValues(booking?: Booking | null): BookingFormValues {
  return {
    memberId: booking?.memberId ?? "",
    areaId: booking?.areaId ?? "",
    date: booking?.date ?? "",
    startTime: booking?.startTime ?? "09:00",
    endTime: booking?.endTime ?? "10:00",
    notes: booking?.notes ?? "",
  }
}

interface BookingFormBodyProps {
  booking?: Booking | null
  onSubmit: (values: BookingInput) => void
  onCancel: () => void
}

function BookingFormBody({ booking, onSubmit, onCancel }: BookingFormBodyProps) {
  const [values, setValues] = useState<BookingFormValues>(() =>
    toFormValues(booking)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(booking)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = bookingSchema.safeParse(values)

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>{isEdit ? "Edit Booking" : "Add Booking"}</SheetTitle>
        <SheetDescription>
          Reserve a bookable area for a member.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.memberId)}>
              <FieldLabel htmlFor="booking-member">
                Member <span className="text-destructive">*</span>
              </FieldLabel>
              <Combobox
                items={initialMembers.map((m) => m.id)}
                itemToStringLabel={(id) => {
                  const found = initialMembers.find((m) => m.id === id)
                  return found ? `${fullName(found)} — ${found.email}` : id
                }}
                value={values.memberId || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, memberId: value ?? "" }))
                }
              >
                <ComboboxInput id="booking-member" placeholder="Search member..." />
                <ComboboxContent>
                  <ComboboxEmpty>No members found.</ComboboxEmpty>
                  <ComboboxList>
                    {(id: string) => {
                      const found = initialMembers.find((m) => m.id === id)
                      return (
                        <ComboboxItem key={id} value={id}>
                          {found ? `${fullName(found)} — ${found.email}` : id}
                        </ComboboxItem>
                      )
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError>{errors.memberId}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.areaId)}>
              <FieldLabel htmlFor="booking-area">
                Area <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={values.areaId}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, areaId: value ?? "" }))
                }
              >
                <SelectTrigger
                  id="booking-area"
                  className="w-full"
                  aria-invalid={Boolean(errors.areaId)}
                >
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {initialAreaTypes.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.areaId}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.date)}>
              <FieldLabel htmlFor="booking-date">
                Date <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="booking-date"
                type="date"
                value={values.date}
                aria-invalid={Boolean(errors.date)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, date: e.target.value }))
                }
              />
              <FieldError>{errors.date}</FieldError>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="booking-start">Start Time</FieldLabel>
                <TimeSelect
                  id="booking-start"
                  value={values.startTime}
                  onChange={(startTime) =>
                    setValues((v) => ({ ...v, startTime }))
                  }
                />
              </Field>

              <Field data-invalid={Boolean(errors.endTime)}>
                <FieldLabel htmlFor="booking-end">End Time</FieldLabel>
                <TimeSelect
                  id="booking-end"
                  value={values.endTime}
                  onChange={(endTime) => setValues((v) => ({ ...v, endTime }))}
                />
                <FieldError>{errors.endTime}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="booking-notes">Notes</FieldLabel>
              <Textarea
                id="booking-notes"
                value={values.notes}
                onChange={(e) =>
                  setValues((v) => ({ ...v, notes: e.target.value }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add booking"}</Button>
      </SheetFooter>
    </form>
  )
}

interface BookingFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking?: Booking | null
  onSubmit: (values: BookingInput) => void
}

export function BookingFormSheet({
  open,
  onOpenChange,
  booking,
  onSubmit,
}: BookingFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <BookingFormBody
            key={booking?.id ?? "new"}
            booking={booking}
            onSubmit={(values) => {
              onSubmit(values)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
