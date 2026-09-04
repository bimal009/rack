"use client"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@repo/ui/components/ui/combobox"
import { Field, FieldDescription, FieldLabel } from "@repo/ui/components/ui/field"

interface ComboboxOption {
  value: string
  label: string
}

export interface MultiSelectComboboxProps {
  label: string
  description?: string
  placeholder: string
  emptyMessage: string
  options: { id: string; name: string }[]
  selected: string[]
  onChange: (ids: string[]) => void
}

/** Searchable multi-select with removable chips, built on the shared Combobox primitive. */
export function MultiSelectCombobox({
  label,
  description,
  placeholder,
  emptyMessage,
  options,
  selected,
  onChange,
}: MultiSelectComboboxProps) {
  const anchor = useComboboxAnchor()
  const items: ComboboxOption[] = options.map((option) => ({
    value: option.id,
    label: option.name,
  }))
  const selectedItems = items.filter((item) => selected.includes(item.value))

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        items={items}
        multiple
        value={selectedItems}
        onValueChange={(next) => onChange(next.map((item) => item.value))}
      >
        <ComboboxChips ref={anchor}>
          {selectedItems.map((item) => (
            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
          ))}
          <ComboboxChipsInput
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
