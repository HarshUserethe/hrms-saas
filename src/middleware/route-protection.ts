import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from './route-paths';

function matchRoute(pathname: string, routes: readonly string[]) {
  return routes.some((route) => {
    const pattern =
      '^' + route.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/') + '(/.*)?$';

    const regex = new RegExp(pattern);

    return regex.test(pathname);
  });
}

export async function routeProtection(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = matchRoute(pathname, PUBLIC_ROUTES);
  const isProtectedRoute = matchRoute(pathname, PRIVATE_ROUTES);

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token') ||
    request.cookies.get('session_token') ||
    request.cookies.getAll().find((c) => c.name.endsWith('session_token'));

  const hasSession = !!sessionCookie?.value;

  // Protected Route
  if (isProtectedRoute && !hasSession) {
    const slug = pathname.split('/')[1];

    return NextResponse.redirect(new URL(`/${slug}/login`, request.url));
  }

  // Login Page while already authenticated
  if (isPublicRoute && hasSession && pathname.endsWith('/login')) {
    const slug = pathname.split('/')[1];

    return NextResponse.redirect(new URL(`/${slug}/dashboard`, request.url));
  }

  return NextResponse.next();
}
