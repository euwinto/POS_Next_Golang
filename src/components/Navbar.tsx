// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { User, KeyRound, LogOut, ChevronDown } from "lucide-react";
// import Swal from "sweetalert2";

// interface User {
//   id: number;
//   username: string;
//   nama: string;
//   role: string;
//   sessionToken: string;
//   mustChangePassword: boolean;
// }

// export default function Navbar() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);
//   const [openProfile, setOpenProfile] = useState(false);

//   const profileRef = useRef<HTMLDivElement>(null);

//   // =========================
//   // GET USER
//   // =========================
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("USER STORAGE ERROR:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   // =========================
//   // CLOSE DROPDOWN KLIK LUAR
//   // =========================
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target as Node)
//       ) {
//         setOpenProfile(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = async () => {
//     setOpenProfile(false);

//     const confirm = await Swal.fire({
//       title: "Logout?",
//       text: "Yakin ingin keluar dari sistem?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Ya, Logout",
//       cancelButtonText: "Batal",
//       reverseButtons: true,
//     });

//     if (!confirm.isConfirmed) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");

//       if (!user) {
//         throw new Error("Data user tidak ditemukan");
//       }

//       // =========================
//       // LOGOUT BACKEND
//       // =========================
//       const res = await fetch("http://localhost:8080/api/auth/logout", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: user.username,
//           sessionToken: user.sessionToken,
//         }),
//       });

//       const result = await res.json();

//       if (!result.success) {
//         throw new Error(result.message || "Gagal logout");
//       }

//       // =========================
//       // HAPUS LOCAL STORAGE
//       // =========================
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       // =========================
//       // SUCCESS
//       // =========================
//       await Swal.fire({
//         icon: "success",
//         title: "Logout berhasil",
//         timer: 1000,
//         showConfirmButton: false,
//       });

//       router.push("/login");
//     } catch (err) {
//       console.error("LOGOUT ERROR:", err);

//       Swal.fire({
//         icon: "error",
//         title: "Logout gagal",
//         text: "Terjadi kesalahan saat logout.",
//       });
//     }
//   };

//   // =========================
//   // INITIAL AVATAR
//   // =========================
//   const getInitial = () => {
//     if (!user) {
//       return "?";
//     }

//     const name = user.nama || user.username;

//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <nav className="h-16 bg-white border-b shadow-sm px-4 sm:px-6 flex items-center justify-between">
//       {/* =========================
//           LEFT
//       ========================= */}
//       <div>
//         <h1 className="font-semibold text-lg text-slate-800">POS System</h1>
//       </div>

//       {/* =========================
//           RIGHT
//       ========================= */}
//       <div ref={profileRef} className="relative">
//         {/* PROFILE BUTTON */}
//         <button
//           type="button"
//           onClick={() => setOpenProfile((prev) => !prev)}
//           className="
//             flex
//             items-center
//             gap-2
//             rounded-lg
//             px-2
//             py-1.5
//             hover:bg-slate-100
//             transition
//           "
//         >
//           {/* AVATAR */}
//           <div
//             className="
//               w-9
//               h-9
//               rounded-full
//               bg-blue-600
//               text-white
//               flex
//               items-center
//               justify-center
//               font-semibold
//               text-sm
//             "
//           >
//             {getInitial()}
//           </div>

//           {/* USER INFO */}
//           <div className="hidden sm:flex flex-col items-start">
//             <span className="text-sm font-medium text-slate-800">
//               {user?.nama || user?.username}
//             </span>

//             <span className="text-xs text-slate-500">
//               {user?.role || "User"}
//             </span>
//           </div>

//           <ChevronDown
//             size={16}
//             className={`
//               text-slate-500
//               transition-transform
//               ${openProfile ? "rotate-180" : ""}
//             `}
//           />
//         </button>

//         {/* =========================
//             DROPDOWN
//         ========================= */}
//         {openProfile && (
//           <div
//             className="
//               absolute
//               right-0
//               top-12
//               w-64
//               bg-white
//               border
//               border-slate-200
//               rounded-xl
//               shadow-lg
//               overflow-hidden
//               z-50
//             "
//           >
//             {/* USER HEADER */}
//             <div className="px-4 py-3 border-b bg-slate-50">
//               <div className="flex items-center gap-3">
//                 {/* AVATAR */}
//                 <div
//                   className="
//                     w-10
//                     h-10
//                     rounded-full
//                     bg-blue-600
//                     text-white
//                     flex
//                     items-center
//                     justify-center
//                     font-semibold
//                   "
//                 >
//                   {getInitial()}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="font-medium text-slate-800 truncate">
//                     {user?.nama || user?.username}
//                   </p>

//                   <p className="text-xs text-slate-500 truncate">
//                     @{user?.username}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* MENU */}
//             <div className="p-2">
//               {/* PROFILE */}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setOpenProfile(false);
//                   router.push("/dashboard/user/Profileuser");
//                 }}
//                 className="
//                   w-full
//                   flex
//                   items-center
//                   gap-3
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   text-sm
//                   text-slate-700
//                   hover:bg-slate-100
//                   transition
//                   text-left
//                 "
//               >
//                 <User size={18} />
//                 <span>Profile</span>
//               </button>

