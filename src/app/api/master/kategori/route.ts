// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     const pool = await connectDB();

//     const result = await pool.request().query(`
//       SELECT *
//       FROM MsKategori
//       ORDER BY Id DESC
//     `);

//     return NextResponse.json(result.recordset);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json([], { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const pool = await connectDB();

//     // Generate kode kategori otomatis
//     const last = await pool.request().query(`
//       SELECT TOP 1 KodeKategori
//       FROM MsKategori
//       ORDER BY Id DESC
//     `);

//     let kodeKategori = "KTG0001";

//     if (last.recordset.length > 0) {
//       const lastKode = last.recordset[0].KodeKategori;

//       const angka = parseInt(lastKode.replace("KTG", ""));

//       kodeKategori = `KTG${(angka + 1).toString().padStart(4, "0")}`;
//     }

//     await pool
//       .request()
//       .input("KodeKategori", kodeKategori)
//       .input("NamaKategori", body.namaKategori)
//       .input("Status", body.status ? 1 : 0).query(`
//         INSERT INTO MsKategori
//         (
//           KodeKategori,
//           NamaKategori,
//           Status,
//           WaktuDibuat
//         )
//         VALUES
//         (
//           @KodeKategori,
//           @NamaKategori,
//           @Status,
//           GETDATE()
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//       kodeKategori,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//
// GET
// LIST KATEGORI
//
export async function GET() {
  try {
    const categories = await prisma.msKategori.findMany({
      orderBy: {
        ID: "desc",
      },
    });

    const data = categories.map((category) => ({
      ...category,
      ID: Number(category.ID),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET KATEGORI ERROR:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}

//
// POST
// TAMBAH KATEGORI
//
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ambil kategori terakhir
    const lastCategory = await prisma.msKategori.findFirst({
      orderBy: {
        ID: "desc",
      },
      select: {
        KodeKategori: true,
      },
    });

    let kodeKategori = "KTG0001";

    if (lastCategory?.KodeKategori) {
      const angka = parseInt(lastCategory.KodeKategori.replace("KTG", ""), 10);

      if (!isNaN(angka)) {
        kodeKategori = `KTG${(angka + 1).toString().padStart(4, "0")}`;
      }
    }

    await prisma.msKategori.create({
      data: {
        KodeKategori: kodeKategori,
        NamaKategori: body.namaKategori,
        Status: body.status ? true : false,
        WaktuDibuat: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      kodeKategori,
    });
  } catch (error) {
    console.error("CREATE KATEGORI ERROR:", error);

    return NextResponse.json(
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
