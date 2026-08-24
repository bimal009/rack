import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db/index";
import * as schema from "./db/schema"
import "dotenv/config"
const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    basePath: "/api/v1/auth",
    trustedOrigins: process.env.CORS_ORIGIN?.split(",") ?? [],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
            },
            onboarded: {
                type: "boolean",
                input: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    advanced: {
        defaultCookieAttributes: isDev
            ? undefined
            : {
                  sameSite: "none",
                  secure: true,
              },
    },
});
