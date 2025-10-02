"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  Mail,
  MessageSquare,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Invitations", href: "/dashboard/invitations", icon: Mail },
  { name: "Contacts", href: "/dashboard/contacts", icon: MessageSquare },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Categories", href: "/dashboard/categories", icon: Folder },
  // { name: "Content", href: "/dashboard/content", icon: FileText },
  // { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  // { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  // { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    toast({
      title: "Signing out...",
      description: "You are being signed out of your account.",
    });

    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Suspense fallback={<div>Loading...</div>}>
          <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/placeholder-logo.png"
                      alt="KMT Discovery"
                      className="h-8 w-8"
                    />
                    <h1 className="text-xl font-bold text-red-600">
                      KMT Discovery
                    </h1>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search opportunities..."
                      className="pl-10 w-64"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {
                          //@ts-ignore
                          session?.user?.role
                        }
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session?.user?.name?.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </Suspense>

        <div className="flex">
          {/* Sidebar */}
          <nav className="fixed left-0 top-0 w-64 bg-white shadow-sm h-screen overflow-y-auto pt-20 z-9">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6 pb-4 border-b">
                <img
                  src="/placeholder-logo.png"
                  alt="KMT Discovery"
                  className="h-12 w-12"
                />
              </div>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-red-50 text-red-600 border-r-2 border-red-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-6 pt-24 z-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
