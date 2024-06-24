import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import md5 from "md5";
import { signInSchema } from "./lib/zod";
import { signIn } from "./services/user_lead";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          // logic to salt and hash password
          const pwHash = md5(password);

          // logic to verify if user exists
          user = await signIn({ email, passowrd: pwHash });

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.");
          }

          // return user object with the their profile data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/authPage",
  },
});
