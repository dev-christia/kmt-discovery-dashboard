"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  period: string
  dateRange: {
    start: string
    end: string
  }
  overview: {
    summary: string
    metrics: Record<string, any>
  }
  charts: {
    charts: string
  }
  insights: {
    insights: string
  }
  comparison: {
    comparison: string
  }
  lastUpdated: string
}

interface UseAnalyticsParams {
  period?: '7d' | '30d' | '90d' | '1y'
}

export function useAnalytics(params: UseAnalyticsParams = {}) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
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

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params.period) {
        queryParams.set('period', params.period)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/analytics?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.data?.analytics) {
        setAnalyticsData(data.data.analytics)
      } else {
        throw new Error('Invalid analytics data format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics data"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, toast, params.period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analyticsData,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
