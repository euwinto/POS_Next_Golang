// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     const role = session?.user?.role;

//     const pool = await connectDB();

//     const result = await pool.request().input("Role", role).query(`
//         SELECT
//           mm.*
//         FROM MsMenu mm
//         INNER JOIN RoleMenu rm
//           ON mm.MenuCode = rm.MenuCode
//         WHERE
//           rm.RoleName = @Role
//           AND mm.IsActive = 1
//           AND rm.CanView = 1
//         ORDER BY
//           ISNULL(mm.ParentID, mm.ID),
//           mm.ParentID,
//           mm.Sort ASC
//       `);

//     return NextResponse.json({
//       success: true,
//       data: result.recordset,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       data: [],
//     });
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          data: [],
        },
        { status: 401 }
      );
    }

    const role = session.user.role;

    const menus = await prisma.msMenu.findMany({
      where: {
        IsActive: true,

        RoleMenus: {
          some: {
            RoleName: role,
            CanView: true,
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

    return NextResponse.json({
      success: true,
      data: menus.map((menu) => ({
        ...menu,
        ID: Number(menu.ID),
      })),
    });
  } catch (error) {
    console.error("MENU ERROR:", error);

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
