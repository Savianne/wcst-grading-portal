import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      accountType?: "ADMIN" | "TEACHER" | "STUDENT"
    };
  }

  interface User {
    accountType?: "ADMIN" | "TEACHER" | "STUDENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountType?: "ADMIN" | "TEACHER" | "STUDENT";
  }
}