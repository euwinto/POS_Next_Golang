// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import bcrypt from "bcryptjs";

// //
// // GET
// // LIST USER
// //
// export async function GET() {
//   try {
//     const pool = await connectDB();

//     const result = await pool.request().query(`
//       SELECT
//         ID,
//         Username,
//         Nama,
//         Role,
//         IsActive,
//         WaktuDibuat,
//         DibuatOleh
//       FROM UserID
//       ORDER BY Username ASC
//     `);

//     return NextResponse.json({
//       success: true,
//       data: result.recordset,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// }

// //
// // POST
// // TAMBAH USER
// //
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { Username, Password, Nama, Role } = body;

//     if (!Username || !Nama || !Role) {
//       return NextResponse.json({
//         success: false,
//         message: "Data belum lengkap",
//       });
//     }

//     const pool = await connectDB();

//     // CHECK USER
//     const checkUser = await pool.request().input("Username", Username).query(`
//         SELECT Username
//         FROM UserID
//         WHERE Username = @Username
//       `);

//     if (checkUser.recordset.length > 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Username sudah digunakan",
//       });
//     }

//     const defaultPassword = "POS1234";

//     // HASH PASSWORD
//     const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//     // INSERT
//     await pool
//       .request()
//       .input("Username", Username)
//       .input("Password", hashedPassword)
//       .input("Nama", Nama)
//       .input("Role", Role)
//       .input("IsActive", true)
//       .input("MustChangePassword", true)
//       .input("DibuatOleh", "SYSTEM").query(`
//         INSERT INTO UserID
//         (
//           Username,
//           Password,
//           Nama,
//           Role,
//           IsActive,
//           MustChangePassword ,
//           WaktuDibuat,
//           DibuatOleh
//         )
//         VALUES
//         (
//           @Username,
//           @Password,
//           @Nama,
//           @Role,
//           @IsActive,
//           @MustChangePassword
//           GETDATE(),
//           @DibuatOleh
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//       message: "User berhasil ditambahkan",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// }

// //
// // PUT
// // AKTIF / NONAKTIF USER
// //
// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { ID, IsActive } = body;

//     const pool = await connectDB();

//     await pool.request().input("ID", ID).input("IsActive", IsActive).query(`
//         UPDATE UserID
//         SET
//           IsActive = @IsActive
//         WHERE ID = @ID
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
import bcrypt from "bcryptjs";

//
// GET
// LIST USER
//
export async function GET() {
  try {
    const users = await prisma.userID.findMany({
      select: {
        ID: true,
        Username: true,
        Nama: true,
        Role: true,
        IsActive: true,
        WaktuDibuat: true,
        DibuatOleh: true,
      },
      orderBy: {
        Username: "asc",
      },
    });

    // BigInt tidak bisa langsung dikirim JSON
    const data = users.map((user) => ({
      ...user,
      ID: Number(user.ID),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

//
// POST
// TAMBAH USER
//
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { Username, Nama, Role } = body;

    if (!Username || !Nama || !Role) {
      return NextResponse.json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    // CHECK USER
    const checkUser = await prisma.userID.findUnique({
      where: {
        Username,
      },
    });

    if (checkUser) {
      return NextResponse.json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    const defaultPassword = "POS1234";

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // INSERT USER
    await prisma.userID.create({
      data: {
        Username,
        Password: hashedPassword,
        Nama,
        Role,
        IsActive: true,
        MustChangePassword: true,
        WaktuDibuat: new Date(),
        DibuatOleh: "SYSTEM",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil ditambahkan",
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

//
// PUT
// AKTIF / NONAKTIF USER
//
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { ID, IsActive } = body;

    if (ID === undefined || IsActive === undefined) {
      return NextResponse.json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    await prisma.userID.update({
      where: {
        ID: BigInt(ID),
      },
      data: {
        IsActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status user berhasil diubah",
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
