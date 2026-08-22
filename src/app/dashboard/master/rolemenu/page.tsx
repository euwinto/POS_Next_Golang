/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function RoleMenuPage() {
  const [roles, setRoles] = useState<any[]>([]);
  // const [menus, setMenus] = useState<any[]>([]);
  const [, setMenus] = useState<any[]>([]);

  const [selectedRole, setSelectedRole] = useState("");

  const [permissions, setPermissions] = useState<any[]>([]);

  const getData = async () => {
    try {
      const roleRes = await fetch("/api/master/role");
      const roleResult = await roleRes.json();

      setRoles(roleResult.data || []);

      const menuRes = await fetch("/api/master/menu");
      const menuResult = await menuRes.json();

      setMenus(menuResult.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleMenu = async (role: string) => {
    try {
      const res = await fetch(`/api/master/rolemenu?role=${role}`);
      const result = await res.json();

      setPermissions(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      getRoleMenu(selectedRole);
    }
  }, [selectedRole]);

  const handleCheck = (menuCode: string, field: string, value: boolean) => {
    const updated = permissions.map((item) => {
      if (item.MenuCode === menuCode) {
        return {
          ...item,
          [field]: value,
        };
      }

      return item;
    });

    setPermissions(updated);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/master/rolemenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          RoleName: selectedRole,
          permissions,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Permission berhasil disimpan",
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
      <h1 className="text-2xl font-bold mb-6">Role Menu</h1>

      {/* SELECT ROLE */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Pilih Role</label>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border rounded-lg p-2 w-80"
        >
          <option value="">-- SELECT ROLE --</option>

          {roles.map((item) => (
            <option key={item.RoleCode} value={item.RoleCode}>
              {item.RoleName}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-3 text-left">Menu</th>
              <th className="border p-3 text-center">View</th>
              <th className="border p-3 text-center">Add</th>
              <th className="border p-3 text-center">Edit</th>
              <th className="border p-3 text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((item, index) => (
              <tr key={index}>
                <td className="border p-3">
                  {item.ParentID ? "↳ " : ""}
                  {item.MenuName}
                </td>

                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.CanView}
                    onChange={(e) =>
                      handleCheck(item.MenuCode, "CanView", e.target.checked)
                    }
                  />
                </td>

                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.CanAdd}
                    onChange={(e) =>
                      handleCheck(item.MenuCode, "CanAdd", e.target.checked)
                    }
                  />
                </td>

                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.CanEdit}
                    onChange={(e) =>
                      handleCheck(item.MenuCode, "CanEdit", e.target.checked)
                    }
                  />
                </td>

                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.CanDelete}
                    onChange={(e) =>
                      handleCheck(item.MenuCode, "CanDelete", e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}

            {permissions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-5 text-slate-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BUTTON */}
      {selectedRole && (
        <div className="mt-5">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Save Permission
          </button>
        </div>
      )}
    </div>
  );
}
