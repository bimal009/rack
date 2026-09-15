import { z } from "zod";

export const orderStatuses = ["Paid", "Pending", "Refunded", "Cancelled"] as const;
export const orderStatusSchema = z.enum(orderStatuses);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().positive(),
  price: z.number().nonnegative(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string(),
  memberName: z.string(),
  memberEmail: z.string().email(),
  items: z.array(orderItemSchema),
  total: z.number().nonnegative(),
  status: orderStatusSchema,
  date: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

export const orderFormItemSchema = z.object({
  type: z.enum(["product", "package"]),
  refId: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});
export type OrderFormItem = z.infer<typeof orderFormItemSchema>;

export const orderFormSchema = z.object({
  memberId: z.string().min(1, "Select a member to continue."),
  items: z.array(orderFormItemSchema).refine(
    (items) => items.some((item) => item.refId),
    "Add at least one product or package."
  ),
  status: orderStatusSchema,
});
export type OrderFormInput = z.infer<typeof orderFormSchema>;

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
});
