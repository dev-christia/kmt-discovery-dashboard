"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  Plus,
  Eye,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Heart,
  MessageSquare,
} from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const { dashboardData, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
          Try Again
        </Button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  const { user, admin, recentActivity, systemHealth } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Header with Welcome Message and Quick Actions */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Welcome Back! 👋
            </h1>
            <p className="text-lg text-gray-700">
              Discover Africa's hidden gems and manage your tourism business
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-800"
              >
                <Globe className="w-3 h-3 mr-1" />
                Pan-African Platform
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 lg:mt-0">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
              <Button
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Tour
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant="outline"
                onClick={refetch}
                disabled={loading}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Your Articles
            </CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {user.articlesCount}
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Your Bookings
            </CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {user.bookingsCount}
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Subscription
            </CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
              {user.subscriptionStatus}
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-100 text-purple-800">
                {user.currentPlan}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700"
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              System Health
            </CardTitle>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900 capitalize">
                {systemHealth.database}
              </span>
            </div>
            <p className="text-sm text-gray-600">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-blue-600" />
              User Growth Trend
            </CardTitle>
            <CardDescription>
              Monthly user registration and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Interactive Chart
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {admin.users.total}
                    </div>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {admin.users.active}
                    </div>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {admin.users.new}
                    </div>
                    <p className="text-xs text-gray-600">New</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="font-medium">Engagement</span>
              </div>
              <span className="text-xl font-bold text-red-600">94%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-medium">Destinations</span>
              </div>
              <span className="text-xl font-bold text-green-600">54</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Reviews</span>
              </div>
              <span className="text-xl font-bold text-blue-600">1.2K</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Content Performance
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Article engagement and publishing metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Articles
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {admin.content.totalArticles}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {admin.content.publishedArticles}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Publish Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${admin.content.publishRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {admin.content.publishRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Revenue Analytics
              </div>
              <Button variant="ghost" size="sm" className="text-green-600">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Financial performance and subscription metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-4xl font-bold text-green-600">
                  ${admin.revenue.total}
                </p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +15.3% this month
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Subscription Status:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {admin.revenue.subscriptions.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <Badge
                        variant={
                          sub.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {sub.status}
                      </Badge>
                      <span className="text-sm font-medium">{sub._count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Analytics */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Booking Analytics & Categories
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-100 text-orange-800">
                {admin.bookings.total} Total
              </Badge>
              <Button variant="ghost" size="sm" className="text-orange-600">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Tourism booking trends and destination popularity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-orange-600">
                  {admin.bookings.total}
                </p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-3">
                Popular Categories:
              </h4>
              {admin.bookings.categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <Badge variant="outline" className="capitalize">
                      {category.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {category._count}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity with Better Design */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Platform Activity
            </div>
            <Button variant="ghost" size="sm" className="text-indigo-600">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
          <CardDescription>
            Latest activities and updates across the KMT Discovery platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "booking"
                        ? "bg-blue-100"
                        : activity.type === "article"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {activity.type === "booking" ? (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    ) : activity.type === "article" ? (
                      <FileText className="w-5 h-5 text-green-600" />
                    ) : (
                      <Activity className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        by {activity.user}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        variant={
                          activity.action === "created"
                            ? "default"
                            : "secondary"
                        }
                        className={`text-xs ${
                          activity.action === "created"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }`}
                      >
                        {activity.action}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Dashboard */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-emerald-600" />
            System Health & Performance
          </CardTitle>
          <CardDescription>
            Real-time monitoring of platform infrastructure and performance
            metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {systemHealth.metrics.users}
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
              <div className="mt-2 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+5.2%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {systemHealth.metrics.articles}
              </div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <div className="mt-2 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+2.8%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {systemHealth.metrics.bookings}
              </div>
              <p className="text-sm text-gray-600">Bookings</p>
              <div className="mt-2 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+12.1%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {systemHealth.metrics.errors}
              </div>
              <p className="text-sm text-gray-600">Error Rate</p>
              <div className="mt-2 flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">-8.5%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">
                  All Systems Operational
                </span>
              </div>
              <div className="text-sm text-emerald-600">
                Last updated:{" "}
                {new Date(dashboardData.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
