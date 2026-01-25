import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tenantId: string
    } & DefaultSession["user"]
  }

  interface User {
    tenantId: string
    passwordHash?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    tenantId: string
  }
}
