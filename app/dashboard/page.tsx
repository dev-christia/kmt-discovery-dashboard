"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, MapPin, DollarSign, ArrowUpRight, Globe, Building, Target } from "lucide-react"

const stats = [
  {
    title: "Active Opportunities",
    value: "1,247",
    change: "+12%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Network Connections",
    value: "3,892",
    change: "+8%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Countries Covered",
    value: "54",
    change: "100%",
    icon: MapPin,
    color: "text-purple-600",
  },
  {
    title: "Investment Volume",
    value: "$2.4B",
    change: "+23%",
    icon: DollarSign,
    color: "text-red-600",
  },
]

const recentOpportunities = [
  {
    title: "Solar Energy Project - Kenya",
    sector: "Renewable Energy",
    investment: "$50M",
    status: "Active",
    location: "Nairobi, Kenya",
  },
  {
    title: "Fintech Expansion - Nigeria",
    sector: "Financial Services",
    investment: "$25M",
    status: "Review",
    location: "Lagos, Nigeria",
  },
  {
    title: "Agricultural Tech - Ghana",
    sector: "Agriculture",
    investment: "$15M",
    status: "Active",
    location: "Accra, Ghana",
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {session?.user?.name}!</h1>
        <p className="opacity-90">Here's what's happening with your KMT Discovery dashboard today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Opportunities
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {opportunity.sector}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {opportunity.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{opportunity.investment}</p>
                    <Badge variant={opportunity.status === "Active" ? "default" : "secondary"} className="mt-1">
                      {opportunity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Target className="w-6 h-6" />
                <span>New Opportunity</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Users className="w-6 h-6" />
                <span>Find Experts</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Globe className="w-6 h-6" />
                <span>Market Research</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <TrendingUp className="w-6 h-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
