"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function KategoriPage() {
  const [kategori, setKategori] = useState([]);

  const getKategori = async () => {
    const res = await fetch("/api/master/kategori");
    const data = await res.json();
    setKategori(data);
  };

  useEffect(() => {
    getKategori();
  }, []);

  const [form, setForm] = useState({
    namaKategori: "",
    status: true,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/master/kategori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal simpan kategori");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil disimpan",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        namaKategori: "",
        status: true,
      });

      getKategori();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Terjadi kesalahan",
      });
    }

    getKategori();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Master Kategori</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nama Kategori"
            className="border p-2"
            value={form.namaKategori}
            onChange={(e) => setForm({ ...form, namaKategori: e.target.value })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.checked,
                })
              }
            />
            Aktif
          </label>
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
              <th className="border p-2">Nama Kategori</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {kategori.length > 0 ? (
              kategori.map((item: any) => (
                <tr key={item.Id}>
                  <td className="border p-2">{item.KodeKategori}</td>
                  <td className="border p-2">{item.NamaKategori}</td>
                  <td className="border p-2">
                    {item.Status ? "Aktif" : "Nonaktif"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