//               {/* CHANGE PASSWORD */}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setOpenProfile(false);
//                   router.push("/dashboard/user/gantipass");
//                 }}
//                 className="
//                   w-full
//                   flex
//                   items-center
//                   gap-3
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   text-sm
//                   text-slate-700
//                   hover:bg-slate-100
//                   transition
//                   text-left
//                 "
//               >
//                 <KeyRound size={18} />
//                 <span>Change Password</span>
//               </button>

//               {/* SEPARATOR */}
//               <div className="my-2 border-t border-slate-200" />

//               {/* LOGOUT */}
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="
//                   w-full
//                   flex
//                   items-center
//                   gap-3
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   text-sm
//                   text-red-600
//                   hover:bg-red-50
//                   transition
//                   text-left
//                 "
//               >
//                 <LogOut size={18} />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, KeyRound, LogOut, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

interface User {
  id: number;
  username: string;
  nama: string;
  role: string;
  sessionToken: string;
  mustChangePassword: boolean;

  // Foto profile
  profilePhoto?: string | null;
}

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [openProfile, setOpenProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // =========================
  // GET USER
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("USER STORAGE ERROR:", error);

        localStorage.removeItem("user");
      }
    }
  }, []);

  // =========================
  // CLOSE DROPDOWN KLIK LUAR
  // =========================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    setOpenProfile(false);

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

      if (!user) {
        throw new Error("Data user tidak ditemukan");
      }

      // =========================
      // LOGOUT BACKEND
      // =========================
      const res = await fetch("http://localhost:8080/api/auth/logout", {
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
        throw new Error(result.message || "Gagal logout");
      }

      // =========================
      // HAPUS LOCAL STORAGE
      // =========================
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // =========================
      // SUCCESS
      // =========================
      await Swal.fire({
        icon: "success",
        title: "Logout berhasil",
        timer: 1000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err) {
      console.error("LOGOUT ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Logout gagal",
        text: "Terjadi kesalahan saat logout.",
      });
    }
  };

  // =========================
  // INITIAL AVATAR
  // =========================
  const getInitial = () => {
    if (!user) {
      return "?";
    }

    const name = user.nama || user.username;

    return name.charAt(0).toUpperCase();
  };

  // =========================
  // AVATAR COMPONENT
  // =========================

  const getProfilePhotoUrl = () => {
    if (!user?.profilePhoto) {
      return null;
    }

    return `http://localhost:8080${user.profilePhoto}`;
  };
  const Avatar = ({ size = "small" }: { size?: "small" | "large" }) => {
    const sizeClass =
      size === "small" ? "w-9 h-9 text-sm" : "w-10 h-10 text-sm";

    if (user?.profilePhoto) {
      return (
        <img
          src={getProfilePhotoUrl()!}
          alt="Profile"
          className={`${sizeClass} rounded-full object-cover ring-2 ring-slate-100`}
        />
      );
    }

    return (
      <div
        className={`
          ${sizeClass}
          rounded-full
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          font-semibold
        `}
      >
        {getInitial()}
      </div>
    );
  };

  return (
    <nav className="h-16 bg-white border-b shadow-sm px-4 sm:px-6 flex items-center justify-between">
      {/* =========================
          LEFT
      ========================= */}
      <div>
        <h1 className="font-semibold text-lg text-slate-800">POS System</h1>
      </div>

      {/* =========================
          RIGHT
      ========================= */}
      <div ref={profileRef} className="relative">
        {/* =========================
            PROFILE BUTTON
        ========================= */}
        <button
          type="button"
          onClick={() => setOpenProfile((prev) => !prev)}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-2
            py-1.5
            hover:bg-slate-100
            transition
          "
        >
          {/* AVATAR */}
          <Avatar size="small" />

          {/* USER INFO */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-slate-800">
              {user?.nama || user?.username}
            </span>

            <span className="text-xs text-slate-500">
              {user?.role || "User"}
            </span>
          </div>

          {/* ARROW */}
          <ChevronDown
            size={16}
            className={`
              text-slate-500
              transition-transform
              ${openProfile ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* =========================
            DROPDOWN
        ========================= */}
        {openProfile && (
          <div
            className="
              absolute
              right-0
              top-12
              w-64
              bg-white
              border
              border-slate-200
              rounded-xl
              shadow-lg
              overflow-hidden
              z-50
            "
          >
            {/* =========================
                USER HEADER
            ========================= */}
            <div className="px-4 py-3 border-b bg-slate-50">
              <div className="flex items-center gap-3">
                {/* AVATAR */}
                <Avatar size="large" />

                {/* USER INFO */}
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {user?.nama || user?.username}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    @{user?.username}
                  </p>

                  <p className="text-xs text-blue-600 truncate mt-0.5">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================
                MENU
            ========================= */}
            <div className="p-2">
              {/* PROFILE */}
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(false);

                  router.push("/dashboard/user/Profileuser");
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  text-slate-700
                  hover:bg-slate-100
                  transition
                  text-left
                "
              >
                <User size={18} />

                <span>Profile</span>
              </button>

              {/* CHANGE PASSWORD */}
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(false);

                  router.push("/dashboard/user/gantipass");
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  text-slate-700
                  hover:bg-slate-100
                  transition
                  text-left
                "
              >
                <KeyRound size={18} />

                <span>Change Password</span>
              </button>

              {/* SEPARATOR */}
              <div className="my-2 border-t border-slate-200" />

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  text-red-600
                  hover:bg-red-50
                  transition
                  text-left
                "
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
