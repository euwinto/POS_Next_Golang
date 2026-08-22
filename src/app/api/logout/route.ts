// // import { cookies } from "next/headers";

// // export async function POST() {
// //   cookies().delete("session_user");

// //   return Response.json({
// //     success: true,
// //   });
// // }

// import { connectDB } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST() {
//   try {
//     const session: any = await getServerSession(authOptions);

//     if (!session) {
//       return Response.json({
//         success: false,
//         message: "Session tidak ditemukan",
//       });
//     }

//     const pool = await connectDB();

//     await pool
//       .request()
//       .input("Username", session.user.username)
//       .input("SessionToken", session.user.sessionToken).query(`
//         UPDATE HsUserID
//         SET LogoutTime = GETDATE()
//         WHERE Username = @Username
//         AND SessionToken = @SessionToken
//       `);

//     return Response.json({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);

//     return Response.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({
        success: false,
        message: "Session tidak ditemukan",
      });
    }

    const username = session.user.username;
    const sessionToken = session.user.sessionToken;

    if (!username || !sessionToken) {
      return Response.json({
        success: false,
        message: "Data session tidak lengkap",
      });
    }

    await prisma.hsUserID.updateMany({
      where: {
        Username: username,
        SessionToken: sessionToken,
        LogoutTime: null,
      },
      data: {
        LogoutTime: new Date(),
      },
    });

    return Response.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
