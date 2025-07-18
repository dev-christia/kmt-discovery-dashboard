"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { MapPin, TrendingUp, Users, Loader2 } from "lucide-react"

const DEMO_ACCOUNTS = [
  { name: "Kwame Asante", role: "Admin", email: "admin@kmtdiscovery.rw" },
  { name: "Amara Diallo", role: "Editor", email: "editor@kmtdiscovery.rw" },
  { name: "Jean-Baptiste", role: "Country Manager", email: "manager@kmtdiscovery.rw" },
  { name: "Fatima Al-Zahra", role: "Investor", email: "investor@kmtdiscovery.rw" },
  { name: "Michael Thompson", role: "Tourist", email: "tourist@kmtdiscovery.rw" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        let errorMessage = "Login failed. Please try again."

        if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password. Use 'password123' for demo accounts."
        }

        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        })
      } else if (result?.ok) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })

        // Wait a moment for the session to be set
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 100)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAccountClick = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password123")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="flex-1 bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden">
        {/* Africa silhouette background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <path
              d="M200 50C180 60 160 80 150 100C140 120 130 140 120 160C110 180 100 200 95 220C90 240 85 260 90 280C95 300 105 320 115 340C125 360 135 380 145 400C155 420 165 440 175 460C185 480 195 500 205 520C215 540 225 560 235 580C245 600 255 620 265 600C275 580 285 560 295 540C305 520 315 500 325 480C335 460 345 440 355 420C365 400 375 380 385 360C395 340 405 320 400 300C395 280 390 260 385 240C380 220 375 200 370 180C365 160 360 140 350 120C340 100 330 80 320 60C310 40 300 20 280 30C260 40 240 50 220 50C210 50 205 50 200 50Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative z-10 p-12 text-white h-full flex flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">KMT Discovery</h1>
            <p className="text-xl mb-12 opacity-90">Bridging Africa's Potential with Global Opportunities</p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Pan-African Reach</h3>
                  <p className="opacity-80">Covering 54 countries across 11 key sectors</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Investment Opportunities</h3>
                  <p className="opacity-80">Connect with verified opportunities</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Expert Network</h3>
                  <p className="opacity-80">Access local expertise and insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your KMT Discovery dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Demo password: password123</p>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm text-red-600 hover:text-red-700">
                Forgot your password?
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Accounts (password: password123)</h3>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoAccountClick(account.email)}
                  className="w-full text-left p-2 rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{account.name}</div>
                  <div className="text-xs text-gray-500">
                    {account.role} • {account.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
