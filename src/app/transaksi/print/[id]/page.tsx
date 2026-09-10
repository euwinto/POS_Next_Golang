"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PrintStrukPage() {
  const params = useParams();
  const noTransaksi = params.id;

  const [data, setData] = useState<any>(null);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    try {
      // const res = await fetch(`/api/transaction/${noTransaksi}`);
      const res = await fetch(
        `http://localhost:8080/api/transaction/${noTransaksi}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Transaksi tidak ditemukan");
      }

      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-4">
      <div
        className="bg-white p-4 text-sm"
        style={{ width: "320px", fontFamily: "monospace" }}
      >
        {/* HEADER */}
        <div className="text-center border-b pb-2 mb-2">
          <div className="font-bold text-lg">MINI MARKET POS</div>
          <div>Jl. Contoh No.123</div>
          <div>Telp: 0812-0000-0000</div>
        </div>

        {/* INFO */}
        <div className="mb-2">
          <div>No : {data.header.NoTransaksi}</div>
          <div>Tgl : {data.header.Tanggal}</div>
          <div>Kasir : {data.header.Nama}</div>
          <div>Bayar : {data.header.JenisPembayaran}</div>
        </div>

        <div className="border-t border-b py-2 mb-2">
          {data.detail.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              <div>{item.NamaBarang}</div>

              <div className="flex justify-between">
                <span>
                  {item.Qty} x {formatRupiah(item.Harga)}
                </span>

                <span>{formatRupiah(item.Subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="space-y-1 border-b pb-2 mb-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>Rp {formatRupiah(data.header.TotalHarga)}</span>
          </div>

          <div className="flex justify-between">
            <span>BAYAR</span>
            <span>Rp {formatRupiah(data.header.Bayar)}</span>
          </div>

          <div className="flex justify-between">
            <span>KEMBALI</span>
            <span>Rp {formatRupiah(data.header.Kembalian)}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-4">
          <div>*** TERIMA KASIH ***</div>
          <div>Barang yang sudah dibeli</div>
          <div>tidak dapat ditukar/dikembalikan</div>
        </div>
      </div>
    </div>
  );
}
