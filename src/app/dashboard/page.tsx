// "use client";

// import {
//   ShoppingCart,
//   DollarSign,
//   Package,
//   Users,
//   TrendingUp,
//   ArrowUpRight,
//   ArrowDownRight,
//   MoreHorizontal,
// } from "lucide-react";

// export default function DashboardPage() {
//   // =========================
//   // DUMMY DATA
//   // NANTI DIGANTI API
//   // =========================

//   const salesData = [
//     { day: "Sen", value: 1200000 },
//     { day: "Sel", value: 1800000 },
//     { day: "Rab", value: 1400000 },
//     { day: "Kam", value: 2200000 },
//     { day: "Jum", value: 2800000 },
//     { day: "Sab", value: 3200000 },
//     { day: "Min", value: 2500000 },
//   ];

//   const categoryData = [
//     { name: "Makanan", value: 45 },
//     { name: "Minuman", value: 30 },
//     { name: "Snack", value: 15 },
//     { name: "Lainnya", value: 10 },
//   ];

//   const topProducts = [
//     {
//       name: "Indomie Goreng",
//       category: "Makanan",
//       sold: 128,
//       total: 1920000,
//     },
//     {
//       name: "Aqua 600ml",
//       category: "Minuman",
//       sold: 96,
//       total: 480000,
//     },
//     {
//       name: "Kopi Sachet",
//       category: "Minuman",
//       sold: 85,
//       total: 425000,
//     },
//     {
//       name: "Chitato",
//       category: "Snack",
//       sold: 72,
//       total: 1080000,
//     },
//     {
//       name: "Teh Botol",
//       category: "Minuman",
//       sold: 65,
//       total: 455000,
//     },
//   ];

//   const recentTransactions = [
//     {
//       invoice: "TRX-20260829-001",
//       customer: "Walk In Customer",
//       cashier: "Ana",
//       total: 185000,
//       status: "Success",
//       time: "10:32",
//     },
//     {
//       invoice: "TRX-20260829-002",
//       customer: "Budi",
//       cashier: "Ana",
//       total: 275000,
//       status: "Success",
//       time: "10:18",
//     },
//     {
//       invoice: "TRX-20260829-003",
//       customer: "Citra",
//       cashier: "Doni",
//       total: 95000,
//       status: "Pending",
//       time: "09:54",
//     },
//     {
//       invoice: "TRX-20260829-004",
//       customer: "Walk In Customer",
//       cashier: "Doni",
//       total: 320000,
//       status: "Success",
//       time: "09:42",
//     },
//     {
//       invoice: "TRX-20260829-005",
//       customer: "Eko",
//       cashier: "Ana",
//       total: 145000,
//       status: "Success",
//       time: "09:21",
//     },
//   ];

//   // =========================
//   // FORMAT RUPIAH
//   // =========================

//   const formatRupiah = (value: number) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   // =========================
//   // MAX SALES
//   // =========================

//   const maxSales = Math.max(...salesData.map((item) => item.value));

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 md:p-6">
//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-800">
//           Dashboard
//         </h1>

//         <p className="mt-1 text-sm text-slate-500">
//           Ringkasan aktivitas POS hari ini
//         </p>
//       </div>

//       {/* =====================================================
//           SUMMARY CARDS
//       ====================================================== */}

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {/* PENJUALAN */}

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm text-slate-500">
//                 Total Penjualan
//               </p>

//               <h2 className="mt-2 text-2xl font-bold text-slate-800">
//                 Rp 12,5 Jt
//               </h2>
//             </div>

//             <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
//               <DollarSign size={22} />
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-1 text-sm">
//             <ArrowUpRight size={16} className="text-green-500" />

//             <span className="font-medium text-green-600">
//               12,5%
//             </span>

//             <span className="text-slate-400">
//               dibanding kemarin
//             </span>
//           </div>
//         </div>

//         {/* TRANSAKSI */}

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm text-slate-500">
//                 Total Transaksi
//               </p>

//               <h2 className="mt-2 text-2xl font-bold text-slate-800">
//                 245
//               </h2>
//             </div>

//             <div className="rounded-lg bg-green-50 p-3 text-green-600">
//               <ShoppingCart size={22} />
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-1 text-sm">
//             <ArrowUpRight size={16} className="text-green-500" />

//             <span className="font-medium text-green-600">
//               8,2%
//             </span>

//             <span className="text-slate-400">
//               dibanding kemarin
//             </span>
//           </div>
//         </div>

//         {/* PRODUK */}

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm text-slate-500">
//                 Total Produk
//               </p>

