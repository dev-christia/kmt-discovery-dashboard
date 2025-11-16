"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Mountain,
  Leaf,
  Users,
  Loader2,
  Eye,
  EyeOff,
  Landmark,
  GraduationCap,
  Building,
  Palette,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        let errorMessage =
          "Login failed. Please check your credentials and try again.";

        if (result.error === "CredentialsSignin") {
          errorMessage =
            "Invalid email or password. Please verify your credentials.";
        }

        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
      } else if (result?.ok) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // Wait a moment for the session to be set
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Brand Header */}
      <div className="lg:hidden bg-gradient-to-r from-red-600 to-red-700 text-white p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">KMT Discovery</h1>
        <p className="text-sm sm:text-base opacity-90">
          Discover Rwanda's rich heritage, vibrant culture, and tourism
          opportunities
        </p>
      </div>

      {/* Left Side - Brand Section (Desktop only) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 relative overflow-hidden">
        {/* Rwanda silhouette background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <path
              d="M180 80C170 90 160 100 155 115C150 130 145 145 140 160C135 175 130 190 125 205C120 220 118 235 120 250C122 265 126 280 130 295C134 310 138 325 142 340C146 355 150 370 155 385C160 400 165 415 172 430C179 445 186 460 194 475C202 490 210 505 220 518C230 531 240 544 252 555C264 566 276 575 288 582C300 589 312 594 324 597C336 600 348 601 360 600C372 599 384 596 396 591C408 586 420 579 430 570C440 561 448 550 454 538C460 526 464 513 466 500C468 487 468 474 466 461C464 448 460 435 454 423C448 411 440 400 430 390C420 380 408 372 396 365C384 358 372 352 360 347C348 342 336 338 324 335C312 332 300 330 288 329C276 328 264 328 252 329C240 330 228 332 216 335C204 338 192 342 180 347C168 352 156 358 146 366C136 374 128 384 122 395C116 406 112 418 110 430C108 442 108 454 110 466C112 478 116 490 122 501C128 512 136 522 146 530C156 538 168 544 180 548C192 552 204 554 216 555C228 556 240 556 252 555C264 554 276 552 288 548C300 544 312 538 324 530C336 522 348 512 358 500C368 488 376 474 382 459C388 444 392 428 394 412C396 396 396 380 394 364C392 348 388 332 382 317C376 302 368 288 358 276C348 264 336 254 324 246C312 238 300 232 288 228C276 224 264 222 252 222C240 222 228 224 216 228C204 232 192 238 180 246C168 254 156 264 146 276C136 288 128 302 122 317C116 332 112 348 110 364C108 380 108 396 110 412C112 428 116 444 122 459C128 474 136 488 146 500C156 512 168 522 180 530"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative z-10 p-12 text-white h-full flex flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              KMT Discovery
            </h1>
            <p className="text-lg lg:text-xl mb-12 opacity-90">
              Discover Rwanda's rich heritage, vibrant culture, and incredible
              tourism opportunities
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Landmark className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Cultural Heritage</h3>
                  <p className="opacity-80">
                    Explore Rwanda's rich history and traditions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mountain className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Tourism & Travel</h3>
                  <p className="opacity-80">
                    From Kigali's markets to Volcanoes National Park
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <GraduationCap className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Education & Growth</h3>
                  <p className="opacity-80">
                    Access resources and opportunities
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Leaf className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Environment</h3>
                  <p className="opacity-80">
                    Rwanda's commitment to sustainability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to access your KMT Discovery dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              disabled={isLoading}
            >
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
              <a
                href="https://www.kmtdiscovery.rw/forgot-password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
