import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDB } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, req) {
        // const sessionToken = crypto.randomUUID();
        // const ip =
        //   req?.headers?.["x-forwarded-for"] ||
        //   req?.headers?.["x-real-ip"] ||
        //   "UNKNOWN";
        // if (!credentials) {
        //   throw new Error("Credentials kosong");
        // }

        // const pool = await connectDB();

        // const result = await pool
        //   .request()
        //   .input("username", credentials.username).query(`
        //     SELECT *
        //     FROM UserID
        //     WHERE Username = @username
        //   `);

        // const user = result.recordset[0];

        //     if (!user) {
        //       if (!user) {
        //         await pool
        //           .request()
        //           .input("Username", credentials.username)
        //           .input("StatusLogin", "LOGIN FAILED USER NOT FOUND")
        //           .input("LoginTime", new Date())
        //           .input("IPAddress", ip).query(`
        //   INSERT INTO HsUserID
        //   (
        //     Username,
        //     LoginTime,
        //     StatusLogin,
        //     IPAddress
        //   )
        //   VALUES
        //   (
        //     @Username,
        //     GETDATE(),
        //     @StatusLogin,
        //     @IPAddress
        //   )
        // `);

        //         throw new Error("User tidak ditemukan");
        //       }
        //       throw new Error("User tidak ditemukan");
        //     }

        // CEK USER AKTIF
        //     if (user.IsActive === false || user.IsActive === 0) {
        //       await pool
        //         .request()
        //         .input("Username", credentials.username)
        //         .input("Nama", user.Nama)
        //         .input("Role", user.Role)
        //         .input("StatusLogin", "LOGIN FAILED USER NON ACTIVE")
        //         .input("IPAddress", ip).query(`
        //   INSERT INTO HsUserID
        //   (
        //     Username,
        //     Nama,
        //     Role,
        //     LoginTime,
        //     StatusLogin,
        //     IPAddress
        //   )
        //   VALUES
        //   (
        //     @Username,
        //     @Nama,
        //     @Role,
        //     GETDATE(),
        //     @StatusLogin,
        //     @IPAddress
        //   )
        // `);

        //       throw new Error("User non aktif");
        //     }

        // console.log("INPUT :", credentials.password);
        // console.log("DB :", user.Password);
        // console.log("VALID :", validPassword);

        // if (!validPassword) {
        //   await pool
        //     .request()
        //     .input("Username", credentials.username)
        //     .input("StatusLogin", "LOGIN FAILED")
        //     .input("LoginTime", new Date())
        //     .input("IPAddress", ip).query(`
        //       INSERT INTO HsUserID
        //       (
        //         Username,
        //         LoginTime,
        //         StatusLogin,
        //         IPAddress
        //       )
        //       VALUES
        //       (
        //         @Username,
        //         GETDATE(),
        //         @StatusLogin,
        //         @IPAddress
        //       )
        //     `);
        //   throw new Error("Password salah");
        // }

        //       await pool
        //         .request()
        //         .input("Username", user.Username)
        //         .input("Nama", user.Nama)
        //         .input("Role", user.Role || "KASIR")
        //         .input("StatusLogin", "LOGIN SUCCESS")
        //         .input("LoginTime", new Date())
        //         .input("IPAddress", ip)
        //         .input("SessionToken", sessionToken).query(`
        //   INSERT INTO HsUserID
        //   (
        //     Username,
        //     Nama,
        //     Role,
        //     LoginTime,
        //     StatusLogin,
        //     IPAddress,
        //     SessionToken
        //   )
        //   VALUES
        //   (
        //     @Username,
        //     @Nama,
        //     @Role,
        //     GETDATE(),
        //     @StatusLogin,
        //     @IPAddress,
        //     @SessionToken
        //   )
        // `);
        // return {
        //   id: user.ID.toString(),
        //   name: user.Nama,
        //   email: user.Username,

        //   username: user.Username,
        //   nama: user.Nama,
        //   role: user.Role || "KASIR",

        //   mustChangePassword: user.MustChangePassword,
        //   sessionToken,
        // };

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi");
        }

        const username = credentials.username.trim();

        // =========================
        // SESSION TOKEN
        // =========================
        const sessionToken = crypto.randomUUID();

        // =========================
        // IP ADDRESS
        // =========================
        const forwardedFor = req?.headers?.["x-forwarded-for"];

        const ip =
          typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0].trim()
            : req?.headers?.["x-real-ip"] || "UNKNOWN";

        // =========================
        // CARI USER
        // =========================
        const user = await prisma.userID.findUnique({
          where: {
            Username: username,
          },
        });

        // =========================
        // USER TIDAK DITEMUKAN
        // =========================
        if (!user) {
          await prisma.hsUserID.create({
            data: {
              Username: username,
              LoginTime: new Date(),
              StatusLogin: "LOGIN FAILED USER NOT FOUND",
              IPAddress: ip,
            },
          });

          throw new Error("User tidak ditemukan");
        }

        // =========================
        // USER NON AKTIF
        // =========================
        if (user.IsActive !== true) {
          await prisma.hsUserID.create({
            data: {
              Username: user.Username,
              Nama: user.Nama,
              Role: user.Role,
              LoginTime: new Date(),
              StatusLogin: "LOGIN FAILED USER NON ACTIVE",
              IPAddress: ip,
            },
          });

          throw new Error("User non aktif");
        }

        // =========================
        // PASSWORD KOSONG
        // =========================
        if (!user.Password) {
          await prisma.hsUserID.create({
            data: {
              Username: user.Username,
              Nama: user.Nama,
              Role: user.Role,
              LoginTime: new Date(),
              StatusLogin: "LOGIN FAILED",
              IPAddress: ip,
            },
          });

          throw new Error("Password belum tersedia");
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.Password
        );

        console.log("USERNAME:", username);
        console.log("USER FOUND:", !!user);
        console.log("IS ACTIVE:", user.IsActive);
        console.log("PASSWORD EXIST:", !!user.Password);
        console.log("PASSWORD VALID:", validPassword);

        // =========================
        // PASSWORD SALAH
        // =========================
        if (!validPassword) {
          await prisma.hsUserID.create({
            data: {
              Username: user.Username,
              LoginTime: new Date(),
              StatusLogin: "LOGIN FAILED",
              IPAddress: ip,
            },
          });

          throw new Error("Password salah");
        }

        console.log("BEFORE HSUSER CREATE");

        // =========================
        // LOGIN BERHASIL
        // =========================
        await prisma.hsUserID.create({
          data: {
            Username: user.Username,
            Nama: user.Nama,
            Role: user.Role || "KASIR",
            LoginTime: new Date(),
            StatusLogin: "LOGIN SUCCESS",
            IPAddress: ip,
            SessionToken: sessionToken,
          },
        });
        console.log("AFTER HSUSER CREATE");
        // =========================
        // RETURN USER
        // =========================
        return {
          id: user.ID.toString(),
          name: user.Nama || user.Username,
          email: user.Username,

          username: user.Username,
          nama: user.Nama || user.Username,
          role: user.Role || "KASIR",

          mustChangePassword: user.MustChangePassword ?? false,
          sessionToken,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.nama = user.nama;
        token.role = user.role;
        token.sessionToken = user.sessionToken;
        token.mustChangePassword = user.mustChangePassword;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string;
        session.user.nama = token.nama as string;
        session.user.role = token.role as string;
        session.user.sessionToken = token.sessionToken as string;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
