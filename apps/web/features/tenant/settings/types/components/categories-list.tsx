"use client"

import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/use-categories"
import { TypeList } from "./type-list"

export function CategoriesList() {
  return (
    <TypeList
      label="Category"
      icon="LayoutGrid"
      useList={useCategoriesQuery}
      useCreate={useCreateCategory}
      useUpdate={useUpdateCategory}
      useDelete={useDeleteCategory}
    />
  )
}
