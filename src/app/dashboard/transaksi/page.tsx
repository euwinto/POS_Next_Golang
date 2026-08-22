"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useSession } from "next-auth/react";
// const { data: session } = useSession();
// export async function GET() {

//   return Response.json({
//     username: session?.value || null,
//   });
// }

// TYPE
type Produk = {
  KodeBarang: string;
  NamaBarang: string;
  HargaJual: number;
};

type CartItem = Produk & {
  qty: number;
};

export default function TransaksiPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [bayar, setBayar] = useState(0);
  const [payment, setPayment] = useState("tunai");
  const [kategori, setKategori] = useState<any[]>([]);
  const [selectedKategori, setSelectedKategori] = useState("");

  // FORMAT RUPIAH
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // AMBIL KATEGORI
  const getKategori = async () => {
    try {
      const res = await fetch("/api/transaction/kategori?aktif=1");
      const data = await res.json();

      setKategori(data);

      // otomatis pilih kategori pertama
      if (data.length > 0) {
        setSelectedKategori(data[0].NamaKategori);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // GET PRODUK
  const getProduk = async () => {
    try {
      const res = await fetch("/api/master/produk?aktif=1");
      const data = await res.json();
      setProduk(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProduk();
    getKategori();
    // window.print();
  }, []);

  // ADD
  const addToCart = (item: Produk) => {
    const exist = cart.find((i) => i.KodeBarang === item.KodeBarang);

    if (exist) {
      setCart(
        cart.map((i) =>
          i.KodeBarang === item.KodeBarang ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // UPDATE QTY
  const updateQty = (kode: string, type: "plus" | "minus") => {
    setCart(
      cart
        .map((item) => {
          if (item.KodeBarang === kode) {
            const qty = type === "plus" ? item.qty + 1 : item.qty - 1;
            return { ...item, qty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  // DELETE
  const removeItem = (kode: string) => {
    setCart(cart.filter((item) => item.KodeBarang !== kode));
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.HargaJual, 0);

  const kembali = bayar - total;

  // const filteredProduk = produk.filter((p) =>
  //   p.NamaBarang.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredProduk = produk.filter((p: any) => {
    const cocokSearch = p.NamaBarang.toLowerCase().includes(
      search.toLowerCase()
    );

    const cocokKategori =
      selectedKategori === "" ? true : p.KategoriBarang === selectedKategori;

    return cocokSearch && cocokKategori;
  });

  // INFO
  const totalItem = cart.length;
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      // VALIDASI
      if (cart.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Keranjang kosong",
        });

        return;
      }

      if (bayar < total) {
        Swal.fire({
          icon: "warning",
          title: "Uang bayar kurang",
        });

        return;
      }

      setLoading(true);

      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          total,
          bayar,
          kembalian: kembali,
          payment,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const swal = await Swal.fire({
          icon: "success",
          title: "Transaksi Berhasil",
          text: `No Transaksi : ${result.noTransaksi}`,
          showCancelButton: true,
          confirmButtonText: "Print Struk",
          cancelButtonText: "Tutup",
        });

        if (swal.isConfirmed) {
          window.open(`/transaksi/print/${result.noTransaksi}`, "_blank");
        }

        // RESET
        setCart([]);
        setBayar(0);
        setPayment("tunai");
        setSearch("");
        setSelectedKategori("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (err: any) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4 min-h-screen bg-gray-100">
      {/* LEFT */}
      <div className="col-span-1 bg-white p-4 rounded shadow flex flex-col">
        <h2 className="font-bold text-lg mb-3">Produk</h2>

        <input
          type="text"
          placeholder="Cari produk..."
          className="border p-2 mb-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* KATEGORI */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedKategori("")}
            className={`px-3 py-2 rounded border ${
              selectedKategori === "" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Semua
          </button>

          {kategori.map((item: any) => (
            <button
              key={item.KodeKategori}
              onClick={() => setSelectedKategori(item.KodeKategori)}
              className={`px-3 py-2 rounded border ${
                selectedKategori === item.KodeKategori
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {item.NamaKategori}
            </button>
          ))}
        </div>

        <div className="overflow-auto">
          {filteredProduk.map((item) => (
            <div
              key={item.KodeBarang}
              className="border p-2 mb-2 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{item.NamaBarang}</div>
                <div className="text-sm text-gray-500">{item.KodeBarang}</div>
              </div>

              <div className="flex items-center gap-3">
                <span>Rp {formatRupiah(item.HargaJual)}</span>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* CART */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <h2 className="font-bold text-lg">Keranjang</h2>

            <button
              onClick={() => setCart([])}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Kosongkan
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Kode</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <tr key={item.KodeBarang}>
                    <td className="p-2">{item.KodeBarang}</td>
                    <td className="p-2">{item.NamaBarang}</td>

                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateQty(item.KodeBarang, "minus")}
                          className="bg-gray-300 px-2"
                        >
                          -
                        </button>

                        {item.qty}

                        <button
                          onClick={() => updateQty(item.KodeBarang, "plus")}
                          className="bg-gray-300 px-2"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-2">Rp {formatRupiah(item.HargaJual)}</td>

                    <td className="p-2">
                      Rp {formatRupiah(item.qty * item.HargaJual)}
                    </td>

                    <td className="p-2">
                      <button
                        onClick={() => removeItem(item.KodeBarang)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAYMENT */}
        <div className="grid grid-cols-2 gap-4">
          {/* DETAIL */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Detail Pembayaran</h3>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {formatRupiah(total)}</span>
            </div>

            <input
              type="number"
              placeholder="Uang bayar"
              className="border p-2 w-full mt-3 rounded"
              value={bayar}
              onChange={(e) => setBayar(Number(e.target.value))}
            />

            <div className="flex justify-between mt-2">
              <span>Kembalian</span>
              <span className="text-green-600 font-bold">
                Rp {formatRupiah(kembali)}
              </span>
            </div>

            {/* PAYMENT METHOD */}
            <div className="flex gap-2 mt-4">
              {["tunai", "qris", "kartu"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`px-3 py-2 rounded border ${
                    payment === p ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Simpan Transaksi</h3>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white w-full p-3 rounded mb-2 disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Transaksi"}
            </button>

            <button
              onClick={() => setCart([])}
              className="bg-gray-300 w-full p-3 rounded"
            >
              Batal
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-white p-4 rounded shadow grid grid-cols-3 text-center">
          <div>
            <div className="text-gray-500">Jumlah Item</div>
            <div className="font-bold text-lg">{totalItem}</div>
          </div>

          <div>
            <div className="text-gray-500">Total Qty</div>
            <div className="font-bold text-lg">{totalQty}</div>
          </div>

          <div>
            <div className="text-gray-500">Diskon</div>
            <div className="font-bold text-lg">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
