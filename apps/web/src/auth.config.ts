import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('Authorized check:', nextUrl.pathname, 'User:', !!auth?.user);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnDeclarations = nextUrl.pathname.startsWith('/declarations');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

      if (isOnDashboard || isOnDeclarations) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/declarations', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
