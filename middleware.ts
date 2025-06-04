import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get('auth_user_role')?.value;

  const isAdmin = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isUser = pathname.startsWith('/user') && pathname !== '/login';

  if (isAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isUser && role !== 'user') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/user', '/user/:path*'],
};
