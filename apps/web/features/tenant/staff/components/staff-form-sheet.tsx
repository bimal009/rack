"use client"

import { useRouter } from "next/navigation"
import { CalendarIcon, IdCard, Plus, UserRoundCog } from "lucide-react"
import { toast } from "sonner"
import { Controller, useForm, useWatch, type Control, type DefaultValues, type FieldPath, type UseFormRegisterReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { payTypeEnumSchema, staffGenderEnumSchema, staffVisibilityEnumSchema, staffWithUserInsertSchema, type NewStaffWithUser, type StaffWithUser } from "@repo/types"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { Field, FieldDescription, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@repo/ui/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader } from "@repo/ui/components/ui/sheet"
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Switch } from "@repo/ui/components/ui/switch"
import { FormSheetHeader } from "@/features/tenant/components/form-section"
import { ImageUpload } from "@/features/media"
import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"
import { useCreateStaffMutation, useUpdateStaffMutation } from "../hooks/use-staff"
import { GYM_ROLE_LABELS } from "../lib/roles"

const roles = ["admin", "manager", "instructor", "frontdesk"] as const
type StaffFormInput = z.input<typeof staffWithUserInsertSchema>
type StaffField = FieldPath<StaffFormInput>

function defaults(staff?: StaffWithUser | null): DefaultValues<StaffFormInput> {
  const parts = staff?.user.name.trim().split(/\s+/) ?? []
  const [firstName = "", ...rest] = parts
  return { image: staff?.user.image ?? "", isActive: staff?.isActive ?? true, firstName, lastName: rest.join(" "), email: staff?.user.email ?? "", phone: staff?.phone ?? "", dateOfBirth: staff?.dateOfBirth ?? "", gender: staff?.gender ?? "", address: staff?.address ?? "", role: staff?.role, payType: staff?.payType, payRate: staff?.payRate, instructorTypeId: staff?.instructorTypeId ?? "", experience: staff?.experience ?? null, certifications: staff?.certifications ?? "", canBeBooked: staff?.canBeBooked ?? false, visibility: staff?.visibility ?? "Public", maxConcurrentBookings: staff?.maxConcurrentBookings ?? 1 }
}

function formatDate(date?: Date) {
  return date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""
}

interface StaffFormSheetProps { tenant: string; open: boolean; onOpenChange: (open: boolean) => void; staff?: StaffWithUser | null }

export function StaffFormSheet({ tenant, open, onOpenChange, staff }: StaffFormSheetProps) {
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent className="sm:max-w-xl">{open && <StaffForm key={staff?.id ?? "new"} tenant={tenant} staff={staff} onClose={() => onOpenChange(false)} />}</SheetContent></Sheet>
}

