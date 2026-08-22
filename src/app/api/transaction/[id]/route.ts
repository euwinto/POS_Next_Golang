// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const pool = await connectDB();

//     // HEADER
//     const headerResult = await pool.request().query(`
//       SELECT
//         NoTransaksi,
//         CONVERT(varchar, Tanggal, 120) as Tanggal,
//         TotalHarga,
//         Bayar,
//         Kembalian,
//         JenisPembayaran,
//         Status
//       FROM TrtransactionHdr
//       WHERE NoTransaksi = '${params.id}'
//     `);

//     // DETAIL
//     const detailResult = await pool.request().query(`
//       SELECT
//         d.KodeBarang,
//         p.NamaBarang,
//         d.Qty,
//         d.Harga,
//         d.Subtotal
//       FROM TrtransactionDtl d
//       LEFT JOIN MsProduk p
//         ON p.KodeBarang = d.KodeBarang
//       WHERE d.NoTransaksi = '${params.id}'
//     `);

//     return NextResponse.json({
//       header: headerResult.recordset[0],
//       detail: detailResult.recordset,
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    //
    // HEADER
    //
    const header = await prisma.trTransactionHdr.findUnique({
      where: {
        NoTransaksi: id,
      },
      select: {
        NoTransaksi: true,
        Tanggal: true,
        TotalHarga: true,
        Bayar: true,
        Kembalian: true,
        JenisPembayaran: true,
        Status: true,
      },
    });

    if (!header) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaksi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    //
    // DETAIL
    //
    const details = await prisma.trTransactionDtl.findMany({
      where: {
        NoTransaksi: id,
      },
      select: {
        KodeBarang: true,
        Qty: true,
        Harga: true,
        Subtotal: true,
      },
    });

    //
    // AMBIL KODE BARANG
    //
    const kodeBarang = [
      ...new Set(
        details
          .map((item) => item.KodeBarang)
          .filter((kode): kode is string => !!kode)
      ),
    ];

    //
    // AMBIL PRODUK
    //
    const products =
      kodeBarang.length > 0
        ? await prisma.msProduk.findMany({
            where: {
              KodeBarang: {
                in: kodeBarang,
              },
            },
            select: {
              KodeBarang: true,
              NamaBarang: true,
            },
          })
        : [];

    //
    // MAP PRODUK
    //
    const productMap = new Map(
      products.map((product) => [product.KodeBarang, product.NamaBarang])
    );

    //
    // GABUNG DETAIL + PRODUK
    //
    const detail = details.map((item) => ({
      KodeBarang: item.KodeBarang,
      NamaBarang: item.KodeBarang
        ? productMap.get(item.KodeBarang) ?? null
        : null,
      Qty: item.Qty,
      Harga: item.Harga,
      Subtotal: item.Subtotal,
    }));

    //
    // RESPONSE
    //
    return NextResponse.json({
      success: true,
      header: {
        NoTransaksi: header.NoTransaksi,
        Tanggal: header.Tanggal,
        TotalHarga: header.TotalHarga,
        Bayar: header.Bayar,
        Kembalian: header.Kembalian,
        JenisPembayaran: header.JenisPembayaran,
        Status: header.Status,
      },
      detail,
    });
  } catch (error) {
    console.error("TRANSACTION DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
