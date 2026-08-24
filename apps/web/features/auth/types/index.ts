export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface BusinessType {
  id: string
  title: string
  description: string
}

export interface OnboardingData {
  businessTypeId: string | null
  specialties: string[]
  businessName: string
  address: string
  phone: string
  email: string
  website: string
}
