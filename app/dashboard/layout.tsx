"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Opportunities", href: "/dashboard/opportunities", icon: TrendingUp },
  { name: "Network", href: "/dashboard/network", icon: Users },
  { name: "Invitations", href: "/dashboard/invitations", icon: Mail },
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
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-red-600">
                    KMT Discovery
                  </h1>
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
                        session?.user?.role}
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
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-6">
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
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
