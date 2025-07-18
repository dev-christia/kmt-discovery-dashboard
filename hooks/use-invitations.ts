"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type Invitation,
  type InvitationResponse,
  type CreateInvitationRequest,
  UserRoleType,
} from "@/types/invitation"
import { useToast } from "@/hooks/use-toast"

interface UseInvitationsParams {
  page?: number
  limit?: number
  search?: string
  status?: "all" | "pending" | "accepted" | "expired"
  role?: UserRoleType | "all"
}

export function useInvitations(params: UseInvitationsParams = {}) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const { toast } = useToast()

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // For demo purposes, we'll simulate the API response
      // In production, replace this with actual API call
      const mockResponse: InvitationResponse = {
        invitations: [
          {
            id: "1",
            email: "john.doe@example.com",
            token: "token-123",
            role: UserRoleType.EXPERT,
            invitedBy: "admin-1",
            inviter: {
              id: "admin-1",
              firstName: "Admin",
              lastName: "User",
              email: "admin@kmtdiscovery.rw",
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            email: "jane.smith@example.com",
            token: "token-456",
            role: UserRoleType.RESEARCHER,
            invitedBy: "admin-1",
            inviter: {
              id: "admin-1",
              firstName: "Admin",
              lastName: "User",
              email: "admin@kmtdiscovery.rw",
            },
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            acceptedAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            email: "expired@example.com",
            token: "token-789",
            role: UserRoleType.GUIDE,
            invitedBy: "admin-1",
            inviter: {
              id: "admin-1",
              firstName: "Admin",
              lastName: "User",
              email: "admin@kmtdiscovery.rw",
            },
            expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        total: 3,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      }

      // Apply filters
      let filteredInvitations = mockResponse.invitations

      if (params.search) {
        filteredInvitations = filteredInvitations.filter(
          (inv) =>
            inv.email.toLowerCase().includes(params.search!.toLowerCase()) ||
            inv.role.toLowerCase().includes(params.search!.toLowerCase()),
        )
      }

      if (params.status && params.status !== "all") {
        filteredInvitations = filteredInvitations.filter((inv) => {
          const now = new Date()
          const expiresAt = new Date(inv.expiresAt)

          switch (params.status) {
            case "accepted":
              return !!inv.acceptedAt
            case "expired":
              return !inv.acceptedAt && expiresAt < now
            case "pending":
              return !inv.acceptedAt && expiresAt >= now
            default:
              return true
          }
        })
      }

      if (params.role && params.role !== "all") {
        filteredInvitations = filteredInvitations.filter((inv) => inv.role === params.role)
      }

      setInvitations(filteredInvitations)
      setPagination({
        total: filteredInvitations.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(filteredInvitations.length / (params.limit || 10)),
      })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch invitations"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [params, toast])

  const sendInvitation = async (data: CreateInvitationRequest) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newInvitation: Invitation = {
        id: Date.now().toString(),
        email: data.email,
        token: `token-${Date.now()}`,
        role: data.role,
        invitedBy: "admin-1",
        inviter: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "User",
          email: "admin@kmtdiscovery.rw",
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      }

      setInvitations((prev) => [newInvitation, ...prev])

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${data.email} successfully.`,
      })

      return newInvitation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send invitation"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    }
  }

  const revokeInvitation = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setInvitations((prev) => prev.filter((inv) => inv.id !== id))

      toast({
        title: "Invitation Revoked",
        description: "Invitation has been revoked successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to revoke invitation"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [fetchInvitations])

  return {
    invitations,
    loading,
    error,
    pagination,
    sendInvitation,
    revokeInvitation,
    refetch: fetchInvitations,
  }
}
