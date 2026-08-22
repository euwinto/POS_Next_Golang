// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     const pool = await connectDB();

//     const result = await pool.request().query(`
//       SELECT
//         KodeKategori,
//         NamaKategori
//       FROM MsKategori
//       WHERE Status = 1
//       ORDER BY NamaKategori
//     `);

//     return NextResponse.json(result.recordset);
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Gagal ambil kategori",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.msKategori.findMany({
      where: {
        Status: true,
      },
      select: {
        KodeKategori: true,
        NamaKategori: true,
      },
      orderBy: {
        NamaKategori: "asc",
      },
    });

    return NextResponse.json(
      result.map((item) => ({
        ...item,
      }))
    );
  } catch (err) {
    console.error("GET KATEGORI ERROR:", err);

    return NextResponse.json([]);
  }
}
