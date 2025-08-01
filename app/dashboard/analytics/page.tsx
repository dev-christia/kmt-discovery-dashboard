"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  AlertCircle,
  Clock,
  Activity,
  Eye,
  Target,
  PieChart,
  LineChart,
  Users,
  FileText,
  DollarSign,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Brain,
  Star,
  Filter,
  Download,
  Share,
} from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7d" | "30d" | "90d" | "1y"
  >("30d");
  const { analyticsData, loading, error, refetch } = useAnalytics({
    period: selectedPeriod,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-lg text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Analytics
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
          Try Again
        </Button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const periodLabels = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard 📊
            </h1>
            <p className="text-lg text-gray-700">
              Deep insights into platform performance and user behavior
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                <BarChart3 className="w-3 h-3 mr-1" />
                {periodLabels[selectedPeriod]}
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-800"
              >
                <Globe className="w-3 h-3 mr-1" />
                Real-time Data
              </Badge>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="mt-6 lg:mt-0 space-y-4 lg:space-y-0 lg:space-x-3 flex flex-col lg:flex-row">
            <Select
              value={selectedPeriod}
              onValueChange={(value: "7d" | "30d" | "90d" | "1y") =>
                setSelectedPeriod(value)
              }
            >
              <SelectTrigger className="w-full lg:w-[180px] border-indigo-200">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={refetch}
                disabled={loading}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Updating..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Page Views
            </CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">125.6K</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+18.2%</span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unique Visitors
            </CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">45.2K</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12.8%</span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">8.4%</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+2.1%</span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue
            </CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">$28.4K</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+24.7%</span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-indigo-600" />
                Traffic Analytics Trend
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {periodLabels[selectedPeriod]} traffic patterns and user
              engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg">
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Traffic Trend
                    </p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Conversions
                    </p>
                  </div>
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Demographics
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Interactive Analytics Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  {analyticsData.charts.charts}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      125.6K
                    </div>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      2.8M
                    </div>
                    <p className="text-xs text-gray-600">Page Views</p>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">4:32</div>
                    <p className="text-xs text-gray-600">Avg. Time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Real-time platform performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700">
                    Server Response
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">98ms</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700">
                    Database Query
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600">45ms</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700">
                    API Response
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600">156ms</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Performance Goals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                User Engagement
              </div>
              <Button variant="ghost" size="sm" className="text-green-600">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Platform interaction and engagement patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">87.3%</div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">4:28</div>
                  <p className="text-sm text-gray-600">Avg. Session</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: "32%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      32%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Page Views/Session
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">6.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Return Visitors</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      45%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Geographic Distribution
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              User distribution across African regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Interactive Map
                  </p>
                  <p className="text-xs text-gray-500">Pan-African Coverage</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm font-medium">Nigeria</span>
                  </div>
                  <span className="text-sm font-bold">28.4%</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm font-medium">South Africa</span>
                  </div>
                  <span className="text-sm font-bold">19.7%</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-purple-500 rounded-sm"></div>
                    <span className="text-sm font-medium">Kenya</span>
                  </div>
                  <span className="text-sm font-bold">15.2%</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-orange-500 rounded-sm"></div>
                    <span className="text-sm font-medium">Ghana</span>
                  </div>
                  <span className="text-sm font-bold">12.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-indigo-600" />
              AI-Powered Insights & Recommendations
            </div>
            <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
              <Zap className="w-3 h-3 mr-1" />
              Smart Analytics
            </Badge>
          </CardTitle>
          <CardDescription>
            Advanced AI analysis of your platform data with actionable
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-indigo-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2">
                      Key Insights
                    </h4>
                    <p className="text-indigo-800 text-sm leading-relaxed">
                      {analyticsData.insights.insights}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-900">
                      Growth Opportunities
                    </h4>
                  </div>
                  <p className="text-sm text-green-800">
                    Peak engagement during 2-4 PM. Consider scheduling content
                    during these hours.
                  </p>
                  <div className="mt-2 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">
                      High Impact
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-orange-600 mr-2" />
                    <h4 className="font-medium text-orange-900">
                      Optimization Tips
                    </h4>
                  </div>
                  <p className="text-sm text-orange-800">
                    Mobile users show 23% higher engagement. Optimize mobile
                    experience.
                  </p>
                  <div className="mt-2 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-700 font-medium">
                      Medium Impact
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">
                  Recommended Actions
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">
                        Increase Content Frequency
                      </p>
                      <p className="text-xs text-purple-600">
                        Publishing 2-3 articles per week could boost engagement
                        by 15%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Improve Mobile UX
                      </p>
                      <p className="text-xs text-blue-600">
                        Focus on mobile-first design for better conversion rates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Expand Social Media
                      </p>
                      <p className="text-xs text-green-600">
                        Social referrals show highest conversion potential
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Comparison & Data Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Period Analysis
            </CardTitle>
            <CardDescription>
              {periodLabels[selectedPeriod]} - {analyticsData.period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Start Date
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Date(
                      analyticsData.dateRange.start
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    {new Date(analyticsData.dateRange.end).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Period Summary
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {analyticsData.overview.summary}
                </p>
              </div>

              {Object.keys(analyticsData.overview.metrics).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(analyticsData.overview.metrics)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="p-2 bg-white border rounded">
                          <p className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {String(value)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Comparison Analysis
            </CardTitle>
            <CardDescription>
              Performance comparison with previous periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
                <Activity className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                <h3 className="font-medium text-purple-900 mb-1">
                  Trend Analysis
                </h3>
                <p className="text-purple-700 text-sm">
                  {analyticsData.comparison.comparison}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      User Growth
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    +18.2%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Engagement Rate
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    +12.8%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Bounce Rate
                    </span>
                  </div>
                  <span className="text-lg font-bold text-red-600">-8.4%</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 w-full justify-center py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Overall Performance: Excellent
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer with Last Updated */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Data refreshes every 5 minutes
          </div>
        </div>
      </div>
    </div>
  );
}
