import { z } from "zod"

export const productCategories = [
  "Supplements",
  "Apparel",
  "Equipment",
  "Accessories",
] as const
export type ProductCategory = (typeof productCategories)[number]

export const productBrands = [
  "Generic",
  "Optimum Nutrition",
  "MyProtein",
  "Under Armour",
  "Nike",
  "Adidas",
  "Gymshark",
] as const
export type ProductBrand = (typeof productBrands)[number]

export const productVisibilities = ["Public", "Private", "Hidden"] as const
export type ProductVisibility = (typeof productVisibilities)[number]

export const productRevenueAccounts = [
  "Retail Revenue",
  "General Revenue",
  "Supplement Sales",
  "Apparel Sales",
] as const

export const productTaxRates = ["0%", "5%", "10%", "13%", "18%"] as const

export const productFeatureOptions = [
  "Vegan",
  "Gluten-Free",
  "Best Seller",
  "New Arrival",
  "Limited Edition",
  "Eco-Friendly",
] as const

export const productSchema = z.object({
  // General
  name: z.string().trim().min(2, "Enter a product name"),
  category: z.enum(productCategories),
  brand: z.enum(productBrands).optional().or(z.literal("")),
  barcode: z.string().trim().optional().or(z.literal("")),
  sku: z.string().trim().optional().or(z.literal("")),
  visibility: z.enum(productVisibilities),
  active: z.boolean(),

  // Pricing
  price: z.coerce.number().positive("Enter a price greater than 0"),
  costPrice: z.coerce.number().nonnegative("Enter a valid cost").optional(),
  revenueAccount: z.string().optional().or(z.literal("")),
  taxRate: z.string().optional().or(z.literal("")),

  // Presentation
  description: z
    .string()
    .trim()
    .max(300, "Keep it under 300 characters")
    .optional()
    .or(z.literal("")),
  features: z.string().optional().or(z.literal("")),
})

export type ProductInput = z.infer<typeof productSchema>

export interface Product extends ProductInput {
  id: string
}