function StaffForm({ tenant, staff, onClose }: { tenant: string; staff?: StaffWithUser | null; onClose: () => void }) {
  const router = useRouter()
  const isEdit = Boolean(staff)
  const create = useCreateStaffMutation(tenant)
  const update = useUpdateStaffMutation(tenant)
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })
  const form = useForm<StaffFormInput, unknown, NewStaffWithUser>({ defaultValues: defaults(staff), resolver: zodResolver(staffWithUserInsertSchema) })
  const { control, formState: { errors }, handleSubmit, register, setValue } = form
  const role = useWatch({ control, name: "role" })
  const pending = isEdit ? update.isPending : create.isPending
  const onSubmit = handleSubmit((data) => {
    if (staff) {
      const { firstName, lastName, email, image, ...input } = data
      update.mutate({ id: staff.id, input }, { onSuccess: () => { toast.success(`${staff.user.name} updated`); onClose() }, onError: (error) => toast.error(error.message) })
    } else create.mutate(data, { onSuccess: () => { toast.success(`${data.firstName} ${data.lastName} added to staff`); onClose() }, onError: (error) => toast.error(error.message) })
  })
  return <form onSubmit={onSubmit} className="flex h-full flex-col"><SheetHeader><FormSheetHeader icon={UserRoundCog} title={isEdit ? "Edit staff member" : "Add staff member"} description={isEdit ? "Update role, pay, and profile details for this member." : "Creates a user account and links it to this gym."} /></SheetHeader><SheetBody className="flex flex-col gap-6">
    <section className="space-y-4"><h3 className="text-sm font-semibold">Basic information</h3><Controller control={control} name="isActive" render={({ field }) => <Field orientation="horizontal"><Switch id="staff-active" checked={field.value} onCheckedChange={field.onChange} /><div><FieldLabel htmlFor="staff-active">Active staff member</FieldLabel><FieldDescription>Inactive members stay on record but are hidden from most views.</FieldDescription></div></Field>} />
    {staff ? <div className="flex items-center gap-3 border border-border bg-muted/30 p-3"><Avatar size="sm"><AvatarImage src={staff.user.image ?? undefined} alt="" /><AvatarFallback>{staff.user.name.slice(0, 2)}</AvatarFallback></Avatar><div><p className="text-sm font-medium">{staff.user.name}</p><p className="text-xs text-muted-foreground">{staff.user.email}</p></div></div> : <><Field><FieldLabel>Photo</FieldLabel><Controller control={control} name="image" render={({ field }) => <ImageUpload folder="staff/avatars" value={field.value ?? null} onChange={(url) => field.onChange(url ?? "")} disabled={pending} />} /></Field><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><TextField label="First Name" error={errors.firstName?.message} input={register("firstName")} /><TextField label="Last Name" error={errors.lastName?.message} input={register("lastName")} /></div><TextField label="Email" type="email" error={errors.email?.message} input={register("email")} /></>}
    <TextField label="Phone" error={errors.phone?.message} input={register("phone")} prefix="+977" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Controller control={control} name="dateOfBirth" render={({ field }) => <Field><FieldLabel>Date of Birth</FieldLabel><Popover><PopoverTrigger render={<Button type="button" variant="outline" className="w-full justify-start font-normal" />}><CalendarIcon className="size-4" />{field.value ? new Date(`${field.value}T00:00:00`).toLocaleDateString() : "Pick a date"}</PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined} disabled={{ after: new Date() }} onSelect={(date) => field.onChange(formatDate(date))} /></PopoverContent></Popover></Field>} /><SelectField control={control} name="gender" label="Gender" options={staffGenderEnumSchema.options} placeholder="Select gender" /></div></section>
    <section className="border-t border-border/70 pt-5"><h3 className="mb-4 text-sm font-semibold">Address</h3><TextField label="Address" input={register("address")} /></section>
    <section className="border-t border-border/70 pt-5"><h3 className="mb-4 text-sm font-semibold">Role and pay</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><SelectField control={control} name="role" label="Role" options={roles} formatOption={(option) => roleLabel(option)} error={errors.role?.message} placeholder="Select role" /><SelectField control={control} name="payType" label="Pay Type" options={payTypeEnumSchema.options} error={errors.payType?.message} placeholder="Select pay type" /></div><TextField label="Pay Rate" type="number" error={errors.payRate?.message} input={register("payRate", { valueAsNumber: true })} prefix="NPR" /></section>
    {role === "instructor" && <section className="space-y-4 border-t border-border/70 pt-5"><h3 className="text-sm font-semibold">Instructor profile</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field data-invalid={Boolean(errors.instructorTypeId)}><FieldLabel>Instructor Type</FieldLabel>{instructorTypes.data?.data.length === 0 ? <Button type="button" variant="outline" onClick={() => router.push(`/gyms/${tenant}/settings/types/instructor-types`)}><Plus className="size-4" />Add an instructor type</Button> : <Controller control={control} name="instructorTypeId" render={({ field }) => <Select value={field.value ?? ""} onValueChange={(value) => { field.onChange(value); const picked = instructorTypes.data?.data.find((item) => item.id === value); if (picked && !isEdit) setValue("maxConcurrentBookings", picked.maxConcurrentBookings ?? 1) }}><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger><SelectContent>{instructorTypes.data?.data.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>} />}<FieldError>{errors.instructorTypeId?.message}</FieldError></Field><TextField label="Experience (years)" type="number" error={errors.experience?.message} input={register("experience", { valueAsNumber: true })} /></div><TextField label="Certifications" input={register("certifications")} /><Controller control={control} name="canBeBooked" render={({ field }) => <Field orientation="horizontal"><Switch id="staff-bookable" checked={field.value} onCheckedChange={field.onChange} /><div><FieldLabel htmlFor="staff-bookable">Can be booked</FieldLabel><FieldDescription>Members can book one-to-one sessions with this instructor.</FieldDescription></div></Field>} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><SelectField control={control} name="visibility" label="Visibility" options={staffVisibilityEnumSchema.options} /><TextField label="Max Concurrent Bookings" type="number" error={errors.maxConcurrentBookings?.message} input={register("maxConcurrentBookings", { valueAsNumber: true })} /></div></section>}
  </SheetBody><SheetFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? <Spinner /> : <IdCard className="size-4" />}{isEdit ? "Save changes" : "Add staff"}</Button></SheetFooter></form>
}

function TextField({ label, error, input, type = "text", prefix }: { label: string; error?: string; input: UseFormRegisterReturn; type?: string; prefix?: string }) { return <Field data-invalid={Boolean(error)}><FieldLabel>{label}</FieldLabel>{prefix ? <InputGroup><InputGroupAddon><InputGroupText>{prefix}</InputGroupText></InputGroupAddon><InputGroupInput type={type} {...input} /></InputGroup> : <Input type={type} {...input} />}<FieldError>{error}</FieldError></Field> }
function roleLabel(role: string) { return role === "admin" ? GYM_ROLE_LABELS.admin : role === "manager" ? GYM_ROLE_LABELS.manager : role === "instructor" ? GYM_ROLE_LABELS.instructor : GYM_ROLE_LABELS.frontdesk }
function SelectField({ control, name, label, options, formatOption, error, placeholder }: { control: Control<StaffFormInput>; name: StaffField; label: string; options: readonly string[]; formatOption?: (option: string) => string; error?: string; placeholder?: string }) { return <Controller control={control} name={name} render={({ field }) => <Field data-invalid={Boolean(error)}><FieldLabel>{label}</FieldLabel><Select value={typeof field.value === "string" ? field.value : ""} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{formatOption?.(option) ?? option}</SelectItem>)}</SelectContent></Select><FieldError>{error}</FieldError></Field>} /> }
