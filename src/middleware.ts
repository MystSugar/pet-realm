import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has required permissions
        const pathname = req.nextUrl.pathname;

        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // Protected routes just need to be logged in
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/orders") || pathname.startsWith("/shop")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/orders/:path*", "/admin/:path*", "/shop/:path*"],
};
