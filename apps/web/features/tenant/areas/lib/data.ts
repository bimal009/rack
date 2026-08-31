import type { Area } from "./schema"

export const initialAreas: Area[] = [
  {
    id: "area_1",
    name: "Studio A",
    areaTypeId: "area_1",
    description: "Main cycling studio with 24 spin bikes.",
    images: [],
    pricePerHour: 1200,
    maxConcurrentBookings: 1,
    visibility: "Public",
    status: "Active",
    attributes: ["Air Conditioned", "Sound System"],
  },
  {
    id: "area_2",
    name: "Strength Floor",
    areaTypeId: "area_2",
    description: "Open plate-loaded and free-weight training area.",
    images: [],
    pricePerHour: 800,
    maxConcurrentBookings: 4,
    visibility: "Public",
    status: "Active",
    attributes: ["Mirrored Walls", "Ground Floor"],
  },
  {
    id: "area_3",
    name: "Recovery Room",
    areaTypeId: "",
    description: "Quiet space for stretching and mobility work.",
    images: [],
    pricePerHour: 0,
    maxConcurrentBookings: 2,
    visibility: "Private",
    status: "Inactive",
    attributes: ["Natural Light"],
  },
]

export function generateAreaId() {
  return `area_${Math.random().toString(36).slice(2, 10)}`
}
