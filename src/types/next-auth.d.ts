/* eslint-disable no-unused-vars */
// import NextAuth, { DefaultSession } from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      nama: string;
      role: string;
      sessionToken: string;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    nama: string;
    role: string;
    sessionToken: string;
    mustChangePassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    nama: string;
    role: string;
    sessionToken: string;
    mustChangePassword: boolean;
  }
}
