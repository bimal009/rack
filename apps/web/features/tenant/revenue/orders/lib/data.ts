import type { Order } from "./schema"

export const initialOrders: Order[] = [
  {
    id: "ORD-1042",
    memberName: "Savannah Nguyen",
    memberEmail: "savannah@234.com",
    items: [{ name: "Annual Elite", qty: 1, price: 720 }],
    total: 720,
    status: "Paid",
    date: "24 Aug 26",
  },
  {
    id: "ORD-1041",
    memberName: "Kathryn Murphy",
    memberEmail: "kathryn@114.com",
    items: [
      { name: "Gold Membership", qty: 1, price: 79 },
      { name: "Shaker Bottle", qty: 2, price: 9.99 },
    ],
    total: 98.98,
    status: "Pending",
    date: "23 Aug 26",
  },
  {
    id: "ORD-1040",
    memberName: "Courtney Henry",
    memberEmail: "henry@courtney.com",
    items: [{ name: "10 Session Pack", qty: 1, price: 159 }],
    total: 159,
    status: "Paid",
    date: "22 Aug 26",
  },
  {
    id: "ORD-1039",
    memberName: "Kristin Watson",
    memberEmail: "kristin@gmail.com",
    items: [{ name: "Whey Protein 1kg", qty: 1, price: 34.99 }],
    total: 34.99,
    status: "Refunded",
    date: "21 Aug 26",
  },
  {
    id: "ORD-1038",
    memberName: "Theresa Webb",
    memberEmail: "webb@gmail.com",
    items: [{ name: "Silver Membership", qty: 1, price: 49 }],
    total: 49,
    status: "Cancelled",
    date: "20 Aug 26",
  },
  {
    id: "ORD-1037",
    memberName: "Brooklyn Simmons",
    memberEmail: "brooklyn@moms.com",
    items: [
      { name: "Annual Elite", qty: 1, price: 720 },
      { name: "Adjustable Dumbbell Set", qty: 1, price: 189 },
    ],
    total: 909,
    status: "Paid",
    date: "19 Aug 26",
  },
]
