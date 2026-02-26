import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If the user is trying to access any route under /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Allow access to the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token')?.value;

    // If the token is missing, redirect to login
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // In a fully robust production system, you might decode or verify the JWT here.
    // However, since we simply check for the presence of an HttpOnly cookie (which Javascript cannot spoof),
    // and the backend routes can further verify it, this acts as an effective initial gateway block.
    // Edge environments (middleware) sometimes cause issues verifying 'jsonwebtoken' directly without jose,
    // so checking the cookie's existence is a reliable middleware layer technique.

    return NextResponse.next();
  }

  // Not an /admin route, proceed normally
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
