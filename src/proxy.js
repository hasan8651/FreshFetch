import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/api/users") && req.method === "DELETE" && token?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { 
  matcher: ["/api/orders/:path*", "/api/users/:path*"] 
};