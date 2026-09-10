"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
const token = localStorage.getItem("token");

export default function DaftarTransaksiPage() {
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  const getData = async () => {
    try {
      setLoading(true);

      // const res = await fetch("/api/transaksi/list");
      const res = await fetch("http://localhost:8080/api/transaction/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      setData(result.data || []);

      // setData(result);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal ambil data transaksi",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePrint = (noTransaksi: string) => {
    window.open(`/transaksi/print/${noTransaksi}`, "_blank");
  };

  const handleDetail = async (noTransaksi: string) => {
    try {
      // const res = await fetch(`/api/transaction/${noTransaksi}`);
      const res = await fetch(
        `http://localhost:8080/api/transaction/${noTransaksi}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      setDetailData(result);
      setOpenDetail(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoid = async (noTransaksi: string) => {
    const confirm = await Swal.fire({
      title: "Void Transaksi?",
      text: `Transaksi ${noTransaksi} akan dibatalkan`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Void",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/transaction/${noTransaksi}/void`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Transaksi berhasil di void",
        });

        getData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: err.message,
      });
    }
  };

  return (
    <PermissionGuard menuCode="LISTTRANSAKSI">
      <div className="p-4">
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Daftar Transaksi</h1>

            <button
              onClick={getData}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">No Transaksi</th>
                  <th className="border p-2">Tanggal</th>
                  <th className="border p-2">Payment</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Bayar</th>
                  <th className="border p-2">Kembalian</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2 font-semibold">
                        {item.NoTransaksi}
                      </td>

                      <td className="border p-2">
                        {new Date(item.Tanggal).toLocaleString("id-ID")}
                      </td>

                      <td className="border p-2 uppercase">
                        {item.JenisPembayaran}
                      </td>

                      <td className="border p-2">
                        Rp {formatRupiah(item.TotalHarga)}
                      </td>

                      <td className="border p-2">
                        Rp {formatRupiah(item.Bayar)}
                      </td>

                      <td className="border p-2">
                        Rp {formatRupiah(item.Kembalian)}
                      </td>

                      <td className="border p-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            item.Status === "SELESAI"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.Status}
                        </span>
                      </td>

                      <td className="border p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrint(item.NoTransaksi)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => handleDetail(item.NoTransaksi)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Detail
                          </button>

                          <button
                            onClick={() => handleVoid(item.NoTransaksi)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Void
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openDetail && detailData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] rounded shadow-lg p-4 max-h-[90vh] overflow-auto">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Detail Transaksi</h2>

                <button
                  onClick={() => setOpenDetail(false)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  X
                </button>
              </div>

              {/* INFO */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <b>No Transaksi:</b> {detailData.header.NoTransaksi}
                </div>

                <div>
                  <b>Tanggal:</b>{" "}
                  {new Date(detailData.header.Tanggal).toLocaleString("id-ID")}
                </div>

                <div>
                  <b>Pembayaran:</b> {detailData.header.JenisPembayaran}
                </div>

                <div>
                  <b>Status:</b> {detailData.header.Status}
                </div>
              </div>

              {/* TABLE */}
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Kode</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Harga</th>
                    <th className="border p-2">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {detailData.detail.map((d: any, i: number) => (
                    <tr key={i}>
                      <td className="border p-2">{d.KodeBarang}</td>

                      <td className="border p-2">{d.NamaBarang}</td>

                      <td className="border p-2">{d.Qty}</td>

                      <td className="border p-2">Rp {formatRupiah(d.Harga)}</td>

                      <td className="border p-2">
                        Rp {formatRupiah(d.Subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL */}
              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>Rp {formatRupiah(detailData.header.TotalHarga)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Bayar</span>
                    <span>Rp {formatRupiah(detailData.header.Bayar)}</span>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Kembalian</span>
                    <span>Rp {formatRupiah(detailData.header.Kembalian)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
