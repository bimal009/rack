import { initialAreaTypes } from "@/features/tenant/settings/types/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

export function instructorName(instructorId?: string) {
  const staff = initialStaff.find((s) => s.id === instructorId)
  return staff ? fullName(staff) : "Unassigned"
}

export function areaName(areaId?: string) {
  const area = initialAreaTypes.find((a) => a.id === areaId)
  return area?.name ?? "—"
}
