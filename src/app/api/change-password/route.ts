// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import bcrypt from "bcryptjs";

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const body = await req.json();

//     const { oldPassword, newPassword } = body;

//     const pool = await connectDB();

//     const result = await pool.request().input("Username", session.user.username)
//       .query(`
//         SELECT *
//         FROM UserID
//         WHERE Username = @Username
//       `);

//     const user = result.recordset[0];

//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         message: "User tidak ditemukan",
//       });
//     }

//     const validPassword = await bcrypt.compare(oldPassword, user.Password);

//     if (!validPassword) {
//       return NextResponse.json({
//         success: false,
//         message: "Password lama salah",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await pool
//       .request()
//       .input("Username", session.user.username)
//       .input("Password", hashedPassword).query(`
//         UPDATE UserID
//         SET
//           Password = @Password,
//           MustChangePassword = 0
//         WHERE Username = @Username
//       `);

//     await pool.request().input("SessionToken", session.user.sessionToken)
//       .query(`
//     UPDATE HsUserID
//     SET
//       LogoutTime = GETDATE(),
//       StatusLogin = 'PASSWORD CHANGED'
//     WHERE SessionToken = @SessionToken
//   `);

//     return NextResponse.json({
//       success: true,
//       message: "Password berhasil diganti",
//       forceLogout: true,
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

    const body = await req.json();

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "Password lama dan password baru wajib diisi",
      });
    }

    const username = session.user.username;

    // Cari user
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

    // Cek password lama
    const validPassword = await bcrypt.compare(
      oldPassword,
      user.Password ?? ""
    );

    if (!validPassword) {
      return NextResponse.json({
        success: false,
        message: "Password lama salah",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.userID.update({
      where: {
        Username: username,
      },
      data: {
        Password: hashedPassword,
        MustChangePassword: false,
      },
    });

    // Update history/session login
    await prisma.hsUserID.updateMany({
      where: {
        SessionToken: session.user.sessionToken,
      },
      data: {
        LogoutTime: new Date(),
        StatusLogin: "PASSWORD CHANGED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diganti",
      forceLogout: true,
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
