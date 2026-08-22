"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const getUsers = async () => {
    try {
      const res = await fetch("/api/master/user");
      const result = await res.json();

      setUsers(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleReset = async () => {
    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Pilih user terlebih dahulu",
      });

      return;
    }

    const confirm = await Swal.fire({
      title: "Reset Password ?",
      text: `Password user ${selectedUser} akan direset`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya Reset",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      const res = await fetch("/api/master/user/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: selectedUser,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          html: `
            Password berhasil direset<br/><br/>
            <b>Password Default:</b><br/>
            POS1234
          `,
        });
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
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Reset Password User</h1>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">Pilih User</label>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">-- PILIH USER --</option>

            {users.map((item, index) => (
              <option key={index} value={item.Username}>
                {item.Username} - {item.Nama}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
