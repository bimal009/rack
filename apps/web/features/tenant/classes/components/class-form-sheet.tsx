"use client"

import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarClock, Dumbbell, FileText, Info, MapPin, Palette } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
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
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { TimeSelect } from "@/components/time-select"
import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { initialAreaTypes, initialClassTypes } from "@/features/tenant/settings/types/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import {
  classSchema,
  classVisibilities,
  repeatEndModes,
  repeatFrequencies,
  type ClassInput,
  type ClassSession,
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

function toFormValues(cls?: ClassSession | null): ClassInput {
  if (!cls) {
    return {
      name: "",
      classType: "",
      price: 0,
      maxCapacity: undefined,
      visibility: "Public",
      instructorId: "",
      areaId: "",
      date: "",
      startTime: "09:00",
      endTime: "10:00",
      repeat: false,
      repeatEvery: 1,
      repeatFrequency: "Week",
      repeatEndMode: "Never",
      repeatEndDate: undefined,
      repeatEndOccurrences: undefined,
      color: "#3b82f6",
      sport: "",
      description: "",
      notes: "",
    }
  }
  return {
    name: cls.name,
    classType: cls.classType ?? "",
    price: cls.price,
    maxCapacity: cls.maxCapacity,
    visibility: cls.visibility,
    instructorId: cls.instructorId ?? "",
    areaId: cls.areaId ?? "",
    date: cls.date,
    startTime: cls.startTime,
    endTime: cls.endTime,
    repeat: cls.repeat,
    repeatEvery: cls.repeatEvery ?? 1,
    repeatFrequency: cls.repeatFrequency ?? "Week",
    repeatEndMode: cls.repeatEndMode ?? "Never",
    repeatEndDate: cls.repeatEndDate,
    repeatEndOccurrences: cls.repeatEndOccurrences,
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
  const form = useForm<ClassInput>({
    resolver: zodResolver(classSchema),
    defaultValues: toFormValues(cls),
  })
  const values = useWatch({ control: form.control })
  const isEdit = Boolean(cls)
  const duration = computeDuration(values.startTime ?? "", values.endTime ?? "")

  function handleSubmit(values: ClassInput) {
    onSubmit({
      ...values,
      repeatEvery: values.repeat ? values.repeatEvery : undefined,
      repeatFrequency: values.repeat ? values.repeatFrequency : undefined,
      repeatEndMode: values.repeat ? values.repeatEndMode : undefined,
      repeatEndDate: values.repeat && values.repeatEndMode === "Until date" ? values.repeatEndDate : undefined,
      repeatEndOccurrences: values.repeat && values.repeatEndMode === "After occurrences" ? values.repeatEndOccurrences : undefined,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex h-full flex-col" noValidate>
      <SheetHeader>
        <FormSheetHeader
          icon={Dumbbell}
          title={isEdit ? "Edit class" : "Add class"}
          description="Schedule a class, assign an instructor, and set its pricing."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="Basic information">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="class-name">
                Class Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="class-name"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="class-type">Class Type</FieldLabel>
              <Select
                value={values.classType}
                onValueChange={(value) => form.setValue("classType", value ?? "", { shouldDirty: true })}
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
                  {...form.register("price", { valueAsNumber: true })}
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
                {...form.register("maxCapacity", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="class-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) => {
                  const visibility = classVisibilities.find((option) => option === value)
                  if (visibility) form.setValue("visibility", visibility, { shouldDirty: true })
                }}
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
        </FormSection>

        <FormSection icon={MapPin} title="Location & instructor">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="class-instructor">Instructor</FieldLabel>
              <Select
                value={values.instructorId}
                onValueChange={(value) => form.setValue("instructorId", value ?? "", { shouldDirty: true })}
              >
                <SelectTrigger id="class-instructor" className="w-full">
                  <SelectValue placeholder="Instructors">
                    {(value: string | null) =>
                      instructorOptions.find((s) => s.id === value)
                        ? fullName(
                            instructorOptions.find((s) => s.id === value)!
                          )
                        : "Instructors"
                    }
                  </SelectValue>
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
                onValueChange={(value) => form.setValue("areaId", value ?? "", { shouldDirty: true })}
              >
                <SelectTrigger id="class-area" className="w-full">
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
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={CalendarClock}
          title="Date & time"
          description="Times are in the club timezone (Asia/Kathmandu)."
        >
          <Field data-invalid={Boolean(form.formState.errors.date)}>
            <FieldLabel htmlFor="class-date">
              Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="class-date"
              type="date"
              aria-invalid={Boolean(form.formState.errors.date)}
              {...form.register("date")}
            />
            <FieldError>{form.formState.errors.date?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="class-start-time">
                Start Time <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller name="startTime" control={form.control} render={({ field }) => <TimeSelect id="class-start-time" value={field.value} onChange={field.onChange} />} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.endTime)}>
              <FieldLabel htmlFor="class-end-time">
                End Time <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller name="endTime" control={form.control} render={({ field }) => <TimeSelect id="class-end-time" value={field.value} onChange={field.onChange} />} />
              <FieldError>{form.formState.errors.endTime?.message}</FieldError>
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
            <Controller name="repeat" control={form.control} render={({ field }) => <Switch id="class-repeat" checked={field.value} onCheckedChange={field.onChange} />} />
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
                    value={values.repeatEvery ?? ""}
                    onChange={(event) => form.setValue("repeatEvery", event.target.valueAsNumber || 1, { shouldDirty: true })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="class-repeat-frequency">
                    Frequency
                  </FieldLabel>
                  <Select
                    value={values.repeatFrequency}
                    onValueChange={(value) => {
                      const frequency = repeatFrequencies.find((option) => option === value)
                      if (frequency) form.setValue("repeatFrequency", frequency, { shouldDirty: true })
                    }}
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
                  onValueChange={(value) => {
                    const endMode = repeatEndModes.find((option) => option === value)
                    if (endMode) form.setValue("repeatEndMode", endMode, { shouldDirty: true })
                  }}
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
                    {...form.register("repeatEndDate")}
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
                    value={values.repeatEndOccurrences ?? ""}
                    onChange={(event) => form.setValue("repeatEndOccurrences", event.target.valueAsNumber || undefined, { shouldDirty: true })}
                  />
                </Field>
              )}
            </>
          )}
        </FormSection>

        <FormSection icon={Palette} title="Appearance">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="class-color">Color</FieldLabel>
              <div className="flex items-center gap-2">
                <span
                  className="size-9 shrink-0 rounded-md border border-input"
                  style={{ backgroundColor: values.color ?? "#3b82f6" }}
                />
                <Input
                  id="class-color"
                  {...form.register("color")}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="class-sport">Sport</FieldLabel>
              <Input
                id="class-sport"
                placeholder="Yoga, Boxing..."
                {...form.register("sport")}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={FileText} title="Description & notes">
          <Field>
            <FieldLabel htmlFor="class-description">Description</FieldLabel>
            <Textarea
              id="class-description"
              {...form.register("description")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="class-notes">Notes</FieldLabel>
            <Textarea
              id="class-notes"
              {...form.register("notes")}
            />
            <FieldDescription>
              Only visible to staff, never to members. Applies to this class
              only, not the whole series.
            </FieldDescription>
          </Field>
        </FormSection>
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
