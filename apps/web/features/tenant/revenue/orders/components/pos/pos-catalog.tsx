"use client"

import { useMemo, useState } from "react"
import { Package as PackageIcon, Search, ShoppingBag } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Input } from "@repo/ui/components/ui/input"
import { cn } from "@repo/ui/lib/utils"

import { initialPackages } from "@/features/tenant/revenue/packages/lib/data"
import { initialProducts } from "@/features/tenant/revenue/products/lib/data"

export interface CatalogItem {
  type: "product" | "package"
  id: string
  name: string
  price: number
  subtitle: string
}

const catalogItems: CatalogItem[] = [
  ...initialProducts
    .filter((product) => product.active)
    .map((product) => ({
      type: "product" as const,
      id: product.id,
      name: product.name,
      price: product.price,
      subtitle: product.category,
    })),
  ...initialPackages
    .filter((pkg) => pkg.active)
    .map((pkg) => ({
      type: "package" as const,
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      subtitle: `${pkg.items.length} item${pkg.items.length === 1 ? "" : "s"}`,
    })),
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

const typeFilters = ["All", "Products", "Packages"] as const

interface PosCatalogProps {
  onAdd: (item: CatalogItem) => void
}

export function PosCatalog({ onAdd }: PosCatalogProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] =
    useState<(typeof typeFilters)[number]>("All")

  const visible = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesType =
        typeFilter === "All" ||
        (typeFilter === "Products" && item.type === "product") ||
        (typeFilter === "Packages" && item.type === "package")
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      return matchesType && matchesSearch
    })
  }, [search, typeFilter])

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or packages..."
            className="rounded-full pl-9 shadow-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          {typeFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTypeFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                typeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto pb-2 sm:grid-cols-3 xl:grid-cols-4">
        {visible.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            onClick={() => onAdd(item)}
            className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              {item.type === "product" ? (
                <ShoppingBag className="size-4" />
              ) : (
                <PackageIcon className="size-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.name}
              </p>
              <Badge variant="outline" className="mt-1 rounded-full font-normal">
                {item.subtitle}
              </Badge>
            </div>
            <span className="mt-auto text-sm font-semibold text-foreground">
              {currency.format(item.price)}
            </span>
          </button>
        ))}

        {visible.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No products or packages match your search.
          </p>
        )}
      </div>
    </div>
  )
}
