"use client"

import {
  useBrandsQuery,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from "../hooks/use-brands"
import { SimpleTypeList } from "./simple-type-list"

export function BrandsList() {
  return (
    <SimpleTypeList
      label="Brand"
      icon="Tag"
      useList={useBrandsQuery}
      useCreate={useCreateBrand}
      useUpdate={useUpdateBrand}
      useDelete={useDeleteBrand}
    />
  )
}
