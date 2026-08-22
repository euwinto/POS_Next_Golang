"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  email: string;
};

export default function TableUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const filtered = users.filter((u) =>
    u.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search name..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 TABLE */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.firstName}</td>
              <td className="p-2 border">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
