import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // credentials object matching login inputs
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // throw error if credentials fiels are null
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password must be provided");
        }

        // Find user by email using prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists
        if (!user) {
          throw new Error("No user found with the given email");
        }

        // validate password by bycrpt comparison
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return user object
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    /* FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }), */
  ],
  pages: {
    signIn: "/auth/signin",
  },
  // these are functions that are responsible for different parts of the authantication stages
  callbacks: {
    // responisble for sign in part
    async signIn({ account, profile }) {
      //if account provider is google or face
      if (
        account?.provider === "google" /*|| account?.provider === "facebook" */
      ) {
        // if name and email exist prisma fetches their data from postgre
        if (profile?.email && profile?.name) {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          // if it does not exist prisma creates user in data base
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                lastname: "",
                password: "",
              },
            });
          }
        }
      }
      // progress and sign in
      return true;
    },
    // session stage
    async session({ session, token }) {
      // if token is made we change the data object to match token
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      // return session
      return session;
    },
  },
});
// handler does post and get requests
export { handler as GET, handler as POST };
