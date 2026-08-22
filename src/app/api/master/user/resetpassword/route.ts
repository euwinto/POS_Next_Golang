// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // OWNER ONLY
//     if (session.user.role !== "OWNER") {
//       return NextResponse.json({
//         success: false,
//         message: "Akses ditolak",
//       });
//     }

//     const body = await req.json();

//     const { username } = body;

//     const defaultPassword = "POS1234";

//     const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//     const pool = await connectDB();

//     // UPDATE PASSWORD
//     await pool
//       .request()
//       .input("Username", username)
//       .input("Password", hashedPassword).query(`
//         UPDATE UserID
//         SET
//           Password = @Password,
//           MustChangePassword = 1
//         WHERE Username = @Username
//       `);

//     // HISTORY
//     await pool
//       .request()
//       .input("Username", username)
//       .input("Nama", session.user.nama)
//       .input("Role", session.user.role).query(`
//         INSERT INTO HsUserID
//         (
//           Username,
//           Nama,
//           Role,
//           LoginTime,
//           StatusLogin
//         )
//         VALUES
//         (
//           @Username,
//           @Nama,
//           @Role,
//           GETDATE(),
//           'RESET PASSWORD'
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // OWNER ONLY
    if (session.user.role !== "OWNER") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { username } = body;

    if (!username) {
      return NextResponse.json({
        success: false,
        message: "Username wajib diisi",
      });
    }

    // Cek user
    const user = await prisma.userID.findUnique({
      where: {
        Username: username,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const defaultPassword = "POS1234";

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // UPDATE PASSWORD
    await prisma.userID.update({
      where: {
        Username: username,
      },
      data: {
        Password: hashedPassword,
        MustChangePassword: true,
      },
    });

    // HISTORY
    await prisma.hsUserID.create({
      data: {
        Username: username,
        Nama: session.user.nama,
        Role: session.user.role,
        LoginTime: new Date(),
        StatusLogin: "RESET PASSWORD",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
