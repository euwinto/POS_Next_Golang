// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const role = req.nextUrl.searchParams.get("role");

//     const pool = await connectDB();

//     const result = await pool.request().input("RoleName", role).query(`
//        SELECT *
// FROM (
//   SELECT
//     mm.ID,
//     mm.MenuCode,
//     mm.MenuName,
//     mm.ParentID,
//     mm.Sort,

//     ISNULL(rm.CanView, 0) AS CanView,
//     ISNULL(rm.CanAdd, 0) AS CanAdd,
//     ISNULL(rm.CanEdit, 0) AS CanEdit,
//     ISNULL(rm.CanDelete, 0) AS CanDelete

//   FROM MsMenu mm
//   LEFT JOIN RoleMenu rm
//     ON mm.MenuCode = rm.MenuCode
//     AND rm.RoleName = @RoleName
// ) x

// ORDER BY
//   CASE
//     WHEN x.ParentID IS NULL THEN x.ID
//     ELSE x.ParentID
//   END,
//   x.ParentID,
//   x.Sort
//       `);

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

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const { RoleName, permissions } = body;

//     const pool = await connectDB();

//     // DELETE OLD
//     await pool.request().input("RoleName", RoleName).query(`
//       DELETE FROM RoleMenu
//       WHERE RoleName = @RoleName
//     `);

//     // INSERT NEW
//     for (const item of permissions) {
//       await pool
//         .request()
//         .input("RoleName", RoleName)
//         .input("MenuCode", item.MenuCode)
//         .input("CanView", item.CanView)
//         .input("CanAdd", item.CanAdd)
//         .input("CanEdit", item.CanEdit)
//         .input("CanDelete", item.CanDelete).query(`
//           INSERT INTO RoleMenu
//           (
//             RoleName,
//             MenuCode,
//             CanView,
//             CanAdd,
//             CanEdit,
//             CanDelete
//           )
//           VALUES
//           (
//             @RoleName,
//             @MenuCode,
//             @CanView,
//             @CanAdd,
//             @CanEdit,
//             @CanDelete
//           )
//         `);
//     }

//     return NextResponse.json({
//       success: true,
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

//
// GET
// LIST MENU + PERMISSION BERDASARKAN ROLE
//
export async function GET(req: NextRequest) {
  try {
    const role = req.nextUrl.searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role wajib dipilih",
        },
        { status: 400 }
      );
    }

    const menus = await prisma.msMenu.findMany({
      where: {
        IsActive: true,
      },

      include: {
        RoleMenus: {
          where: {
            RoleName: role,
          },

          select: {
            CanView: true,
            CanAdd: true,
            CanEdit: true,
            CanDelete: true,
          },
        },
      },

      orderBy: [
        {
          ParentID: "asc",
        },
        {
          Sort: "asc",
        },
      ],
    });

    const data = menus.map((menu) => {
      const permission = menu.RoleMenus[0];

      return {
        ID: menu.ID.toString(),
        MenuCode: menu.MenuCode,
        MenuName: menu.MenuName,
        ParentID: menu.ParentID,
        Sort: menu.Sort,

        CanView: permission?.CanView ?? false,
        CanAdd: permission?.CanAdd ?? false,
        CanEdit: permission?.CanEdit ?? false,
        CanDelete: permission?.CanDelete ?? false,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ROLE MENU GET ERROR:", error);

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
// SAVE PERMISSION ROLE
//
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { RoleName, permissions } = body;

    if (!RoleName) {
      return NextResponse.json(
        {
          success: false,
          message: "Role wajib dipilih",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data permission tidak valid",
        },
        { status: 400 }
      );
    }

    //
    // TRANSACTION
    //
    await prisma.$transaction(async (tx) => {
      //
      // DELETE PERMISSION LAMA
      //
      await tx.roleMenu.deleteMany({
        where: {
          RoleName,
        },
      });

      //
      // INSERT PERMISSION BARU
      //
      for (const item of permissions) {
        //
        // Skip kalau MenuCode tidak ada
        //
        if (!item.MenuCode) {
          continue;
        }

        await tx.roleMenu.create({
          data: {
            RoleName,
            MenuCode: item.MenuCode,
            CanView: item.CanView ?? false,
            CanAdd: item.CanAdd ?? false,
            CanEdit: item.CanEdit ?? false,
            CanDelete: item.CanDelete ?? false,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Permission berhasil disimpan",
    });
  } catch (error) {
    console.error("ROLE MENU POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
