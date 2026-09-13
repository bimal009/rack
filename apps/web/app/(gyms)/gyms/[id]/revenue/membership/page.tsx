import GymMembershipList from '@/features/tenant/revenue/gymMembership/components/gymMembership-list'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Membership",
}

const page = () => {
  return (
   <GymMembershipList/>
  )
}

export default page
