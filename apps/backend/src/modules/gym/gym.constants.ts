export const DEFAULT_AREA_TYPES = [
  {
    name: "Weight Training Area",
    description: "Free weights, machines, and strength equipment.",
  },
  {
    name: "Cardio Area",
    description: "Treadmills, bikes, and other cardio equipment.",
  },
  {
    name: "Functional Training Area",
    description: "Open space for mobility and functional workouts.",
  },
  {
    name: "Group Fitness Studio",
    description: "Studio for instructor-led group classes.",
  },
  {
    name: "Zumba Studio",
    description: "Studio for Zumba and dance fitness classes.",
  },
  {
    name: "Locker & Changing Area",
    description: "Member lockers, changing rooms, and showers.",
    availableForBooking: false,
  },
] as const;

export const DEFAULT_INSTRUCTOR_TYPES = [
  "Personal Trainer",
  "Group Fitness Instructor",
  "Yoga Instructor",
  "Zumba Instructor",
  "Nutrition Coach",
] as const;

export const DEFAULT_CLASS_TYPES = [
  "Strength Training",
  "HIIT",
  "Yoga",
  "Pilates",
  "Zumba",
  "Indoor Cycling",
] as const;

export const DEFAULT_BRANDS = [
  "Myprotein",
  "Optimum Nutrition",
  "Quest Nutrition",
] as const;

export const DEFAULT_TAX_RATES = [{ name: "VAT (13%)", rate: 13 }] as const;

export const DEFAULT_PRODUCT_CATEGORIES = [
  "Protein & Supplements",
  "Drinks",
  "Snacks",
  "Gym Accessories",
  "Apparel",
] as const;

export const DEFAULT_MEMBERSHIP_CATEGORIES = [
  "Individual",
  "Couple",
  "Family",
] as const;

export const DEFAULT_PRODUCT_FEATURES = [
  "Vegan",
  "Gluten-Free",
  "Best Seller",
  "New Arrival",
  "Limited Edition",
  "Eco-Friendly",
] as const;
