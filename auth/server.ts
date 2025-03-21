import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { users, sessions, accounts, verifications } from "@/server/db/schema";
import { nextCookies } from "better-auth/next-js";
import { resend } from "@/server/email";
import { VerifyEmailTemplate } from "@/components/auth/verify-email-template";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const res = await resend.emails.send({
        from: process.env.BETTER_AUTH_EMAIL || "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        react: VerifyEmailTemplate({ user, url }),
      });
      console.log(res, user.email);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
