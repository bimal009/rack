"use client"

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import type {
	ExtendGymMembership,
	GymMembershipListQuery,
	NewGymMembership,
	UpdateGymMembership,
} from "@repo/types"

import {
	createMembership,
	extendMembership,
	getMembership,
	listMemberships,
	updateMembership,
} from "../api/gymMembership"

const membershipsKey = (tenant: string) => ["memberships", tenant]

export function useMembershipsQuery(
	tenant: string,
	query: Partial<GymMembershipListQuery> = {}
) {
	return useQuery({
		queryKey: [...membershipsKey(tenant), query],
		queryFn: () => listMemberships(tenant, query),
		enabled: Boolean(tenant),
		placeholderData: keepPreviousData,
	})
}

export function useMembershipQuery(tenant: string, memberId: string) {
	return useQuery({
		queryKey: [...membershipsKey(tenant), "member", memberId],
		queryFn: () => getMembership(tenant, memberId),
		enabled: Boolean(tenant && memberId),
	})
}

export function useCreateMembership(tenant: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (vars: { memberId: string; input: NewGymMembership }) =>
			createMembership(tenant, vars.memberId, vars.input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
	})
}

export function useUpdateMembership(tenant: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (vars: { memberId: string; id: string; input: UpdateGymMembership }) =>
			updateMembership(tenant, vars.memberId, vars.id, vars.input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
	})
}

export function useExtendMembership(tenant: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (vars: { memberId: string; id: string; input: ExtendGymMembership }) =>
			extendMembership(tenant, vars.memberId, vars.id, vars.input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
	})
}
