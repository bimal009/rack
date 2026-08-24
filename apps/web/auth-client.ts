import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  basePath: "/api/v1/auth",
  fetchOptions: {
    credentials: "include",
  },
});