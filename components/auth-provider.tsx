"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for authentication
const DEMO_USERS: User[] = [
  { id: "1", name: "Kwame Asante", email: "admin@kmtdiscovery.rw", role: "Admin" },
  { id: "2", name: "Amara Diallo", email: "editor@kmtdiscovery.rw", role: "Editor" },
  { id: "3", name: "Jean-Baptiste", email: "manager@kmtdiscovery.rw", role: "Country Manager" },
  { id: "4", name: "Fatima Al-Zahra", email: "investor@kmtdiscovery.rw", role: "Investor" },
  { id: "5", name: "Michael Thompson", email: "tourist@kmtdiscovery.rw", role: "Tourist" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("kmt-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo authentication - in real app, this would be an API call
    if (password !== "password123") {
      return { success: false, error: "Invalid password. Use 'password123' for demo." }
    }

    const foundUser = DEMO_USERS.find((u) => u.email === email)
    if (!foundUser) {
      return { success: false, error: "User not found. Please use one of the demo accounts." }
    }

    setUser(foundUser)
    localStorage.setItem("kmt-user", JSON.stringify(foundUser))
    router.push("/dashboard")
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kmt-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
