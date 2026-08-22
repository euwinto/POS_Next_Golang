// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     const pool = await connectDB();

//     const result = await pool.query(`
//       SELECT
//         m1.*,
//         m2.MenuName AS ParentName
//       FROM MsMenu m1
//       LEFT JOIN MsMenu m2
//         ON m1.ParentID = m2.ID
//       ORDER BY
//         ISNULL(m1.ParentID, m1.ID),
//         m1.Sort ASC
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

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     const body = await req.json();

//     const { MenuCode, MenuName, Url, Icon, ParentID, Sort, IsActive } = body;

//     const pool = await connectDB();

//     // CHECK DUPLICATE
//     const check = await pool.request().input("MenuCode", MenuCode).query(`
//         SELECT *
//         FROM MsMenu
//         WHERE MenuCode = @MenuCode
//       `);

//     if (check.recordset.length > 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Menu code sudah digunakan",
//       });
//     }

//     // INSERT
//     await pool
//       .request()
//       .input("MenuCode", MenuCode)
//       .input("MenuName", MenuName)
//       .input("Url", Url)
//       .input("Icon", Icon)
//       .input("ParentID", ParentID || null)
//       .input("Sort", Sort)
//       .input("IsActive", IsActive)
//       .input("DibuatOleh", session.user.username).query(`
//         INSERT INTO MsMenu
//         (
//           MenuCode,
//           MenuName,
//           Url,
//           Icon,
//           ParentID,
//           Sort,
//           IsActive,
//           WaktuDibuat,
//           DibuatOleh
//         )
//         VALUES
//         (
//           @MenuCode,
//           @MenuName,
//           @Url,
//           @Icon,
//           @ParentID,
//           @Sort,
//           @IsActive,
//           GETDATE(),
//           @DibuatOleh
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//       message: "Menu berhasil disimpan",
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

    const menus = await prisma.msMenu.findMany({
      orderBy: [
        {
          ParentID: "asc",
        },
        {
          Sort: "asc",
        },
      ],
    });

    // Buat lookup berdasarkan ID
    const menuMap = new Map(
      menus.map((menu) => [Number(menu.ID), menu.MenuName])
    );

    // Tambahkan ParentName
    const data = menus.map((menu) => ({
      ...menu,
      ID: Number(menu.ID),
      ParentName: menu.ParentID ? menuMap.get(menu.ParentID) ?? null : null,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("MENU MASTER GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        data: [],
      },
      { status: 500 }
    );
  }
}

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

    const { MenuCode, MenuName, Url, Icon, ParentID, Sort, IsActive } = body;

    if (!MenuCode || !MenuName) {
      return NextResponse.json({
        success: false,
        message: "Menu Code dan Menu Name wajib diisi",
      });
    }

    // CHECK DUPLICATE
    const existing = await prisma.msMenu.findUnique({
      where: {
        MenuCode,
      },
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Menu code sudah digunakan",
      });
    }

    // INSERT
    await prisma.msMenu.create({
      data: {
        MenuCode,
        MenuName,
        Url: Url || null,
        Icon: Icon || null,
        ParentID: ParentID ? Number(ParentID) : null,
        Sort: Sort ? Number(Sort) : 0,
        IsActive: IsActive ?? true,
        WaktuDibuat: new Date(),
        DibuatOleh: session.user.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu berhasil disimpan",
    });
  } catch (error) {
    console.error("MENU MASTER POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
