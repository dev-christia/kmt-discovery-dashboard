import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and API routes
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/")) {
          return true
        }

        // Require authentication for dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*"],
}
