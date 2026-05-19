import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(fr|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
