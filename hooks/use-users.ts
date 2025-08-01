"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import {
  UserRoleType,
  UserStatus,
} from "@/types/invitation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: UserRoleType
  status: UserStatus
  country?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface UseUsersParams {
  page?: number
  limit?: number
  searchTerm?: string
  status?: UserStatus | "all"
  roles?: UserRoleType | "all"
  country?: string | "all"
}

export function useUsers(params: UseUsersParams = {}) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const { toast } = useToast()
  const { data: session } = useSession()

  // Filter and paginate users on frontend
  const filteredUsers = useMemo(() => {
    let filtered = allUsers

    // Apply search filter
    if (params.searchTerm) {
      const searchLower = params.searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(user => user.status === params.status)
    }

    // Apply roles filter
    if (params.roles && params.roles !== 'all') {
      filtered = filtered.filter(user => user.roles === params.roles)
    }

    // Apply country filter
    if (params.country && params.country !== 'all') {
      filtered = filtered.filter(user => user.country === params.country)
    }

    return filtered
  }, [allUsers, params.searchTerm, params.status, params.roles, params.country])

  // Paginate filtered results
  const users = useMemo(() => {
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    const paginatedData = filteredUsers.slice(startIndex, endIndex)
    
    // Update pagination state
    setPagination({
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    })
    
    return paginatedData
  }, [filteredUsers, params.page, params.limit])

  // Get auth token from NextAuth session
  const getAuthHeaders = useCallback(() => {
    const sessionWithToken = session as any
    return {
      'Content-Type': 'application/json',
      ...(sessionWithToken?.accessToken && { 'Authorization': `Bearer ${sessionWithToken.accessToken}` })
    }
  }, [session])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // No query parameters - we'll filter on frontend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }

      const data: any = await response.json()
      
      // Backend returns: { success: true, message: string, data: { users: User[] } }
      const allUsers = data.data?.users || []
      setAllUsers(allUsers)
      
      // Frontend pagination - we'll filter and paginate locally
      setPagination({
        total: allUsers.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(allUsers.length / (params.limit || 10)),
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, toast])

  const updateUser = useCallback(async (id: string, data: { roles?: UserRoleType; status?: UserStatus }) => {
    try {
      setUpdatingUser(id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        if (errorResponse.message) {
          throw new Error(`${errorResponse.message}`)
        }
        throw new Error(`Internal Server Error`)
      }

      const responseData = await response.json()
      
      // Backend returns: { success: true, message: string, data: { user: User } }
      const updatedUser = responseData.data?.user

      if (updatedUser) {
        setAllUsers((prev) => prev.map(user => user.id === id ? updatedUser : user))
      }

      toast({
        title: "User Updated",
        description: `User updated successfully.`,
      })

      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setUpdatingUser(null)
    }
  }, [getAuthHeaders, toast])

  const deleteUser = useCallback(async (id: string) => {
    try {
      setDeletingUser(id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`)
      }

      setAllUsers((prev) => prev.filter((user) => user.id !== id))

      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setDeletingUser(null)
    }
  }, [getAuthHeaders, toast])

  const getUserById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data?.user || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    }
  }, [getAuthHeaders, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    filteredUsers,
    allUsers,
    loading,
    updatingUser,
    deletingUser,
    error,
    pagination,
    updateUser,
    deleteUser,
    getUserById,
    refetch: fetchUsers,
  }
}
