"use client"

import { CalendarClock, Dumbbell, Plus, Ticket } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"

interface ScheduleCreatorMenuProps {
  onCreateBooking: () => void
  onCreateClass: () => void
  onCreateTimeOff: () => void
}

export function ScheduleCreatorMenu({
  onCreateBooking,
  onCreateClass,
  onCreateTimeOff,
}: ScheduleCreatorMenuProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size="icon" className="rounded-full">
            <Plus className="size-4" />
            <span className="sr-only">Create</span>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-48 p-1">
        <button
          type="button"
          onClick={onCreateBooking}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <Ticket className="size-4 text-muted-foreground" />
          Booking
        </button>
        <button
          type="button"
          onClick={onCreateClass}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <Dumbbell className="size-4 text-muted-foreground" />
          Class
        </button>
        <button
          type="button"
          onClick={onCreateTimeOff}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <CalendarClock className="size-4 text-muted-foreground" />
          Time off
        </button>
      </PopoverContent>
    </Popover>
  )
}
