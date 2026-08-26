"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group"
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
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { TimeSelect } from "@/components/time-select"
import { initialAreaTypes, initialClassTypes } from "@/features/tenant/settings/types/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import { fieldErrors } from "../lib/validation"
import {
  classSchema,
  classVisibilities,
  repeatEndModes,
  repeatFrequencies,
  type ClassInput,
  type ClassSession,
  type ClassVisibility,
  type RepeatEndMode,
  type RepeatFrequency,
} from "../lib/schema"

const instructorOptions = initialStaff.filter((s) => s.role === "Instructor")

function computeDuration(start: string, end: string) {
  if (!start || !end) return ""
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes <= 0) return ""
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours && mins) return `${hours}h ${mins}m`
  if (hours) return `${hours}h`
  return `${mins}m`
}

interface ClassFormValues {
  name: string
  classType: string
  price: string
  maxCapacity: string
  visibility: ClassVisibility
  instructorId: string
  areaId: string
  date: string
  startTime: string
  endTime: string
  repeat: boolean
  repeatEvery: string
  repeatFrequency: RepeatFrequency
  repeatEndMode: RepeatEndMode
  repeatEndDate: string
  repeatEndOccurrences: string
  color: string
  sport: string
  description: string
  notes: string
}

function toFormValues(cls?: ClassSession | null): ClassFormValues {
  if (!cls) {
    return {
      name: "",
      classType: "",
      price: "0",
      maxCapacity: "",
      visibility: "Public",
      instructorId: "",
      areaId: "",
      date: "",
      startTime: "09:00",
      endTime: "10:00",
      repeat: false,
      repeatEvery: "1",
      repeatFrequency: "Week",
      repeatEndMode: "Never",
      repeatEndDate: "",
      repeatEndOccurrences: "",
      color: "#3b82f6",
      sport: "",
      description: "",
      notes: "",
    }
  }
  return {
    name: cls.name,
    classType: cls.classType ?? "",
    price: String(cls.price),
    maxCapacity: cls.maxCapacity ? String(cls.maxCapacity) : "",
    visibility: cls.visibility,
    instructorId: cls.instructorId ?? "",
    areaId: cls.areaId ?? "",
    date: cls.date,
    startTime: cls.startTime,
    endTime: cls.endTime,
    repeat: cls.repeat,
    repeatEvery: cls.repeatEvery ? String(cls.repeatEvery) : "1",
    repeatFrequency: cls.repeatFrequency ?? "Week",
    repeatEndMode: cls.repeatEndMode ?? "Never",
    repeatEndDate: cls.repeatEndDate ?? "",
    repeatEndOccurrences: cls.repeatEndOccurrences
      ? String(cls.repeatEndOccurrences)
      : "",
    color: cls.color ?? "#3b82f6",
    sport: cls.sport ?? "",
    description: cls.description ?? "",
    notes: cls.notes ?? "",
  }
}

interface ClassFormBodyProps {
  cls?: ClassSession | null
  onSubmit: (values: ClassInput) => void
  onCancel: () => void
}

