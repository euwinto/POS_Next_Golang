// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const pool = await connectDB();

//     // cek transaksi
//     const cek = await pool.request().input("NoTransaksi", params.id).query(`
//       SELECT *
//       FROM TrtransactionHdr
//       WHERE NoTransaksi = @NoTransaksi
//     `);

//     if (cek.recordset.length === 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Transaksi tidak ditemukan",
//       });
//     }

//     // sudah void?
//     if (cek.recordset[0].Status === "VOID") {
//       return NextResponse.json({
//         success: false,
//         message: "Transaksi sudah VOID",
//       });
//     }

//     // update status
//     await pool.request().input("NoTransaksi", params.id).query(`
//       UPDATE TrtransactionHdr
//       SET
//         Status = 'VOID',
//         WaktuDiubah = GETDATE()
//       WHERE NoTransaksi = @NoTransaksi
//     `);

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Cari transaksi
    const transaksi = await prisma.trTransactionHdr.findUnique({
      where: {
        NoTransaksi: params.id,
      },
      select: {
        NoTransaksi: true,
        Status: true,
      },
    });

    // Transaksi tidak ditemukan
    if (!transaksi) {
      return NextResponse.json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Sudah VOID
    if (transaksi.Status === "VOID") {
      return NextResponse.json({
        success: false,
        message: "Transaksi sudah VOID",
      });
    }

    // Update status
    await prisma.trTransactionHdr.update({
      where: {
        NoTransaksi: params.id,
      },
      data: {
        Status: "VOID",
        WaktuDiubah: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil di-VOID",
    });
  } catch (error) {
    console.error("VOID TRANSAKSI ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal melakukan VOID transaksi",
      },
      {
        status: 500,
      }
    );
  }
}
