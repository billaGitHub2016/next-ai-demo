import NextAuth from "next-auth"
import { userSignin } from '../../../../services/user_lead'

const handler = NextAuth({
    callbacks: {
        async signIn({ email, pass }) {
          return true
        },
    }
})

export { handler as GET, handler as POST }