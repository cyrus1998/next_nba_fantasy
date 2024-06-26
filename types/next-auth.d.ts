import NextAuth from "next-auth"
import { currentUser } from "@/pages/api/auth/[...nextauth]"
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: currentUser
  }
}