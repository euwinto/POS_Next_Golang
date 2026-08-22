// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// // export async function GET() {
// //   try {
// //     const pool = await connectDB();

// //     const result = await pool.request().query(`
// //       SELECT *
// //       FROM MsProduk
// //       ORDER BY Id DESC
// //     `);

// //     return NextResponse.json(result.recordset);
// //   } catch (error) {
// //     console.error(error);

// //     return NextResponse.json([], { status: 500 });
// //   }
// // }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const aktif = searchParams.get("aktif");

//     const pool = await connectDB();

//     let query = `
//       SELECT Id, KodeBarang, NamaBarang, HargaJual, Status,KategoriBarang
//       FROM MsProduk
//     `;

//     // kalau dipanggil dari transaksi
//     if (aktif === "1") {
//       query += " WHERE Status = 1";
//     }

//     query += " ORDER BY NamaBarang";

//     const result = await pool.request().query(query);

//     return NextResponse.json(result.recordset);
//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const pool = await connectDB();

//     // Ambil kode terakhir
//     const last = await pool.request().query(`
//       SELECT TOP 1 KodeBarang
//       FROM MsProduk
//       ORDER BY Id DESC
//     `);

//     let kodeBarang = "BRG0001";

//     if (last.recordset.length > 0) {
//       const lastKode = last.recordset[0].KodeBarang;

//       const angka = parseInt(lastKode.replace("BRG", ""));

//       kodeBarang = `BRG${(angka + 1).toString().padStart(4, "0")}`;
//     }

//     // Insert produk
//     await pool
//       .request()
//       .input("KodeBarang", kodeBarang)
//       .input("NamaBarang", body.namaBarang)
//       .input("KategoriBarang", body.kategoriBarang)
//       .input("HargaBeli", body.hargaBeli)
//       .input("HargaJual", body.hargaJual).query(`
//         INSERT INTO MsProduk
//         (
//           KodeBarang,
//           NamaBarang,
//           KategoriBarang,
//           HargaBeli,
//           HargaJual,
//           Status,
//           WaktuDibuat
//         )
//         VALUES
//         (
//           @KodeBarang,
//           @NamaBarang,
//           @KategoriBarang,
//           @HargaBeli,
//           @HargaJual,
//           1,
//           GETDATE()
//         )
//       `);

//     return NextResponse.json({
//       success: true,
//       kodeBarang,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const aktif = searchParams.get("aktif");

    const products = await prisma.msProduk.findMany({
      where:
        aktif === "1"
          ? {
              Status: true,
            }
          : undefined,

      select: {
        ID: true,
        KodeBarang: true,
        NamaBarang: true,
        HargaJual: true,
        Status: true,
        KategoriBarang: true,
      },

      orderBy: {
        NamaBarang: "asc",
      },
    });

    const data = products.map((product) => ({
      ...product,
      ID: Number(product.ID),
      HargaJual: product.HargaJual ? Number(product.HargaJual) : 0,
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET PRODUK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ambil produk terakhir
    const lastProduct = await prisma.msProduk.findFirst({
      orderBy: {
        ID: "desc",
      },
      select: {
        KodeBarang: true,
      },
    });

    let kodeBarang = "BRG0001";

    if (lastProduct?.KodeBarang) {
      const angka = parseInt(lastProduct.KodeBarang.replace("BRG", ""), 10);

      if (!isNaN(angka)) {
        kodeBarang = `BRG${(angka + 1).toString().padStart(4, "0")}`;
      }
    }

    // Insert produk
    await prisma.msProduk.create({
      data: {
        KodeBarang: kodeBarang,
        NamaBarang: body.namaBarang,
        KategoriBarang: body.kategoriBarang,
        HargaBeli: body.hargaBeli ? Number(body.hargaBeli) : null,
        HargaJual: body.hargaJual ? Number(body.hargaJual) : null,
        Status: true,
        WaktuDibuat: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      kodeBarang,
    });
  } catch (error) {
    console.error("CREATE PRODUK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
