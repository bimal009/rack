"use client"

import { useMemo, useState } from "react"
import { CalendarIcon, Download, QrCode, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { DataTable } from "@repo/ui/components/ui/data-table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"

import { initialAttendance } from "../lib/data"
import { formatDate, nowTime } from "../lib/time"
import type { AttendanceRecord } from "../lib/schema"
import { createAttendanceColumns } from "./columns"
import { CheckInQrDialog } from "./check-in-qr-dialog"

const filters = ["All", "Checked In", "Checked Out"] as const

interface AttendanceListProps {
  tenant: string
}

export function AttendanceList({ tenant }: AttendanceListProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendance)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [qrOpen, setQrOpen] = useState(false)

  const visible = records.filter(
    (r) =>
      (filter === "All" || r.status === filter) &&
      (!dateFilter || r.date === formatDate(dateFilter))
  )

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPills options={filters} value={filter} onChange={setFilter} />

          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline">
                  <CalendarIcon className="size-4" />
                  {dateFilter ? formatDate(dateFilter) : "All dates"}
                </Button>
              }
            />
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>

          {dateFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDateFilter(undefined)}
            >
              <X className="size-4" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          )}
        </div>

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
          <Button onClick={() => setQrOpen(true)}>
            <QrCode className="size-4" />
            Check-in QR
          </Button>
        }
      />

      <CheckInQrDialog open={qrOpen} onOpenChange={setQrOpen} tenant={tenant} />
    </div>
  )
}
