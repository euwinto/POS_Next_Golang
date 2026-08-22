"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    Username: "",
    Nama: "",
    Password: "",
    Role: "KASIR",
  });

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

  const handleSave = async () => {
    try {
      if (!form.Username || !form.Nama || !form.Password || !form.Role) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Semua field wajib diisi",
        });

        return;
      }

      const res = await fetch("/api/master/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil disimpan",
        });

        setForm({
          Username: "",
          Nama: "",
          Password: "",
          Role: "KASIR",
        });

        getUsers();
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

  const handleStatus = async (username: string, isActive: boolean) => {
    try {
      const confirm = await Swal.fire({
        title: isActive ? "Non Aktifkan User?" : "Aktifkan User?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
      });

      if (!confirm.isConfirmed) {
        return;
      }

      const res = await fetch("/api/master/user/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          Username: username,
          IsActive: !isActive,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Status user berhasil diubah",
        });

        getUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data User</h1>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="font-semibold mb-4">Tambah User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Username</label>

            <input
              type="text"
              value={form.Username}
              onChange={(e) =>
                setForm({
                  ...form,
                  Username: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nama</label>

            <input
              type="text"
              value={form.Nama}
              onChange={(e) =>
                setForm({
                  ...form,
                  Nama: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>

            {/* <input
              type="password"
              value={form.Password}
              onChange={(e) =>
                setForm({
                  ...form,
                  Password: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 mt-1"
            /> */}
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>

            <select
              value={form.Role}
              onChange={(e) =>
                setForm({
                  ...form,
                  Role: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="KASIR">KASIR</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Save User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-3 text-left">Username</th>
              <th className="border p-3 text-left">Nama</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-center">Status</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item, index) => (
              <tr key={index}>
                <td className="border p-3">{item.Username}</td>

                <td className="border p-3">{item.Nama}</td>

                <td className="border p-3">{item.Role}</td>

                <td className="border p-3 text-center">
                  {item.IsActive ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      NON ACTIVE
                    </span>
                  )}
                </td>

                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleStatus(item.Username, item.IsActive)}
                    className={`px-4 py-2 rounded text-white ${
                      item.IsActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {item.IsActive ? "Non Aktif" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-5 text-slate-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
