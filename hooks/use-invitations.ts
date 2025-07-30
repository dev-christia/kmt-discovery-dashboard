"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
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
  const [allInvitations, setAllInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingInvitation, setSendingInvitation] = useState(false)
  const [revokingInvitation, setRevokingInvitation] = useState<string | null>(null)
  const [resendingInvitation, setResendingInvitation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const { toast } = useToast()
  const { data: session } = useSession()

  // Filter and paginate invitations on frontend
  const filteredInvitations = useMemo(() => {
    let filtered = allInvitations

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(inv => 
        inv.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(inv => {
        const now = new Date()
        const expiresAt = new Date(inv.expiresAt)
        
        if (params.status === 'pending') {
          return !inv.acceptedAt && expiresAt > now
        } else if (params.status === 'accepted') {
          return !!inv.acceptedAt
        } else if (params.status === 'expired') {
          return !inv.acceptedAt && expiresAt <= now
        }
        return true
      })
    }

    // Apply role filter
    if (params.role && params.role !== 'all') {
      filtered = filtered.filter(inv => inv.role === params.role)
    }

    return filtered
  }, [allInvitations, params.search, params.status, params.role])

  // Paginate filtered results
  const invitations = useMemo(() => {
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    const paginatedData = filteredInvitations.slice(startIndex, endIndex)
    
    // Update pagination state
    setPagination({
      total: filteredInvitations.length,
      page,
      limit,
      totalPages: Math.ceil(filteredInvitations.length / limit),
    })
    
    return paginatedData
  }, [filteredInvitations, params.page, params.limit])

  // Get auth token from NextAuth session
  const getAuthHeaders = useCallback(() => {
    const sessionWithToken = session as any
    return {
      'Content-Type': 'application/json',
      ...(sessionWithToken?.accessToken && { 'Authorization': `Bearer ${sessionWithToken.accessToken}` })
    }
  }, [session])

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // No query parameters - we'll filter on frontend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch invitations: ${response.statusText}`)
      }

      const data: any = await response.json()
      
      // Backend returns: { success: true, message: string, data: { invitations: Invitation[] } }
      const allInvitations = data.data?.invitations || []
      setAllInvitations(allInvitations)
      
      // Frontend pagination - we'll filter and paginate locally
      setPagination({
        total: allInvitations.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(allInvitations.length / (params.limit || 10)),
      })
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
  }, [getAuthHeaders, toast])

  const sendInvitation = useCallback(async (data: CreateInvitationRequest) => {
    try {
      setSendingInvitation(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations`, {
        method: 'POST',
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
      
      // Backend returns: { success: true, message: string, data: { invitation: Invitation } }
      const newInvitation = responseData.data?.invitation

      if (newInvitation) {
        setAllInvitations((prev) => [newInvitation, ...prev])
      }

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
    } finally {
      setSendingInvitation(false)
    }
  }, [getAuthHeaders, toast])

  const resendInvitation = useCallback(async (id: string) => {
    try {
      setResendingInvitation(id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/${id}/resend`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to resend invitation: ${response.statusText}`)
      }

      toast({
        title: "Invitation Resent",
        description: "Invitation has been resent successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend invitation"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setResendingInvitation(null)
    }
  }, [getAuthHeaders, toast])

  const revokeInvitation = useCallback(async (id: string) => {
    try {
      setRevokingInvitation(id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to revoke invitation: ${response.statusText}`)
      }

      setAllInvitations((prev) => prev.filter((inv) => inv.id !== id))

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
    } finally {
      setRevokingInvitation(null)
    }
  }, [getAuthHeaders, toast])

  const exportInvitations = useCallback((invitationsToExport: Invitation[], filename = 'invitations', format: 'csv' | 'json' | 'pdf' = 'csv') => {
    try {
      if (format === 'pdf') {
        // Export as PDF with logo
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const logoUrl = '/placeholder-logo.png' // Using existing logo
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>KMT Discovery - Invitations Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px; }
              .logo { max-height: 60px; margin-bottom: 10px; }
              .company-name { color: #dc2626; font-size: 24px; font-weight: bold; margin: 10px 0; }
              .report-title { font-size: 18px; color: #333; margin: 10px 0; }
              .summary { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center; }
              .summary-item { background: white; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; }
              .summary-number { font-size: 24px; font-weight: bold; color: #dc2626; }
              .summary-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #dc2626; color: white; }
              .status-pending { background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .status-accepted { background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .status-expired { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${logoUrl}" alt="KMT Discovery Logo" class="logo" />
              <div class="company-name">KMT Discovery</div>
              <div class="report-title">Invitations Report - ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="summary">
              <h3>Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-number">${invitationsToExport.length}</div>
                  <div class="summary-label">Total</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${invitationsToExport.filter(inv => {
                    const now = new Date()
                    const expiresAt = new Date(inv.expiresAt)
                    return !inv.acceptedAt && expiresAt > now
                  }).length}</div>
                  <div class="summary-label">Pending</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${invitationsToExport.filter(inv => !!inv.acceptedAt).length}</div>
                  <div class="summary-label">Accepted</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${invitationsToExport.filter(inv => {
                    const now = new Date()
                    const expiresAt = new Date(inv.expiresAt)
                    return !inv.acceptedAt && expiresAt <= now
                  }).length}</div>
                  <div class="summary-label">Expired</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Expires At</th>
                  <th>Accepted At</th>
                </tr>
              </thead>
              <tbody>
                ${invitationsToExport.map(invitation => {
                  const now = new Date()
                  const expiresAt = new Date(invitation.expiresAt)
                  let status = 'pending'
                  
                  if (invitation.acceptedAt) {
                    status = 'accepted'
                  } else if (expiresAt <= now) {
                    status = 'expired'
                  }

                  return `
                    <tr>
                      <td>${invitation.email}</td>
                      <td>${invitation.role}</td>
                      <td><span class="status-${status}">${status.toUpperCase()}</span></td>
                      <td>${new Date(invitation.createdAt).toLocaleDateString()}</td>
                      <td>${new Date(invitation.expiresAt).toLocaleDateString()}</td>
                      <td>${invitation.acceptedAt ? new Date(invitation.acceptedAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()} | KMT Discovery Platform</p>
              <p>Pan-African Digital Platform for Tourism & Cultural Heritage</p>
            </div>
          </body>
          </html>
        `

        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Wait for images to load, then print
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)

      } else if (format === 'json') {
        // Export as JSON
        const jsonData = invitationsToExport.map(invitation => {
          const now = new Date()
          const expiresAt = new Date(invitation.expiresAt)
          let status = 'pending'
          
          if (invitation.acceptedAt) {
            status = 'accepted'
          } else if (expiresAt <= now) {
            status = 'expired'
          }

          return {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            status,
            invitedBy: invitation.invitedBy || 'N/A',
            createdAt: invitation.createdAt,
            expiresAt: invitation.expiresAt,
            acceptedAt: invitation.acceptedAt || null,
            token: invitation.token
          }
        })

        const jsonContent = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
        const link = document.createElement('a')
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // Export as CSV (existing logic)
        const headers = ['Email', 'Role', 'Status', 'Invited By', 'Created At', 'Expires At', 'Accepted At']
        
        const csvData = invitationsToExport.map(invitation => {
          const now = new Date()
          const expiresAt = new Date(invitation.expiresAt)
          let status = 'pending'
          
          if (invitation.acceptedAt) {
            status = 'accepted'
          } else if (expiresAt <= now) {
            status = 'expired'
          }

          return [
            invitation.email,
            invitation.role,
            status,
            invitation.invitedBy || 'N/A',
            new Date(invitation.createdAt).toLocaleDateString(),
            new Date(invitation.expiresAt).toLocaleDateString(),
            invitation.acceptedAt ? new Date(invitation.acceptedAt).toLocaleDateString() : 'N/A'
          ]
        })

        // Create CSV content
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }

      toast({
        title: "Export Successful",
        description: `${invitationsToExport.length} invitations exported as ${format.toUpperCase()} successfully.`,
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export invitations. Please try again.",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchInvitations()
  }, [fetchInvitations])

  return {
    invitations,
    filteredInvitations,
    allInvitations,
    loading,
    sendingInvitation,
    revokingInvitation,
    resendingInvitation,
    error,
    pagination,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    exportInvitations,
    refetch: fetchInvitations,
  }
}
