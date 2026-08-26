import type {
  AreaType,
  ClassType,
  InstructorTypeRecord,
  SimpleType,
} from "./schema"

export const initialAreaTypes: AreaType[] = [
  {
    id: "area_1",
    name: "Indoor Cycling",
    slug: "indoor-cycling",
    description: "Spin bikes room for cycling classes and open sessions.",
    sports: "Indoor Cycling",
    availableForBooking: true,
    pricePerHour: 0,
    maxPlayers: 20,
    maxConcurrentBookings: 1,
  },
  {
    id: "area_2",
    name: "Strength Training",
    slug: "strength-training",
    description: "Free weights and rack area.",
    sports: "Strength Training",
    availableForBooking: true,
    pricePerHour: 0,
    maxPlayers: 12,
    maxConcurrentBookings: 1,
  },
]

export const initialInstructorTypes: InstructorTypeRecord[] = [
  {
    id: "inst_1",
    name: "Personal Trainer",
    slug: "personal-trainer",
    description: "1:1 training sessions.",
    maxConcurrentBookings: 1,
  },
  {
    id: "inst_2",
    name: "Group Fitness Instructor",
    slug: "group-fitness-instructor",
    description: "Leads scheduled group classes.",
    maxConcurrentBookings: 20,
  },
  {
    id: "inst_3",
    name: "Boxing Coach",
    slug: "boxing-coach",
    description: "Boxing and combat sport coaching.",
    maxConcurrentBookings: 3,
  },
]

export const initialClassTypes: ClassType[] = [
  {
    id: "class_1",
    name: "Yoga Flow",
    slug: "yoga-flow",
    description: "All-levels vinyasa flow class.",
    sports: "Yoga",
    availableForBooking: true,
    pricePerClass: 500,
    maxParticipants: 20,
    maxConcurrentBookings: 1,
  },
  {
    id: "class_2",
    name: "CrossFit WOD",
    slug: "crossfit-wod",
    description: "Daily workout of the day.",
    sports: "CrossFit",
    availableForBooking: true,
    pricePerClass: 700,
    maxParticipants: 15,
    maxConcurrentBookings: 1,
  },
]

export const initialBrands: SimpleType[] = [
  { id: "brand_1", name: "Generic", slug: "generic" },
  { id: "brand_2", name: "Optimum Nutrition", slug: "optimum-nutrition" },
  { id: "brand_3", name: "MyProtein", slug: "myprotein" },
  { id: "brand_4", name: "Under Armour", slug: "under-armour" },
  { id: "brand_5", name: "Nike", slug: "nike" },
  { id: "brand_6", name: "Adidas", slug: "adidas" },
  { id: "brand_7", name: "Gymshark", slug: "gymshark" },
]

export const initialCategories: SimpleType[] = [
  { id: "cat_1", name: "Supplements", slug: "supplements" },
  { id: "cat_2", name: "Apparel", slug: "apparel" },
  { id: "cat_3", name: "Equipment", slug: "equipment" },
  { id: "cat_4", name: "Accessories", slug: "accessories" },
]

export const initialTaxRates: SimpleType[] = [
  { id: "tax_1", name: "No Tax", rate: 0 },
  { id: "tax_2", name: "Reduced", rate: 5 },
  { id: "tax_3", name: "Standard", rate: 10 },
  { id: "tax_4", name: "VAT", rate: 13 },
  { id: "tax_5", name: "Luxury", rate: 18 },
]

export function generateTypeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