//               <h2 className="mt-2 text-2xl font-bold text-slate-800">
//                 1.250
//               </h2>
//             </div>

//             <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
//               <Package size={22} />
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-1 text-sm">
//             <span className="font-medium text-orange-600">
//               24
//             </span>

//             <span className="text-slate-400">
//               produk stok rendah
//             </span>
//           </div>
//         </div>

//         {/* CUSTOMER */}

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm text-slate-500">
//                 Total Customer
//               </p>

//               <h2 className="mt-2 text-2xl font-bold text-slate-800">
//                 180
//               </h2>
//             </div>

//             <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
//               <Users size={22} />
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-1 text-sm">
//             <ArrowUpRight size={16} className="text-green-500" />

//             <span className="font-medium text-green-600">
//               5,4%
//             </span>

//             <span className="text-slate-400">
//               bulan ini
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           CHART AREA
//       ====================================================== */}

//       <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
//         {/* SALES CHART */}

//         <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="font-semibold text-slate-800">
//                 Penjualan 7 Hari
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 Performa penjualan minggu ini
//               </p>
//             </div>

//             <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
//               <MoreHorizontal size={20} />
//             </button>
//           </div>

//           {/* BAR CHART */}

//           <div className="mt-8 flex h-64 items-end justify-between gap-3">
//             {salesData.map((item) => {
//               const height =
//                 (item.value / maxSales) * 100;

//               return (
//                 <div
//                   key={item.day}
//                   className="flex h-full flex-1 flex-col items-center justify-end gap-2"
//                 >
//                   <div className="text-xs font-medium text-slate-500">
//                     {(item.value / 1000000).toFixed(1)}M
//                   </div>

//                   <div className="flex h-full w-full items-end">
//                     <div
//                       className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
//                       style={{
//                         height: `${height}%`,
//                       }}
//                     />
//                   </div>

//                   <span className="text-xs text-slate-400">
//                     {item.day}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* CATEGORY */}

//         <div className="rounded-xl bg-white p-6 shadow-sm">
//           <div>
//             <h2 className="font-semibold text-slate-800">
//               Penjualan Kategori
//             </h2>

//             <p className="mt-1 text-xs text-slate-500">
//               Distribusi penjualan berdasarkan kategori
//             </p>
//           </div>

//           {/* PIE */}

//           <div className="mt-8 flex justify-center">
//             <div
//               className="
//                 relative
//                 h-48
//                 w-48
//                 rounded-full
//                 bg-[conic-gradient(#3b82f6_0deg_162deg,#22c55e_162deg_270deg,#f97316_270deg_324deg,#a855f7_324deg_360deg)]
//               "
//             >
//               <div className="absolute inset-10 flex items-center justify-center rounded-full bg-white">
//                 <div className="text-center">
//                   <p className="text-xs text-slate-400">
//                     Total
//                   </p>

//                   <p className="text-xl font-bold text-slate-800">
//                     100%
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* LEGEND */}

//           <div className="mt-6 space-y-3">
//             {categoryData.map((item, index) => (
//               <div
//                 key={item.name}
//                 className="flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`h-3 w-3 rounded-full ${
//                       index === 0
//                         ? "bg-blue-500"
//                         : index === 1
//                           ? "bg-green-500"
//                           : index === 2
//                             ? "bg-orange-500"
//                             : "bg-purple-500"
//                     }`}
//                   />

//                   <span className="text-sm text-slate-600">
//                     {item.name}
//                   </span>
//                 </div>

//                 <span className="text-sm font-semibold text-slate-800">
//                   {item.value}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           BOTTOM AREA
//       ====================================================== */}

//       <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
//         {/* TOP PRODUCTS */}

//         <div className="rounded-xl bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b px-6 py-5">
//             <div>
//               <h2 className="font-semibold text-slate-800">
//                 Produk Terlaris
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 Produk dengan penjualan terbanyak
//               </p>
//             </div>

//             <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
//               Lihat Semua
//             </button>
//           </div>

//           <div className="divide-y">
//             {topProducts.map((product, index) => (
//               <div
//                 key={product.name}
//                 className="flex items-center gap-4 px-6 py-4"
//               >
//                 {/* NUMBER */}

//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
//                   {index + 1}
//                 </div>

//                 {/* PRODUCT */}

//                 <div className="min-w-0 flex-1">
//                   <p className="truncate font-medium text-slate-800">
//                     {product.name}
//                   </p>

//                   <p className="text-xs text-slate-400">
//                     {product.category}
//                   </p>
//                 </div>

