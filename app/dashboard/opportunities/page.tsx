"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Building, DollarSign, Calendar, Eye, Heart } from "lucide-react"

const opportunities = [
  {
    id: 1,
    title: "Solar Energy Infrastructure Development",
    description: "Large-scale solar farm development project with government backing and international partnerships.",
    sector: "Renewable Energy",
    location: "Nairobi, Kenya",
    investment: "$50M - $100M",
    stage: "Series B",
    deadline: "2024-03-15",
    status: "Active",
    tags: ["Green Energy", "Infrastructure", "Government Backed"],
  },
  {
    id: 2,
    title: "Fintech Mobile Payment Platform",
    description: "Revolutionary mobile payment solution targeting unbanked populations across West Africa.",
    sector: "Financial Services",
    location: "Lagos, Nigeria",
    investment: "$25M - $50M",
    stage: "Series A",
    deadline: "2024-02-28",
    status: "Review",
    tags: ["Fintech", "Mobile", "Financial Inclusion"],
  },
  {
    id: 3,
    title: "Agricultural Technology Platform",
    description: "AI-powered agricultural platform connecting farmers with markets and providing crop optimization.",
    sector: "Agriculture",
    location: "Accra, Ghana",
    investment: "$15M - $30M",
    stage: "Seed",
    deadline: "2024-04-10",
    status: "Active",
    tags: ["AgTech", "AI", "Market Access"],
  },
  {
    id: 4,
    title: "Healthcare Telemedicine Network",
    description: "Comprehensive telemedicine platform serving rural communities with specialist consultations.",
    sector: "Healthcare",
    location: "Cape Town, South Africa",
    investment: "$20M - $40M",
    stage: "Series A",
    deadline: "2024-03-30",
    status: "Active",
    tags: ["HealthTech", "Telemedicine", "Rural Access"],
  },
]

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
          <p className="text-gray-600">Discover verified investment opportunities across Africa</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Submit Opportunity</Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search opportunities by title, sector, or location..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {opportunity.sector}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </span>
                  </div>
                </div>
                <Badge variant={opportunity.status === "Active" ? "default" : "secondary"}>{opportunity.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{opportunity.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center font-medium">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    {opportunity.investment}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </span>
                </div>
                <Badge variant="outline">{opportunity.stage}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Opportunities
        </Button>
      </div>
    </div>
  )
}
