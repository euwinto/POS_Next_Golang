// "use client";

// import { useRouter } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";

// import Swal from "sweetalert2";

// export default function Navbar() {
//   const router = useRouter();
//   const { data: session } = useSession();

//   const handleLogout = async () => {
//     const confirm = await Swal.fire({
//       title: "Logout ?",
//       text: "Yakin ingin keluar?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Ya",
//       cancelButtonText: "Batal",
//     });

//     if (!confirm.isConfirmed) {
//       return;
//     }

//     try {
//       const res = await fetch("/api/logout", {
//         method: "POST",
//       });

//       const result = await res.json();

//       if (result.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Logout berhasil",
//           timer: 1000,
//           showConfirmButton: false,
//         });

//         // DESTROY SESSION NEXTAUTH
//         await signOut({
//           redirect: false,
//         });

//         router.push("/login");
//       }
//     } catch (err) {
//       console.error(err);

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Gagal logout",
//       });
//     }
//   };

//   return (
//     <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
//       <h1 className="font-semibold text-lg">Dashboard</h1>

//       <div className="flex items-center gap-4">
//         <span className="text-sm">Admin</span>

//         {/* <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button> */}

//         <button
//           // onClick={() => signOut({ callbackUrl: "/login" })}
//           // className="bg-red-500 text-white px-3 py-1 rounded"
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout ?",
      text: "Yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      // =========================
      // CATAT LOGOUT KE DATABASE
      // =========================
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal logout");
      }

      // =========================
      // HAPUS SESSION NEXTAUTH
      // =========================
      await signOut({
        redirect: false,
      });

      await Swal.fire({
        icon: "success",
        title: "Logout berhasil",
        timer: 1000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal logout",
      });
    }
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">
          {session?.user?.nama || session?.user?.username}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
