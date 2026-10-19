import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, api routes, and maintenance page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/maintenance' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check store maintenance status from API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/admin/security/status`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.isLockdownMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    // If backend fails or unreachable, proceed normally
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