//                 {/* SOLD */}

//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-slate-800">
//                     {product.sold}
//                   </p>

//                   <p className="text-xs text-slate-400">
//                     terjual
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RECENT TRANSACTIONS */}

//         <div className="rounded-xl bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b px-6 py-5">
//             <div>
//               <h2 className="font-semibold text-slate-800">
//                 Transaksi Terbaru
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 Aktivitas transaksi terakhir
//               </p>
//             </div>

//             <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
//               Lihat Semua
//             </button>
//           </div>

//           <div className="divide-y">
//             {recentTransactions.map((transaction) => (
//               <div
//                 key={transaction.invoice}
//                 className="flex items-center gap-4 px-6 py-4"
//               >
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
//                   {transaction.customer
//                     .charAt(0)
//                     .toUpperCase()}
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-slate-800">
//                     {transaction.invoice}
//                   </p>

//                   <p className="truncate text-xs text-slate-400">
//                     {transaction.customer} •{" "}
//                     {transaction.time}
//                   </p>
//                 </div>

//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-slate-800">
//                     {formatRupiah(transaction.total)}
//                   </p>

//                   <span
//                     className={`text-xs font-medium ${
//                       transaction.status === "Success"
//                         ? "text-green-600"
//                         : "text-orange-500"
//                     }`}
//                   >
//                     {transaction.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  RefreshCw,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

// =====================================================
// INTERFACE
// =====================================================

interface CategoryData {
  name: string;
  value: number;
}

interface ProductData {
  id: number;
  kodeBarang: string;
  name: string;
  category: string;
  hargaJual: number;
  status: boolean;
  waktuDibuat?: string | null;
}

interface TransactionData {
  invoice: string;
  customer: string;
  cashier: string;
  total: number;
  status: string;
  time: string;
}

interface DashboardData {
  summary: {
    totalPenjualan: number;
    totalTransaksi: number;
    totalProduk: number;
    totalCustomer: number;
    produkStokRendah: number;
  };

  produk: {
    total: number;
    aktif: number;
    nonaktif: number;
    perKategori: CategoryData[];
    terbaru: ProductData[];
  };

  user: {
    total: number;
    aktif: number;
    nonaktif: number;
  };

  penjualan: {
    hariIni: {
      transaksi: number;
      omzet: number;
    };

    bulanIni: {
      transaksi: number;
      omzet: number;
    };

    chart: {
      day: string;
      date: string;
      value: number;
    }[];
  };

  kategori: CategoryData[];

  produkTerlaris: ProductData[];

  transaksiTerbaru: TransactionData[];
}

