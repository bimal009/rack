"use client"

import { useState, type FormEvent } from "react"
import { CalendarClock, Check, Ticket } from "lucide-react"

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
  FieldDescription,
  FieldError,
  FieldLabel,
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
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { cn } from "@repo/ui/lib/utils"

import { TimeSelect } from "@/components/time-select"
import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { fullName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import { initialAreaTypes } from "@/features/tenant/settings/types/lib/data"

import { fieldErrors } from "../lib/validation"
import {
  bookingSchema,
  repeatEndModes,
  repeatFrequencies,
  weekdays,
  type Booking,
  type BookingInput,
  type RepeatEndMode,
  type RepeatFrequency,
  type Weekday,
} from "../lib/booking-schema"

interface BookingFormValues {
  memberId: string
  areaId: string
  date: string
  startTime: string
  endTime: string
  notes: string
  repeat: boolean
  repeatEvery: string
  repeatFrequency: RepeatFrequency
  repeatWeekdays: Weekday[]
  repeatEndMode: RepeatEndMode
  repeatEndDate: string
  repeatEndOccurrences: string
}

function toFormValues(booking?: Booking | null): BookingFormValues {
  return {
    memberId: booking?.memberId ?? "",
    areaId: booking?.areaId ?? "",
    date: booking?.date ?? "",
    startTime: booking?.startTime ?? "09:00",
    endTime: booking?.endTime ?? "10:00",
    notes: booking?.notes ?? "",
    repeat: booking?.repeat ?? false,
    repeatEvery: booking?.repeatEvery ? String(booking.repeatEvery) : "1",
    repeatFrequency: booking?.repeatFrequency ?? "Week",
    repeatWeekdays: booking?.repeatWeekdays ?? [],
    repeatEndMode: booking?.repeatEndMode ?? "Never",
    repeatEndDate: booking?.repeatEndDate ?? "",
    repeatEndOccurrences: booking?.repeatEndOccurrences
      ? String(booking.repeatEndOccurrences)
      : "",
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

  function toggleWeekday(day: Weekday) {
    setValues((v) => ({
      ...v,
      repeatWeekdays: v.repeatWeekdays.includes(day)
        ? v.repeatWeekdays.filter((d) => d !== day)
        : [...v.repeatWeekdays, day],
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = bookingSchema.safeParse({
      ...values,
      repeatEvery: values.repeat ? Number(values.repeatEvery) : undefined,
      repeatFrequency: values.repeat ? values.repeatFrequency : undefined,
      repeatWeekdays:
        values.repeat && values.repeatFrequency === "Week"
          ? values.repeatWeekdays
          : undefined,
      repeatEndMode: values.repeat ? values.repeatEndMode : undefined,
      repeatEndDate:
        values.repeat && values.repeatEndMode === "Until date"
          ? values.repeatEndDate
          : undefined,
      repeatEndOccurrences:
        values.repeat && values.repeatEndMode === "After occurrences"
          ? Number(values.repeatEndOccurrences)
          : undefined,
    })

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
        <FormSheetHeader
          icon={Ticket}
          title={isEdit ? "Edit booking" : "Add booking"}
          description="Reserve a bookable area for a member."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Ticket} title="Booking details">
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
                <SelectValue placeholder="Select Area">
                  {(value: string | null) =>
                    initialAreaTypes.find((a) => a.id === value)?.name ??
                    "Select Area"
                  }
                </SelectValue>
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

          <Field>
            <FieldLabel htmlFor="booking-notes">Notes</FieldLabel>
            <Textarea
              id="booking-notes"
              placeholder="Anything staff should know about this booking"
              value={values.notes}
              onChange={(e) =>
                setValues((v) => ({ ...v, notes: e.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection icon={CalendarClock} title="Date & time">
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

          <Field orientation="horizontal">
            <Switch
              id="booking-repeat"
              checked={values.repeat}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, repeat: checked }))
              }
            />
            <FieldLabel htmlFor="booking-repeat">Repeat</FieldLabel>
          </Field>

          {values.repeat && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="booking-repeat-every">
                    Repeat every
                  </FieldLabel>
                  <Input
                    id="booking-repeat-every"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    placeholder="1"
                    value={values.repeatEvery}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, repeatEvery: e.target.value }))
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-repeat-frequency">
                    Frequency
                  </FieldLabel>
                  <Select
                    value={values.repeatFrequency}
                    onValueChange={(value) =>
                      setValues((v) => ({
                        ...v,
                        repeatFrequency: value as RepeatFrequency,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="booking-repeat-frequency"
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {repeatFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {values.repeatFrequency === "Week" && (
                <Field>
                  <FieldLabel>Repeat on</FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {weekdays.map((day) => {
                      const selected = values.repeatWeekdays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleWeekday(day)}
                          className={cn(
                            "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-foreground hover:bg-muted/50"
                          )}
                        >
                          {selected && <Check className="size-3" />}
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="booking-repeat-ends">Ends</FieldLabel>
                <Select
                  value={values.repeatEndMode}
                  onValueChange={(value) =>
                    setValues((v) => ({
                      ...v,
                      repeatEndMode: value as RepeatEndMode,
                    }))
                  }
                >
                  <SelectTrigger id="booking-repeat-ends" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {repeatEndModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {values.repeatEndMode === "Never" && (
                  <FieldDescription>
                    Bookings will be created automatically on a rolling basis.
                  </FieldDescription>
                )}
              </Field>

              {values.repeatEndMode === "Until date" && (
                <Field>
                  <FieldLabel htmlFor="booking-repeat-end-date">
                    Until date
                  </FieldLabel>
                  <Input
                    id="booking-repeat-end-date"
                    type="date"
                    value={values.repeatEndDate}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        repeatEndDate: e.target.value,
                      }))
                    }
                  />
                </Field>
              )}

              {values.repeatEndMode === "After occurrences" && (
                <Field>
                  <FieldLabel htmlFor="booking-repeat-occurrences">
                    Occurrences
                  </FieldLabel>
                  <Input
                    id="booking-repeat-occurrences"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    placeholder="10"
                    value={values.repeatEndOccurrences}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        repeatEndOccurrences: e.target.value,
                      }))
                    }
                  />
                </Field>
              )}
            </>
          )}
        </FormSection>
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
