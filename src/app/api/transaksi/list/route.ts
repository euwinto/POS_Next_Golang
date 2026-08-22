// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     const pool = await connectDB();

//     const result = await pool.request().query(`
//       SELECT
//         NoTransaksi,
//         Tanggal,
//         JenisPembayaran,
//         TotalHarga,
//         Bayar,
//         Kembalian,
//         Status
//       FROM TrtransactionHdr
//       ORDER BY Id DESC
//     `);

//     return NextResponse.json(result.recordset);
//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transaksi = await prisma.trTransactionHdr.findMany({
      select: {
        NoTransaksi: true,
        Tanggal: true,
        JenisPembayaran: true,
        TotalHarga: true,
        Bayar: true,
        Kembalian: true,
        Status: true,
      },
      orderBy: {
        ID: "desc",
      },
    });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("TRANSAKSI LIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data transaksi",
      },
      {
        status: 500,
      }
    );
  }
}
