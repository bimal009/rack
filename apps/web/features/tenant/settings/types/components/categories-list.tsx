"use client"

import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/use-categories"
import { SimpleTypeList } from "./simple-type-list"

export function CategoriesList() {
  return (
    <SimpleTypeList
      label="Category"
      icon="LayoutGrid"
      useList={useCategoriesQuery}
      useCreate={useCreateCategory}
      useUpdate={useUpdateCategory}
      useDelete={useDeleteCategory}
    />
  )
}
