// "use client";

// import { useState } from "react";
// import { signOut } from "next-auth/react";
// import Swal from "sweetalert2";

// export default function GantiPasswordPage() {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     try {
//       if (!oldPassword || !newPassword || !confirmPassword) {
//         Swal.fire({
//           icon: "warning",
//           title: "Lengkapi data",
//         });

//         return;
//       }

//       if (newPassword !== confirmPassword) {
//         Swal.fire({
//           icon: "warning",
//           title: "Konfirmasi password tidak sama",
//         });

//         return;
//       }

//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:8080/api/auth/change-password",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             oldPassword,
//             newPassword,
//           }),
//         }
//       );

//       const result = await res.json();

//       if (result.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Berhasil",
//           text: "Password berhasil diganti",
//         });

//         // DESTROY SESSION
//         await signOut({
//           redirect: false,
//         });

//         // LEMPAR KE LOGIN
//         window.location.href = "/login";
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Gagal",
//           text: result.message,
//         });
//       }
//     } catch (err) {
//       console.error(err);

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Server Error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       <div className="bg-white rounded-xl shadow p-6">
//         <h1 className="text-2xl font-bold mb-6">Ganti Password</h1>

//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm">Password Lama</label>

//             <input
//               type="password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm">Password Baru</label>

//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm">Konfirmasi Password</label>

//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg w-full"
//           >
//             {loading ? "Loading..." : "Simpan Password"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
const token = localStorage.getItem("token");

export default function GantiPasswordPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      // =========================
      // VALIDASI
      // =========================

      if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Lengkapi data",
          text: "Semua password wajib diisi",
        });

        return;
      }

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Konfirmasi password tidak sama",
        });

        return;
      }

      // =========================
      // AMBIL USER
      // =========================

      const userString = localStorage.getItem("user");

      if (!userString) {
        Swal.fire({
          icon: "error",
          title: "Session tidak ditemukan",
          text: "Silakan login kembali",
        });

        router.replace("/login");
        return;
      }

      const user = JSON.parse(userString);

      if (!user.username) {
        Swal.fire({
          icon: "error",
          title: "User tidak valid",
          text: "Silakan login kembali",
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");
        return;
      }

      setLoading(true);

      // =========================
      // CHANGE PASSWORD
      // =========================

      const res = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Username: user.username,
            OldPassword: oldPassword,
            NewPassword: newPassword,
          }),
        }
      );

      const result = await res.json();

      // =========================
      // SUCCESS
      // =========================

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password berhasil diganti. Silakan login kembali.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Hapus session/token lama
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Kembali ke login
        router.replace("/login");

        return;
      }

      // =========================
      // FAILED
      // =========================

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: result.message || "Gagal mengganti password",
      });
    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak dapat terhubung ke server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionGuard menuCode="GANTIPASSWORD">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Ganti Password</h1>

          <div className="space-y-4">
            {/* PASSWORD LAMA */}
            <div>
              <label className="block mb-1 text-sm">Password Lama</label>

              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border rounded-lg p-3"
                disabled={loading}
              />
            </div>

            {/* PASSWORD BARU */}
            <div>
              <label className="block mb-1 text-sm">Password Baru</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg p-3"
                disabled={loading}
              />
            </div>

            {/* KONFIRMASI */}
            <div>
              <label className="block mb-1 text-sm">Konfirmasi Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-3"
                disabled={loading}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg w-full"
            >
              {loading ? "Loading..." : "Simpan Password"}
            </button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
