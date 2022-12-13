import NextAuth from "next-auth"
import { query as q } from 'faunadb'
import GithubProvider from "next-auth/providers/github"
import { fauna } from "../../../services/fauna"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(user, 'userr')
      const { email } = user
      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email } }
          )
        )
        
        return true
      } catch {
        return false
      }
      
    }
  }
}
export default NextAuth(authOptions)