// app/auth.config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // auth secret
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password must be provided");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with the given email");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          lastname: user.lastname,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.lastname = user.lastname;
      }
      if (account?.provider === "google" && profile?.sub) {
        token.id = profile.sub;
        token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.lastname = (token.lastname as string) || "";
        session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email && profile?.name) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: profile.sub!,
              email: profile.email,
              name: profile.name,
              lastname: "",
              password: "",
            },
          });
        } else if (existingUser.id !== profile.sub) {
          await prisma.user.update({
            where: { email: profile.email },
            data: { id: profile.sub! },
          });
        }
      }
      return true;
    },
  },
};
