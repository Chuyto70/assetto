import { NextResponse } from 'next/server';

export function middleware(req: Request) {

  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', req.url);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: '/:path*',
}