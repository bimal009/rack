"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewProduct, ProductListQuery, UpdateProduct } from "@repo/types"

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../api/product"

const productsKey = (tenant: string) => ["products", tenant]

export function useProductsQuery(
  tenant: string,
  query: Partial<ProductListQuery> = {}
) {
  return useQuery({
    queryKey: [...productsKey(tenant), query],
    queryFn: () => listProducts(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateProduct(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewProduct) => createProduct(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKey(tenant) }),
  })
}

export function useUpdateProduct(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateProduct }) =>
      updateProduct(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKey(tenant) }),
  })
}

export function useDeleteProduct(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKey(tenant) }),
  })
}
