"use client";

import { useEffect, useState } from "react";
import PermissionGuard from "@/components/PermissionGuard";

export default function ProdukPage() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [form, setForm] = useState({
    // kodeBarang: "",
    namaBarang: "",
    kategoriBarang: "",
    hargaBeli: "",
    hargaJual: "",
  });

  const getProduk = async () => {
    const res = await fetch("http://localhost:8080/api/produk", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProduk(data);
  };

  // =========================
  // GET KATEGORI
  // =========================

  const getKategori = async () => {
    const res = await fetch("http://localhost:8080/api/kategori", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setKategori(data);
  };

  const formatRupiah = (value: string) => {
    const angka = value.replace(/\D/g, "");
    if (!angka) {
      return "";
    }
    return new Intl.NumberFormat("id-ID").format(Number(angka));
  };

  // useEffect(() => {
  //   getProduk();
  //   getKategori();
  // }, []);

  useEffect(() => {
    getProduk();
    getKategori();
  }, []);
  const token = localStorage.getItem("token");
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:8080/api/produk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        hargaBeli: Number(form.hargaBeli.replace(/\./g, "")),
        hargaJual: Number(form.hargaJual.replace(/\./g, "")),
      }),
    });

    setForm({
      //   kodeBarang: "",
      namaBarang: "",
      kategoriBarang: "",
      hargaBeli: "",
      hargaJual: "",
    });

    getProduk();
  };

  return (
    <PermissionGuard menuCode="PRODUK">
      <div>
        <h1 className="text-2xl font-bold mb-6">Master Produk</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* <input
            placeholder="Kode Barang"
            className="border p-2"
            value={form.kodeBarang}
            onChange={(e) => setForm({ ...form, kodeBarang: e.target.value })}
          /> */}

            <input
              placeholder="Nama Barang"
              className="border p-2"
              value={form.namaBarang}
              onChange={(e) => setForm({ ...form, namaBarang: e.target.value })}
            />

            {/* <input
            placeholder="Kategori"
            className="border p-2"
            value={form.kategoriBarang}
            onChange={(e) =>
              setForm({
                ...form,
                kategoriBarang: e.target.value,
              })
            }
            
          /> */}

            <select
              className="border p-2"
              value={form.kategoriBarang}
              onChange={(e) =>
                setForm({
                  ...form,
                  kategoriBarang: e.target.value,
                })
              }
            >
              <option value="">Pilih Kategori</option>

              {kategori.map((item: any) => (
                <option key={item.KodeKategori} value={item.KodeKategori}>
                  {item.NamaKategori}
                </option>
              ))}
            </select>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Harga Beli"
              className="border p-2"
              value={form.hargaBeli}
              onChange={(e) =>
                setForm({
                  ...form,
                  hargaBeli: formatRupiah(e.target.value),
                })
              }
            />

            <input
              type="text"
              inputMode="numeric"
              placeholder="Harga Jual"
              className="border p-2"
              value={form.hargaJual}
              onChange={(e) =>
                setForm({
                  ...form,
                  hargaJual: formatRupiah(e.target.value),
                })
              }
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Daftar Produk</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Kode</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Harga Jual</th>
              </tr>
            </thead>

            <tbody>
              {produk.length > 0 ? (
                produk.map((item: any) => (
                  <tr key={item.ID}>
                    <td className="border p-2">{item.KodeBarang}</td>
                    <td className="border p-2">{item.NamaBarang}</td>
                    <td className="border p-2">{item.KategoriBarang}</td>
                    <td className="border p-2">{item.HargaJual}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PermissionGuard>
  );
}
