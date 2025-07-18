"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MapPin, MessageCircle, UserPlus, Star, Globe } from "lucide-react"

const experts = [
  {
    id: 1,
    name: "Dr. Amina Hassan",
    title: "Senior Investment Advisor",
    company: "African Development Bank",
    location: "Abidjan, Côte d'Ivoire",
    expertise: ["Infrastructure", "Public-Private Partnerships", "Development Finance"],
    rating: 4.9,
    connections: 1250,
    verified: true,
    bio: "20+ years experience in infrastructure development and PPP structuring across Africa.",
  },
  {
    id: 2,
    name: "James Ochieng",
    title: "Fintech Entrepreneur",
    company: "PayAfrica Solutions",
    location: "Nairobi, Kenya",
    expertise: ["Fintech", "Mobile Payments", "Financial Inclusion"],
    rating: 4.8,
    connections: 890,
    verified: true,
    bio: "Founded 3 successful fintech companies, expert in mobile money and digital banking.",
  },
  {
    id: 3,
    name: "Sarah Mensah",
    title: "Agricultural Innovation Lead",
    company: "Ghana AgTech Hub",
    location: "Kumasi, Ghana",
    expertise: ["Agriculture", "Technology", "Supply Chain"],
    rating: 4.7,
    connections: 650,
    verified: false,
    bio: "Leading agricultural technology initiatives and farmer empowerment programs.",
  },
  {
    id: 4,
    name: "Mohamed Al-Rashid",
    title: "Energy Sector Specialist",
    company: "Renewable Energy Consortium",
    location: "Cairo, Egypt",
    expertise: ["Renewable Energy", "Project Management", "Policy"],
    rating: 4.9,
    connections: 1100,
    verified: true,
    bio: "Expert in renewable energy project development and energy policy across MENA region.",
  },
]

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expert Network</h1>
          <p className="text-gray-600">Connect with verified experts and industry leaders</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Join Network</Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search experts by name, expertise, or location..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">2,847</div>
            <div className="text-sm text-gray-600">Total Experts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">54</div>
            <div className="text-sm text-gray-600">Countries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">127</div>
            <div className="text-sm text-gray-600">Sectors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experts.map((expert) => (
          <Card key={expert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-red-100 text-red-600 text-lg font-semibold">
                    {expert.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    {expert.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{expert.title}</p>
                  <p className="text-sm text-gray-500">{expert.company}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {expert.location}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {expert.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">{expert.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {expert.expertise.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{expert.connections.toLocaleString()} connections</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Experts
        </Button>
      </div>
    </div>
  )
}
