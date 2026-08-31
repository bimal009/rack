import { z } from "zod"

export const areaVisibilities = ["Public", "Private", "Hidden"] as const
export type AreaVisibility = (typeof areaVisibilities)[number]

export const areaStatuses = ["Active", "Inactive"] as const
export type AreaStatus = (typeof areaStatuses)[number]

export const areaAttributeOptions = [
  "Air Conditioned",
  "Heated",
  "Ventilated",
  "Mirrored Walls",
  "Sound System",
  "Bluetooth Audio",
  "Projector",
  "TV Screen",
  "Whiteboard",
  "Natural Light",
  "Blackout Blinds",
  "Sprung Floor",
  "Rubber Flooring",
  "Turf Flooring",
  "Carpeted",
  "Ground Floor",
  "Wheelchair Accessible",
  "Step-Free Access",
  "Lift Access",
  "Lockers Nearby",
  "Changing Room Nearby",
  "Showers Nearby",
  "Toilets Nearby",
  "Water Station",
  "Drinking Fountain",
  "Storage Space",
  "Equipment Storage",
  "First Aid Kit",
  "Defibrillator",
  "CCTV",
  "Security Access",
  "Keycard Entry",
  "WiFi",
  "Power Outlets",
  "Charging Points",
  "Seating Area",
  "Spectator Area",
  "Reception Nearby",
  "Parking Nearby",
  "Bike Racks",
  "Wheelchair Parking",
  "Outdoor",
  "Covered Outdoor",
  "Shaded",
  "Floodlit",
  "Climate Controlled",
  "Soundproofed",
  "Private Entrance",
  "Pet Friendly",
  "Kids Friendly",
] as const

export const areaSchema = z.object({
  name: z.string().trim().min(1, "Enter an area name"),
  areaTypeId: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  images: z.array(z.string()).default([]),
  pricePerHour: z.number().nonnegative("Enter a valid price"),
  maxConcurrentBookings: z.number().int().positive("Must be at least 1"),
  visibility: z.enum(areaVisibilities),
  status: z.enum(areaStatuses),
  attributes: z.array(z.string()).default([]),
})

export type AreaInput = z.infer<typeof areaSchema>

export interface Area extends AreaInput {
  id: string
}
