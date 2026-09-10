"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";

export default function MasterMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    MenuCode: "",
    MenuName: "",
    Url: "",
    Icon: "",
    ParentID: "",
    Sort: 0,
    IsActive: true,
  });

  const getMenu = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      setMenus(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Menu berhasil disimpan",
        });

        getMenu();

        setForm({
          MenuCode: "",
          MenuName: "",
          Url: "",
          Icon: "",
          ParentID: "",
          Sort: 0,
          IsActive: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PermissionGuard menuCode="MENU">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Master Menu</h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Menu Code"
              className="border p-2 rounded"
              value={form.MenuCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  MenuCode: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Menu Name"
              className="border p-2 rounded"
              value={form.MenuName}
              onChange={(e) =>
                setForm({
                  ...form,
                  MenuName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="URL"
              className="border p-2 rounded"
              value={form.Url}
              onChange={(e) =>
                setForm({
                  ...form,
                  Url: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Icon Lucide"
              className="border p-2 rounded"
              value={form.Icon}
              onChange={(e) =>
                setForm({
                  ...form,
                  Icon: e.target.value,
                })
              }
            />

            <select
              className="border p-2 rounded"
              value={form.ParentID}
              onChange={(e) =>
                setForm({
                  ...form,
                  ParentID: e.target.value,
                })
              }
            >
              <option value="">Parent Menu</option>

              {menus
                .filter((x) => x.ParentID === null)
                .map((item) => (
                  <option key={item.ID} value={item.ID}>
                    {item.MenuName}
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Sort"
              className="border p-2 rounded"
              value={form.Sort}
              onChange={(e) =>
                setForm({
                  ...form,
                  Sort: Number(e.target.value),
                })
              }
            />

            <select
              className="border p-2 rounded"
              value={form.IsActive ? "1" : "0"}
              onChange={(e) =>
                setForm({
                  ...form,
                  IsActive: e.target.value === "1",
                })
              }
            >
              <option value="1">Active</option>
              <option value="0">Non Active</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Menu
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="border p-2">Code</th>
                <th className="border p-2">Menu</th>
                <th className="border p-2">URL</th>
                <th className="border p-2">Icon</th>
                <th className="border p-2">Parent</th>
                <th className="border p-2">Sort</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((item) => (
                <tr key={item.ID}>
                  <td className="border p-2">{item.MenuCode}</td>
                  <td className="border p-2">{item.MenuName}</td>
                  <td className="border p-2">{item.Url}</td>
                  <td className="border p-2">{item.Icon}</td>
                  <td className="border p-2">{item.ParentName || "-"}</td>
                  <td className="border p-2">{item.Sort}</td>
                  <td className="border p-2">
                    {item.IsActive ? "ACTIVE" : "NON ACTIVE"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PermissionGuard>
  );
}
