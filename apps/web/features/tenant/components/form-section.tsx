"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { FieldGroup, FieldSet } from "@repo/ui/components/ui/field"
import {
  SheetDescription,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { cn } from "@repo/ui/lib/utils"

interface FormSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function FormSection({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: FormSectionProps) {
  return (
    <FieldSet className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      <FieldGroup className={cn("pl-11", description && "pt-0")}>
        {children}
      </FieldGroup>
    </FieldSet>
  )
}

interface FormSheetHeaderProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FormSheetHeader({
  icon: Icon,
  title,
  description,
}: FormSheetHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <SheetTitle className="truncate">{title}</SheetTitle>
        <SheetDescription className="truncate">{description}</SheetDescription>
      </div>
    </div>
  )
}
