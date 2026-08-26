import { z } from "zod"

export const orderStatuses = ["Paid", "Pending", "Refunded", "Cancelled"] as const
export type OrderStatus = (typeof orderStatuses)[number]

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  memberName: string
  memberEmail: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  date: string
}

export const orderStatusUpdateSchema = z.object({
  status: z.enum(orderStatuses),
})
