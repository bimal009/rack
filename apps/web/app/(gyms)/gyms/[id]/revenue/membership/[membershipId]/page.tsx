export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ membershipId: string }>
}) {
  const { membershipId } = await params

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Membership details</h1>
      <p className="mt-2 text-sm text-muted-foreground">Membership ID: {membershipId}</p>
    </div>
  )
}
