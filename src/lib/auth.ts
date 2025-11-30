import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { sendEmail, generateMagicLinkTemplate } from "./email";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email Link Provider using centralized email service
    EmailProvider({
      from: "Pet Realm <noreply@resend.com>", // Update with your verified domain
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          const result = await sendEmail({
            to: email,
            subject: "Sign in to Pet Realm",
            html: generateMagicLinkTemplate(url),
          });

          if (!result.success) {
            throw new Error(result.error || "Failed to send email");
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to send email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),

    // Email/Password Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.accountType,
          accountType: user.accountType,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as unknown as { accountType?: string }).accountType || user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.accountType = token.role;
      }
      return session;
    },
  },

  // Remove or comment out the pages section
  pages: {
    signIn: "/auth/signin",
    //   error: "/auth/error",
    //   verifyRequest: "/auth/verify-email",
  },

  debug: process.env.NODE_ENV === "development",
};
