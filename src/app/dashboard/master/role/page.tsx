"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function MasterRolePage() {
  const [roles, setRoles] = useState<any[]>([]);

  const [roleCode, setRoleCode] = useState("");
  const [roleName, setRoleName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const getRoles = async () => {
    try {
      const res = await fetch("/api/master/role");
      const result = await res.json();

      setRoles(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/master/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          RoleCode: roleCode,
          RoleName: roleName,
          IsActive: isActive,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Role berhasil disimpan",
        });

        setRoleCode("");
        setRoleName("");
        setIsActive(true);

        getRoles();
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
      <h1 className="text-2xl font-bold mb-6">Master Role</h1>

      {/* FORM */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl shadow p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ROLE CODE */}
          <div>
            <label className="block text-sm mb-1 font-medium">Role Code</label>

            <input
              type="text"
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value.toUpperCase())}
              className="w-full border rounded-lg p-2"
              placeholder="OWNER"
              required
            />
          </div>

          {/* ROLE NAME */}
          <div>
            <label className="block text-sm mb-1 font-medium">Role Name</label>

            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Owner"
              required
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm mb-1 font-medium">Status</label>

            <select
              value={isActive ? "1" : "0"}
              onChange={(e) => setIsActive(e.target.value === "1")}
              className="w-full border rounded-lg p-2"
            >
              <option value="1">Active</option>
              <option value="0">Non Active</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-5">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Save Role
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-3 text-left">Role Code</th>
              <th className="border p-3 text-left">Role Name</th>
              <th className="border p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="border p-3">{item.RoleCode}</td>
                <td className="border p-3">{item.RoleName}</td>
                <td className="border p-3 text-center">
                  {item.IsActive ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      NON ACTIVE
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-5 text-slate-500">
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
