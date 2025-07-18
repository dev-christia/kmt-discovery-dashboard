"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <a href="/" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
