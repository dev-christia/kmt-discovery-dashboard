"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface UserGrowth {
  _count: number
  createdAt: string
}

interface BookingCategory {
  _count: number
  category: string
}

interface Subscription {
  _count: number
  status: string
}

interface RecentActivity {
  type: string
  action: string
  title: string
  user: string
  createdAt: string
}

interface DashboardData {
  user: {
    articlesCount: number
    bookingsCount: number
    subscriptionStatus: string
    currentPlan: string
  }
  admin: {
    users: {
      total: number
      new: number
      active: number
      growth: UserGrowth[]
    }
    content: {
      totalArticles: number
      publishedArticles: number
      publishRate: string
    }
    bookings: {
      total: number
      categories: BookingCategory[]
    }
    revenue: {
      total: number
      subscriptions: Subscription[]
    }
  }
  recentActivity: RecentActivity[]
  systemHealth: {
    database: string
    metrics: {
      users: number
      articles: number
      bookings: number
      errors: number
    }
  }
  lastUpdated: string
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { data: session } = useSession()

  // Get auth token from NextAuth session
  const getAuthHeaders = useCallback(() => {
    const sessionWithToken = session as any
    return {
      'Content-Type': 'application/json',
      ...(sessionWithToken?.accessToken && { 'Authorization': `Bearer ${sessionWithToken.accessToken}` })
    }
  }, [session])

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/homepage`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.data?.dashboard) {
        setDashboardData(data.data.dashboard)
      } else {
        throw new Error('Invalid dashboard data format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data"
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

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard,
  }
}
