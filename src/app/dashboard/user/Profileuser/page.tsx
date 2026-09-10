"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  KeyRound,
  LogOut,
  Pencil,
  CheckCircle,
  UserCircle,
  Camera,
  Trash2,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

interface UserData {
  id: number;
  username: string;
  nama: string;
  role: string;
  sessionToken: string;
  mustChangePassword: boolean;
  profilePhoto?: string | null;
}

const API_URL = "http://localhost:8080";

export default function ProfileUserPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // =========================
  // GET PROFILE DARI BACKEND
  // =========================
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data profile");
      }

      setUser({
        id: result.data.ID,
        username: result.data.Username,
        nama: result.data.Nama,
        role: result.data.Role,
        mustChangePassword: result.data.MustChangePassword,
        profilePhoto: result.data.ProfilePhoto || null,

        // sessionToken tetap dari localStorage
        sessionToken:
          JSON.parse(localStorage.getItem("user") || "{}").sessionToken || "",
      });

      // Update localStorage user
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          id: result.data.ID,
          username: result.data.Username,
          nama: result.data.Nama,
          role: result.data.Role,
          mustChangePassword: result.data.MustChangePassword,
          profilePhoto: result.data.ProfilePhoto || null,
        })
      );
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    getProfile();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    if (!user) return;

    const confirm = await Swal.fire({
      title: "Logout?",
      text: "Yakin ingin keluar dari sistem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          sessionToken: user.sessionToken,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal melakukan logout");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await Swal.fire({
        icon: "success",
        title: "Logout berhasil",
        timer: 1000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Logout gagal",
        text: "Terjadi kesalahan saat logout.",
      });
    }
  };

  // =========================
  // UPLOAD PROFILE PHOTO
  // =========================
  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Reset input supaya file yang sama bisa dipilih lagi
    event.target.value = "";

    if (!file || !user) {
      return;
    }

    // =========================
    // VALIDASI TYPE
    // =========================
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "File tidak valid",
        text: "Format foto harus JPG, PNG, atau WEBP.",
      });

      return;
    }

    // =========================
    // VALIDASI SIZE
    // =========================
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File terlalu besar",
        text: "Ukuran foto maksimal 2 MB.",
      });

      return;
    }

    // =========================
    // PREVIEW
    // =========================
    const previewUrl = URL.createObjectURL(file);

    // Tampilkan preview terlebih dahulu
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        profilePhoto: previewUrl,
      };
    });

    // =========================
    // UPLOAD KE BACKEND
    // =========================
    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();

      formData.append("photo", file);

      const res = await fetch(`${API_URL}/api/user/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
        return;
      }

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal upload foto");
      }

      // =========================
      // URL FOTO DARI BACKEND
      // =========================
      const photoPath = result.data.ProfilePhoto;

      const photoUrl = `${API_URL}${photoPath}`;

      // Update state
      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          profilePhoto: photoUrl,
        };
      });

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          profilePhoto: photoPath,
        })
      );

      // Hapus object URL preview
      URL.revokeObjectURL(previewUrl);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Foto profile berhasil diperbarui.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("UPLOAD PROFILE PHOTO ERROR:", error);

      // Kalau upload gagal, ambil kembali foto dari server
      await getProfile();

      Swal.fire({
        icon: "error",
        title: "Upload gagal",
        text: error instanceof Error ? error.message : "Gagal mengupload foto.",
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // REMOVE PHOTO
  // =========================
  const handleRemovePhoto = async () => {
    if (!user?.profilePhoto) {
      return;
    }

    const confirm = await Swal.fire({
      title: "Hapus foto?",
      text: "Foto profile akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) {
      return;
    }

    /*
     * Untuk sementara jangan hanya menghapus dari state.
     *
     * Karena foto sudah tersimpan di backend,
     * kita perlu endpoint DELETE khusus.
     *
     * Nanti:
     *
     * DELETE /api/user/profile/photo
     */

    Swal.fire({
      icon: "info",
      title: "Belum tersedia",
      text: "Endpoint hapus foto belum dibuat di backend.",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // =========================
  // PHOTO URL
  // =========================
  const profilePhoto = user.profilePhoto
    ? user.profilePhoto.startsWith("http")
      ? user.profilePhoto
      : `${API_URL}${user.profilePhoto}`
    : null;

  // =========================
  // AVATAR INITIAL
  // =========================
  const initial = user.nama
    ? user.nama.charAt(0).toUpperCase()
    : user.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 md:p-6">
      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>

        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi akun Anda
        </p>
      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =========================
            PROFILE CARD
        ========================= */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            {/* =========================
                AVATAR
            ========================= */}
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover shadow-md ring-4 ring-blue-50"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600 shadow-sm ring-4 ring-blue-50">
                  {initial}
                </div>
              )}

              {/* UPLOAD LOADING */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 size={28} className="animate-spin text-white" />
                </div>
              )}

              {/* CAMERA BUTTON */}
              {!uploading && (
                <label
                  htmlFor="profilePhoto"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                  title="Ubah foto"
                >
                  <Camera size={18} />
                </label>
              )}

              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={uploading}
              />
            </div>

            {/* =========================
                PHOTO ACTION
            ========================= */}
            <div className="mt-4 flex gap-2">
              <label
                htmlFor="profilePhoto"
                className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${
                  uploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Camera size={16} />
                {uploading ? "Mengupload..." : "Ubah Foto"}
              </label>

              {profilePhoto && !uploading && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              )}
            </div>

            {/* =========================
                NAME
            ========================= */}
            <h2 className="mt-5 text-xl font-bold text-slate-800">
              {user.nama || user.username}
            </h2>

            {/* USERNAME */}
            <p className="mt-1 text-sm text-slate-500">@{user.username}</p>

            {/* ROLE */}
            <div className="mt-4 flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <Shield size={16} />
              {user.role}
            </div>

            {/* STATUS */}
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              Account Active
            </div>
          </div>

          {/* =========================
              ACTION
          ========================= */}
          <div className="mt-6 border-t pt-6">
            {/* CHANGE PASSWORD */}
            <button
              onClick={() =>
                router.push("/dashboard/user/Profileuser/change-password")
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <KeyRound size={18} />
              Ubah Password
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* =========================
            INFORMATION
        ========================= */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Informasi User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Informasi akun yang sedang digunakan
                </p>
              </div>

              <UserCircle size={28} className="text-slate-400" />
            </div>

            {/* INFORMATION */}
            <div className="divide-y">
              {/* NAMA */}
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Nama Lengkap</p>

                    <p className="font-medium text-slate-800">
                      {user.nama || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* USERNAME */}
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <UserCircle size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Username</p>

                    <p className="font-medium text-slate-800">
                      {user.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* ROLE */}
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                    <Shield size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Role</p>

                    <p className="font-medium text-slate-800">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* USER ID */}
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2 text-green-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">User ID</p>

                    <p className="font-medium text-slate-800">{user.id}</p>
                  </div>
                </div>
              </div>

              {/* PASSWORD STATUS */}
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                    <KeyRound size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Password</p>

                    <p className="font-medium text-slate-800">
                      {user.mustChangePassword
                        ? "Wajib diganti"
                        : "Password aktif"}
                    </p>
                  </div>
                </div>

                {user.mustChangePassword && (
                  <button
                    onClick={() => router.push("/dashboard/user/gantipass")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    <Pencil size={16} />
                    Ganti Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
