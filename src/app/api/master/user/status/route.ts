// // src/app/api/master/user/status/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { Username, IsActive } = body;

//     const pool = await connectDB();

//     await pool.request().input("Username", Username).input("IsActive", IsActive)
//       .query(`
//         UPDATE UserID
//         SET
//           IsActive = @IsActive,
//           WaktuDiubah = GETDATE()
//         WHERE Username = @Username
//       `);

//     return NextResponse.json({
//       success: true,
//       message: "Status user berhasil diubah",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { Username, IsActive } = body;

    if (!Username || IsActive === undefined) {
      return NextResponse.json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    await prisma.userID.update({
      where: {
        Username,
      },
      data: {
        IsActive,
        WaktuDiubah: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status user berhasil diubah",
    });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
