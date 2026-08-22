"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

export default function GantiPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Lengkapi data",
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

      setLoading(true);

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password berhasil diganti",
        });

        // DESTROY SESSION
        await signOut({
          redirect: false,
        });

        // LEMPAR KE LOGIN
        window.location.href = "/login";
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message,
        });
      }
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Ganti Password</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Password Lama</label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password Baru</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Konfirmasi Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg w-full"
          >
            {loading ? "Loading..." : "Simpan Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
