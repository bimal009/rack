"use client"

import { useMemo, useState } from "react"
import { Download, QrCode } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"
import { fullName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import type { Member } from "@/features/tenant/members/lib/schema"

import { generateAttendanceId, initialAttendance } from "../lib/data"
import type { AttendanceRecord } from "../lib/schema"
import { createAttendanceColumns } from "./columns"
import { CheckInSheet } from "./check-in-sheet"

const filters = ["All", "Checked In", "Checked Out"] as const

function nowTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function today() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const date = new Date()
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

export function AttendanceList() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendance)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)

  const visible =
    filter === "All" ? records : records.filter((r) => r.status === filter)

  function checkOut(record: AttendanceRecord) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, checkOutAt: nowTime(), status: "Checked Out" }
          : r
      )
    )
    toast.success(`${record.memberName} checked out`)
  }

  function handleScan(member: Member, method: AttendanceRecord["method"] = "QR") {
    const openRecord = records.find(
      (r) => r.memberId === member.id && r.status === "Checked In"
    )

    if (openRecord) {
      checkOut(openRecord)
      return `${fullName(member)} checked out`
    }

    const record: AttendanceRecord = {
      id: generateAttendanceId(),
      memberId: member.id,
      memberName: fullName(member),
      memberEmail: member.email,
      date: today(),
      checkInAt: nowTime(),
      method,
      status: "Checked In",
    }
    setRecords((prev) => [record, ...prev])
    return `${fullName(member)} checked in`
  }

  function handleExport() {
    exportToCsv(
      "attendance.csv",
      visible.map((record) => ({
        Member: record.memberName,
        Email: record.memberEmail,
        Date: record.date,
        "Check In": record.checkInAt,
        "Check Out": record.checkOutAt ?? "",
        Method: record.method,
        Status: record.status,
      }))
    )
  }

  const columns = useMemo(
    () => createAttendanceColumns({ onCheckOut: checkOut }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <FilterPills options={filters} value={filter} onChange={setFilter} />
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
        searchPlaceholder="Search by member name or email..."
        toolbar={
          <Button onClick={() => setSheetOpen(true)}>
            <QrCode className="size-4" />
            Check In
          </Button>
        }
      />

      <CheckInSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        members={initialMembers}
        onScan={(member) => handleScan(member)}
      />
    </div>
  )
}
