import { routeProtection } from '@/middleware/route-protection';

export default routeProtection;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
};