// =====================================================
// PAGE
// =====================================================

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/dashboard", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal mengambil data dashboard");
      }

      setData(result.data);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD AWAL
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw size={18} className="animate-spin" />

          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
          <p className="font-semibold">Gagal mengambil data dashboard.</p>

          <button
            onClick={loadDashboard}
            className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA AMAN
  // =====================================================

  const salesLabels = data.penjualan?.chart?.map((item) => item.day) || [];

  const salesValues = data.penjualan?.chart?.map((item) => item.value) || [];

  const categoryData = data.kategori || [];

  const topProducts = data.produkTerlaris || [];

  const recentTransactions = data.transaksiTerbaru || [];

  // =====================================================
  // MAX SALES
  // =====================================================

  const maxSales = salesValues.length > 0 ? Math.max(...salesValues) : 0;

  // =====================================================
  // Format rupiah untuk yang 7 hari
  // =====================================================
  const formatChartValue = (value: number) => {
    if (value === 0) {
      return "Rp0";
    }

    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)} jt`;
    }

    if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(0)} rb`;
    }

    return `Rp${value.toLocaleString("id-ID")}`;
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 md:p-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Ringkasan aktivitas POS hari ini
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-slate-300
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL PENJUALAN */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Penjualan</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {formatRupiah(data.summary.totalPenjualan)}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUpRight size={16} className="text-green-500" />

            <span className="font-medium text-green-600">Hari ini</span>

            <span className="text-slate-400">
              {formatRupiah(data.penjualan.hariIni.omzet)}
            </span>
          </div>
        </div>

        {/* TOTAL TRANSAKSI */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Transaksi</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {data.summary.totalTransaksi}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <ShoppingCart size={22} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUpRight size={16} className="text-green-500" />

            <span className="font-medium text-green-600">Hari ini</span>

            <span className="text-slate-400">
              {data.penjualan.hariIni.transaksi} transaksi
            </span>
          </div>
        </div>

        {/* TOTAL PRODUK */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Produk</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {data.summary.totalProduk.toLocaleString("id-ID")}
              </h2>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <Package size={22} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="font-medium text-orange-600">
              {data.summary.produkStokRendah}
            </span>

            <span className="text-slate-400">produk stok rendah</span>
          </div>
        </div>

        {/* CUSTOMER */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customer</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {data.summary.totalCustomer.toLocaleString("id-ID")}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Users size={22} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="font-medium text-purple-600">Customer</span>

            <span className="text-slate-400">terdaftar</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHART AREA
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ===================================================
            SALES CHART
        ==================================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Penjualan 7 Hari</h2>

              <p className="mt-1 text-xs text-slate-500">
                Performa penjualan minggu ini
              </p>
            </div>

            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* BAR CHART */}

          <div className="mt-8 flex h-64 items-end justify-between gap-3">
            {salesLabels.length > 0 ? (
              salesLabels.map((day, index) => {
                const value = salesValues[index] || 0;

                const height = maxSales > 0 ? (value / maxSales) * 100 : 0;

                return (
                  <div
                    key={`${day}-${index}`}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="text-xs font-medium text-slate-500">
                      {formatChartValue(value)}
                    </div>

                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                        style={{
                          height: `${height}%`,
                          minHeight: value > 0 ? "4px" : "0px",
                        }}
                      />
                    </div>

                    <span className="text-xs text-slate-400">{day}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                Belum ada data penjualan
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            CATEGORY
        ==================================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-800">
              Produk per Kategori
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Distribusi produk berdasarkan kategori
            </p>
          </div>

          {/* PIE */}

          {categoryData.length > 0 ? (
            <>
              <div className="mt-8 flex justify-center">
                <div
                  className="
                    relative
                    h-48
                    w-48
                    rounded-full
                    bg-[conic-gradient(#3b82f6_0deg_162deg,#22c55e_162deg_270deg,#f97316_270deg_324deg,#a855f7_324deg_360deg)]
                  "
                >
                  <div className="absolute inset-10 flex items-center justify-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Produk</p>

                      <p className="text-xl font-bold text-slate-800">
                        {data.summary.totalProduk}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LEGEND */}

              <div className="mt-6 space-y-3">
                {categoryData.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                            h-3
                            w-3
                            rounded-full
                            ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                            }
                          `}
                      />

                      <span className="text-sm text-slate-600">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-10 flex h-48 items-center justify-center text-sm text-slate-400">
              Belum ada kategori produk
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          BOTTOM AREA
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ===================================================
            TOP PRODUCTS
        ==================================================== */}

        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-800">Produk Terlaris</h2>

              <p className="mt-1 text-xs text-slate-500">
                Produk dengan penjualan terbanyak
              </p>
            </div>

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Lihat Semua
            </button>
          </div>

          <div className="divide-y">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.id || `${product.name}-${index}`}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* NUMBER */}

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>

                  {/* PRODUCT */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {product.category || "Lainnya"}
                    </p>
                  </div>

                  {/* SOLD */}

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {product.sold || "-"}
                    </p>

                    <p className="text-xs text-slate-400">terjual</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                Belum ada data produk terlaris
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            RECENT TRANSACTIONS
        ==================================================== */}

        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-800">
                Transaksi Terbaru
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Aktivitas transaksi terakhir
              </p>
            </div>

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Lihat Semua
            </button>
          </div>

          <div className="divide-y">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.invoice || index}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* AVATAR */}

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                    {(transaction.customer || "?").charAt(0).toUpperCase()}
                  </div>

                  {/* TRANSACTION */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {transaction.invoice}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {transaction.customer}
                      {" • "}
                      {transaction.time}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {formatRupiah(transaction.total)}
                    </p>

                    <span
                      className={`
                          text-xs
                          font-medium
                          ${
                            transaction.status === "Success"
                              ? "text-green-600"
                              : "text-orange-500"
                          }
                        `}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                Belum ada transaksi.
                <p className="mt-1 text-xs">
                  Data akan muncul setelah modul transaksi dibuat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCT SUMMARY
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PRODUK AKTIF */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Produk Aktif</p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {data.produk.aktif}
          </p>
        </div>

        {/* PRODUK NONAKTIF */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Produk Nonaktif</p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {data.produk.nonaktif}
          </p>
        </div>

        {/* USER */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">User Sistem</p>

          <p className="mt-2 text-2xl font-bold text-purple-600">
            {data.user.total}
          </p>
        </div>
      </div>
    </div>
  );
}
