"use client"

import {
  useBrandsQuery,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from "../hooks/use-brands"
import { TypeList } from "./type-list"

export function BrandsList() {
  return (
    <TypeList
      label="Brand"
      icon="Tag"
      useList={useBrandsQuery}
      useCreate={useCreateBrand}
      useUpdate={useUpdateBrand}
      useDelete={useDeleteBrand}
    />
  )
}
