"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Login",
        text: "Username dan password wajib diisi",
      });

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Simpan token
        localStorage.setItem("token", data.token);

        // Simpan informasi user
        localStorage.setItem("user", JSON.stringify(data.user));

        await Swal.fire({
          icon: "success",
          title: "Login berhasil",
          timer: 1000,
          showConfirmButton: false,
        });

        router.push("/dashboard");
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: data.message || "Username atau password salah",
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Tidak dapat terhubung ke server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Login POS</h1>

        <input
          type="text"
          placeholder="Email / Username"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-sm text-center mt-3">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-500 underline">
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
}