function ClassFormBody({ cls, onSubmit, onCancel }: ClassFormBodyProps) {
  const [values, setValues] = useState<ClassFormValues>(() => toFormValues(cls))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(cls)
  const duration = computeDuration(values.startTime, values.endTime)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = classSchema.safeParse({
      ...values,
      price: Number(values.price),
      maxCapacity: values.maxCapacity ? Number(values.maxCapacity) : undefined,
      repeatEvery: values.repeat ? Number(values.repeatEvery) : undefined,
      repeatFrequency: values.repeat ? values.repeatFrequency : undefined,
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
        <SheetTitle>{isEdit ? "Edit Class" : "Add Class"}</SheetTitle>
        <SheetDescription>
          Schedule a class, assign an instructor, and set its pricing.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="class-name">
                  Class Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="class-name"
                  value={values.name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, name: e.target.value }))
                  }
                />
                <FieldError>{errors.name}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-type">Class Type</FieldLabel>
                <Select
                  value={values.classType}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, classType: value ?? "" }))
                  }
                >
                  <SelectTrigger id="class-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialClassTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="class-price">Price</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="class-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={values.price}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, price: e.target.value }))
                    }
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-max-capacity">
                  Max Capacity
                </FieldLabel>
                <Input
                  id="class-max-capacity"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={values.maxCapacity}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, maxCapacity: e.target.value }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="class-visibility">Visibility</FieldLabel>
                <Select
                  value={values.visibility}
                  onValueChange={(value) =>
                    setValues((v) => ({
                      ...v,
                      visibility: value as ClassVisibility,
                    }))
                  }
                >
                  <SelectTrigger id="class-visibility" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classVisibilities.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Location & Instructor</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="class-instructor">Instructor</FieldLabel>
                <Select
                  value={values.instructorId}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, instructorId: value ?? "" }))
                  }
                >
                  <SelectTrigger id="class-instructor" className="w-full">
                    <SelectValue placeholder="Instructors" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructorOptions.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {fullName(staff)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-area">Select Area</FieldLabel>
                <Select
                  value={values.areaId}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, areaId: value ?? "" }))
                  }
                >
                  <SelectTrigger id="class-area" className="w-full">
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
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Date & Time</FieldLegend>
          <FieldGroup>
            <FieldDescription>
              Times are in the club timezone (Asia/Kathmandu).
            </FieldDescription>

            <Field data-invalid={Boolean(errors.date)}>
              <FieldLabel htmlFor="class-date">
                Date <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="class-date"
                type="date"
                value={values.date}
                aria-invalid={Boolean(errors.date)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, date: e.target.value }))
                }
              />
              <FieldError>{errors.date}</FieldError>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="class-start-time">
                  Start Time <span className="text-destructive">*</span>
                </FieldLabel>
                <TimeSelect
                  id="class-start-time"
                  value={values.startTime}
                  onChange={(startTime) =>
                    setValues((v) => ({ ...v, startTime }))
                  }
                />
              </Field>

              <Field data-invalid={Boolean(errors.endTime)}>
                <FieldLabel htmlFor="class-end-time">
                  End Time <span className="text-destructive">*</span>
                </FieldLabel>
                <TimeSelect
                  id="class-end-time"
                  value={values.endTime}
                  onChange={(endTime) =>
                    setValues((v) => ({ ...v, endTime }))
                  }
                />
                <FieldError>{errors.endTime}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-duration">Duration</FieldLabel>
                <Input
                  id="class-duration"
                  value={duration}
                  readOnly
                  disabled
                />
              </Field>
            </div>

            <Field orientation="horizontal">
              <Switch
                id="class-repeat"
                checked={values.repeat}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, repeat: checked }))
                }
              />
              <FieldLabel htmlFor="class-repeat">Repeat</FieldLabel>
            </Field>

            {values.repeat && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="class-repeat-every">
                      Repeat every
                    </FieldLabel>
                    <Input
                      id="class-repeat-every"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
                      value={values.repeatEvery}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          repeatEvery: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="class-repeat-frequency">
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
                        id="class-repeat-frequency"
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

                <Field>
                  <FieldLabel htmlFor="class-repeat-ends">Ends</FieldLabel>
                  <Select
                    value={values.repeatEndMode}
                    onValueChange={(value) =>
                      setValues((v) => ({
                        ...v,
                        repeatEndMode: value as RepeatEndMode,
                      }))
                    }
                  >
                    <SelectTrigger id="class-repeat-ends" className="w-full">
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
                      Bookings will be created automatically on a rolling
                      basis.
                    </FieldDescription>
                  )}
                </Field>

                {values.repeatEndMode === "Until date" && (
                  <Field>
                    <FieldLabel htmlFor="class-repeat-end-date">
                      Until date
                    </FieldLabel>
                    <Input
                      id="class-repeat-end-date"
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
                    <FieldLabel htmlFor="class-repeat-occurrences">
                      After occurrences
                    </FieldLabel>
                    <Input
                      id="class-repeat-occurrences"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
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
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Appearance</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="class-color">Color</FieldLabel>
                <div className="flex items-center gap-2">
                  <span
                    className="size-9 shrink-0 rounded-md border border-input"
                    style={{ backgroundColor: values.color }}
                  />
                  <Input
                    id="class-color"
                    value={values.color}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, color: e.target.value }))
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-sport">Sport</FieldLabel>
                <Input
                  id="class-sport"
                  placeholder="Yoga, Boxing..."
                  value={values.sport}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, sport: e.target.value }))
                  }
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Description</FieldLegend>
          <FieldGroup>
            <Textarea
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Notes</FieldLegend>
          <FieldGroup>
            <FieldDescription>
              Only visible to staff, never to members. Applies to this class
              only, not the whole series.
            </FieldDescription>
            <Textarea
              value={values.notes}
              onChange={(e) =>
                setValues((v) => ({ ...v, notes: e.target.value }))
              }
            />
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add"}</Button>
      </SheetFooter>
    </form>
  )
}

interface ClassFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls?: ClassSession | null
  onSubmit: (values: ClassInput) => void
}

export function ClassFormSheet({
  open,
  onOpenChange,
  cls,
  onSubmit,
}: ClassFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <ClassFormBody
            key={cls?.id ?? "new"}
            cls={cls}
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
