"use client"

import type { NewMembershipCategory, MembershipCategory } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreateMembershipCategory,
  useDeleteMembershipCategory,
  useMembershipCategoriesQuery,
  useUpdateMembershipCategory,
} from "../hooks/use-membership-categories"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<MembershipCategory>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function MembershipCategoriesList() {
  return (
    <TypeList<MembershipCategory, NewMembershipCategory>
      label="Membership category"
      buildColumns={buildColumns}
      useList={useMembershipCategoriesQuery}
      useCreate={useCreateMembershipCategory}
      useUpdate={useUpdateMembershipCategory}
      useDelete={useDeleteMembershipCategory}
      renderForm={(props) => (
        <TypeFormSheet
          label="Membership category"
          namePlaceholder="Individual, Couple, Family, Student"
          open={props.open}
          onOpenChange={props.onOpenChange}
          item={props.item}
          pending={props.pending}
          onSubmit={props.onSubmit}
        />
      )}
    />
  )
}
