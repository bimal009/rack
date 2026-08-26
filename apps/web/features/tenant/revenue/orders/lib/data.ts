import type { Order } from "./schema"

export const initialOrders: Order[] = [
  {
    id: "ORD-1042",
    memberName: "Savannah Nguyen",
    memberEmail: "savannah@234.com",
    items: [{ name: "Annual Elite", qty: 1, price: 72000 }],
    total: 72000,
    status: "Paid",
    date: "24 Aug 26",
  },
  {
    id: "ORD-1041",
    memberName: "Kathryn Murphy",
    memberEmail: "kathryn@114.com",
    items: [
      { name: "Gold Membership", qty: 1, price: 7900 },
      { name: "Shaker Bottle", qty: 2, price: 999 },
    ],
    total: 9898,
    status: "Pending",
    date: "23 Aug 26",
  },
  {
    id: "ORD-1040",
    memberName: "Courtney Henry",
    memberEmail: "henry@courtney.com",
    items: [{ name: "10 Session Pack", qty: 1, price: 15900 }],
    total: 15900,
    status: "Paid",
    date: "22 Aug 26",
  },
  {
    id: "ORD-1039",
    memberName: "Kristin Watson",
    memberEmail: "kristin@gmail.com",
    items: [{ name: "Whey Protein 1kg", qty: 1, price: 3499 }],
    total: 3499,
    status: "Refunded",
    date: "21 Aug 26",
  },
  {
    id: "ORD-1038",
    memberName: "Theresa Webb",
    memberEmail: "webb@gmail.com",
    items: [{ name: "Silver Membership", qty: 1, price: 4900 }],
    total: 4900,
    status: "Cancelled",
    date: "20 Aug 26",
  },
  {
    id: "ORD-1037",
    memberName: "Brooklyn Simmons",
    memberEmail: "brooklyn@moms.com",
    items: [
      { name: "Annual Elite", qty: 1, price: 72000 },
      { name: "Adjustable Dumbbell Set", qty: 1, price: 18900 },
    ],
    total: 90900,
    status: "Paid",
    date: "19 Aug 26",
  },
]

export function generateOrderId() {
  const next = 1043 + Math.floor(Math.random() * 900)
  return `ORD-${next}`
}

/**
 * Prepends a new order to the shared mock dataset so it shows up next time
 * the orders list mounts. There's no backend here, so this in-place mutation
 * is the simplest way for the POS flow to hand off to the orders list.
 */
export function addOrder(order: Order) {
  initialOrders.unshift(order)
}
