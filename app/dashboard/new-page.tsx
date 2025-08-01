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
  Activity,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  BookOpen,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to KMT Discovery - Pan-African Digital Tourism Platform
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={refetch}
            disabled={loading}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Articles</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.articlesCount}</div>
            <p className="text-xs text-gray-600">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.bookingsCount}</div>
            <p className="text-xs text-gray-600">Total bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <User className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.subscriptionStatus}</div>
            <p className="text-xs text-gray-600">{user.currentPlan}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Database className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium capitalize">
                {systemHealth.database}
              </span>
            </div>
            <p className="text-xs text-gray-600">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {admin.users.total}
                </div>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {admin.users.active}
                </div>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {admin.users.new}
                </div>
                <p className="text-xs text-gray-600">New Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Content Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {admin.content.totalArticles}
                </div>
                <p className="text-xs text-gray-600">Total Articles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {admin.content.publishedArticles}
                </div>
                <p className="text-xs text-gray-600">Published</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {admin.content.publishRate}%
                </div>
                <p className="text-xs text-gray-600">Publish Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Bookings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {admin.bookings.total}
                </div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Categories:</h4>
                {admin.bookings.categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {category.category}
                    </Badge>
                    <span className="text-sm font-medium">
                      {category._count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  ${admin.revenue.total}
                </div>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Subscriptions:</h4>
                {admin.revenue.subscriptions.map((sub, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {sub.status}
                    </Badge>
                    <span className="text-sm font-medium">{sub._count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest activities across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0">
                  {activity.type === "booking" ? (
                    <Calendar className="w-5 h-5 text-blue-600" />
                  ) : activity.type === "article" ? (
                    <FileText className="w-5 h-5 text-green-600" />
                  ) : (
                    <Activity className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          activity.action === "created"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {activity.action}
                      </Badge>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {systemHealth.metrics.users}
              </div>
              <p className="text-xs text-gray-600">Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {systemHealth.metrics.articles}
              </div>
              <p className="text-xs text-gray-600">Articles</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {systemHealth.metrics.bookings}
              </div>
              <p className="text-xs text-gray-600">Bookings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {systemHealth.metrics.errors}
              </div>
              <p className="text-xs text-gray-600">Errors</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Last updated:{" "}
              {new Date(dashboardData.lastUpdated).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
