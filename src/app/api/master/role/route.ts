// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     const pool = await connectDB();

//     const result = await pool.request().query(`
//       SELECT
//         ID,
//         RoleCode,
//         RoleName,
//         IsActive
//       FROM MsRole
//       ORDER BY RoleCode ASC
//     `);

//     return NextResponse.json({
//       success: true,
//       data: result.recordset,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
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

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const pool = await connectDB();

//     // CHECK DUPLICATE
//     const check = await pool.request().input("RoleCode", body.RoleCode).query(`
//         SELECT *
//         FROM MsRole
//         WHERE RoleCode = @RoleCode
//       `);

//     if (check.recordset.length > 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Role sudah ada",
//       });
//     }

//     // INSERT
//     await pool
//       .request()
//       .input("RoleCode", body.RoleCode)
//       .input("RoleName", body.RoleName)
//       .input("IsActive", body.IsActive ?? true).query(`
//         INSERT INTO MsRole
//         (
//           RoleCode,
//           RoleName,
//           IsActive
//         )
//         VALUES
//         (
//           @RoleCode,
//           @RoleName,
//           @IsActive
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//       message: "Role berhasil disimpan",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//
// GET
// LIST ROLE
//
export async function GET() {
  try {
    const roles = await prisma.msRole.findMany({
      select: {
        ID: true,
        RoleCode: true,
        RoleName: true,
        IsActive: true,
      },
      orderBy: {
        RoleCode: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: roles.map((role) => ({
        ...role,
        ID: role.ID.toString(),
      })),
    });
  } catch (error) {
    console.error("ROLE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

//
// POST
// TAMBAH ROLE
//
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { RoleCode, RoleName, IsActive } = body;

    if (!RoleCode || !RoleName) {
      return NextResponse.json(
        {
          success: false,
          message: "Role Code dan Role Name wajib diisi",
        },
        { status: 400 }
      );
    }

    // CHECK DUPLICATE
    const existingRole = await prisma.msRole.findUnique({
      where: {
        RoleCode,
      },
    });

    if (existingRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Role sudah ada",
        },
        { status: 400 }
      );
    }

    // INSERT
    const role = await prisma.msRole.create({
      data: {
        RoleCode,
        RoleName,
        IsActive: IsActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Role berhasil disimpan",
      data: {
        ID: role.ID.toString(),
        RoleCode: role.RoleCode,
        RoleName: role.RoleName,
        IsActive: role.IsActive,
      },
    });
  } catch (error) {
    console.error("ROLE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
