import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const plan = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),

  monthlyPrice: integer("monthly_price").notNull(),
  yearlyPrice: integer("yearly_price"), 
  discountPercent: integer("discount_percent").notNull().default(0),

  maxMembers: integer("max_members"),
  durationDays: integer("duration_days").notNull(),
  trialDays: integer("trial_days").notNull().default(0),
  smsEnabled: boolean("sms_enabled").notNull().default(false),
  emailEnabled: boolean("email_enabled").notNull().default(false),
  reportsEnabled: boolean("reports_enabled").notNull().default(false),
  inventoryEnabled: boolean("inventory_enabled").notNull().default(false),
  staffEnabled: boolean("staff_enabled").notNull().default(false),
  websiteEnabled: boolean("website_enabled").notNull().default(false),
  reEngagementEnabled: boolean("re_engagement_enabled").notNull().default(false),
  attendanceEnabled: boolean("attendance_enabled").notNull().default(false),
  doorLockEnabled: boolean("door_lock_enabled").notNull().default(false),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});