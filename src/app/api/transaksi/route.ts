// import { NextRequest, NextResponse } from "next/server";
// import sql from "mssql";
// import { connectDB } from "@/lib/db";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { cart, total, bayar, kembalian } = body;

//     const pool = await connectDB();

//     // =========================
//     // GENERATE NO TRANSAKSI
//     // =========================

//     const tanggal = new Date();

//     const tahun = tanggal.getFullYear();

//     const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");

//     const hari = String(tanggal.getDate()).padStart(2, "0");

//     const prefix = `TRX${tahun}${bulan}${hari}`;

//     const last = await pool.request().query(`
//       SELECT TOP 1 NoTransaksi
//       FROM TrtransactionHdr
//       WHERE NoTransaksi LIKE '${prefix}%'
//       ORDER BY Id DESC
//     `);

//     let noTransaksi = `${prefix}0001`;

//     if (last.recordset.length > 0) {
//       const lastNo = last.recordset[0].NoTransaksi;

//       const urut = parseInt(lastNo.replace(prefix, ""));

//       noTransaksi = prefix + String(urut + 1).padStart(4, "0");
//     }

//     // =========================
//     // INSERT HEADER
//     // =========================

//     await pool
//       .request()
//       .input("NoTransaksi", sql.VarChar, noTransaksi)
//       .input("Tanggal", sql.DateTime, new Date())
//       .input("UserId", sql.VarChar, "ADMIN")
//       .input("TotalHarga", sql.Decimal(18, 0), total)
//       .input("Bayar", sql.Decimal(18, 0), bayar)
//       .input("Kembalian", sql.Decimal(18, 0), kembalian)
//       .input("JenisPembayaran", body.payment)
//       .input("Status", sql.VarChar, "SELESAI").query(`
//         INSERT INTO TrtransactionHdr
//         (
//           NoTransaksi,
//           Tanggal,
//           UserId,
//           TotalHarga,
//           Bayar,
//           Kembalian,
//                 JenisPembayaran,
//           Status,
//           WaktuDibuat,
//           DibuatOleh
//         )
//         VALUES
//         (
//           @NoTransaksi,
//           @Tanggal,
//           @UserId,
//           @TotalHarga,
//           @Bayar,
//           @Kembalian,
//           @JenisPembayaran,
//           @Status,
//           GETDATE(),
//           'ADMIN'
//         )
//       `);

//     // =========================
//     // INSERT DETAIL
//     // =========================

//     for (const item of cart) {
//       await pool
//         .request()
//         .input("NoTransaksi", sql.VarChar, noTransaksi)
//         .input("KodeBarang", sql.VarChar, item.KodeBarang)
//         .input("Qty", sql.Int, item.qty)
//         .input("Harga", sql.Decimal(18, 0), item.HargaJual)
//         .input("Subtotal", sql.Decimal(18, 0), item.qty * item.HargaJual)
//         .query(`
//           INSERT INTO TrtransactionDtl
//           (
//             NoTransaksi,
//             KodeBarang,
//             Qty,
//             Harga,
//             Subtotal,
//             WaktuDibuat,
//             DibuatOleh
//           )
//           VALUES
//           (
//             @NoTransaksi,
//             @KodeBarang,
//             @Qty,
//             @Harga,
//             @Subtotal,
//             GETDATE(),
//             'ADMIN'
//           )
//         `);
//     }

//     return NextResponse.json({
//       success: true,
//       noTransaksi,
//     });
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { cart, total, bayar, kembalian, payment } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart masih kosong",
        },
        { status: 400 }
      );
    }

    // =========================
    // GENERATE NO TRANSAKSI
    // =========================

    const tanggal = new Date();

    const tahun = tanggal.getFullYear();
    const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
    const hari = String(tanggal.getDate()).padStart(2, "0");

    const prefix = `TRX${tahun}${bulan}${hari}`;

    const last = await prisma.trTransactionHdr.findFirst({
      where: {
        NoTransaksi: {
          startsWith: prefix,
        },
      },
      orderBy: {
        ID: "desc",
      },
      select: {
        NoTransaksi: true,
      },
    });

    let noTransaksi = `${prefix}0001`;

    if (last) {
      const lastNo = last.NoTransaksi;

      const urut = parseInt(lastNo.replace(prefix, ""), 10);

      noTransaksi = prefix + String(urut + 1).padStart(4, "0");
    }

    // =========================
    // TRANSACTION DATABASE
    // =========================

    await prisma.$transaction(async (tx) => {
      // =========================
      // INSERT HEADER
      // =========================

      await tx.trTransactionHdr.create({
        data: {
          NoTransaksi: noTransaksi,
          Tanggal: tanggal,
          UserId: "ADMIN",

          TotalHarga: total,
          Bayar: bayar,
          Kembalian: kembalian,

          JenisPembayaran: payment,
          Status: "SELESAI",

          WaktuDibuat: tanggal,
          DibuatOleh: "ADMIN",
        },
      });

      // =========================
      // INSERT DETAIL
      // =========================

      for (const item of cart) {
        await tx.trTransactionDtl.create({
          data: {
            NoTransaksi: noTransaksi,
            KodeBarang: item.KodeBarang,

            Qty: item.qty,
            Harga: item.HargaJual,
            Subtotal: item.qty * item.HargaJual,

            WaktuDibuat: tanggal,
            DibuatOleh: "ADMIN",
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      noTransaksi,
    });
  } catch (error: any) {
    console.error("CREATE TRANSACTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menyimpan transaksi",
      },
      {
        status: 500,
      }
    );
  }
}
