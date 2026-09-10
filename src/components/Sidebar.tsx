// // "use client";

// // import Link from "next/link";
// // import { useEffect, useState } from "react";
// // import * as Icons from "lucide-react";
// // import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";

// // export default function Sidebar() {
// //   const [menus, setMenus] = useState<any[]>([]);
// //   const [openMenu, setOpenMenu] = useState<any>({});

// //   const getMenu = async () => {
// //     try {
// //       const res = await fetch("/api/menu");
// //       const result = await res.json();

// //       setMenus(result.data || []);
// //     } catch (err) {
// //       console.error(err);
// //       setMenus([]);
// //     }
// //   };

// //   useEffect(() => {
// //     getMenu();
// //   }, []);

// //   // PARENT MENU
// //   const parentMenus = menus.filter(
// //     (x) => x.ParentID === null || x.ParentID === 0
// //   );

// //   // CHILD MENU
// //   const childMenus = (parentId: number) => {
// //     return menus.filter((x) => Number(x.ParentID) === Number(parentId));
// //   };

// //   const toggleMenu = (id: number) => {
// //     setOpenMenu((prev: any) => ({
// //       ...prev,
// //       [id]: !prev[id],
// //     }));
// //   };

// //   return (
// //     <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
// //       <h1 className="text-xl font-bold mb-6">POS SYSTEM</h1>

// //       <div className="flex flex-col gap-1">
// //         {parentMenus.map((item, index) => {
// //           const Icon =
// //             (Icons[item.Icon as keyof typeof Icons] as LucideIcon) ||
// //             Icons.Circle;

// //           const childs = childMenus(item.ID);

// //           // ADA CHILD
// //           if (childs.length > 0) {
// //             return (
// //               <div key={index}>
// //                 <button
// //                   onClick={() => toggleMenu(item.ID)}
// //                   className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-800"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <Icon size={18} />
// //                     <span>{item.MenuName}</span>
// //                   </div>

// //                   {openMenu[item.ID] ? (
// //                     <ChevronDown size={16} />
// //                   ) : (
// //                     <ChevronRight size={16} />
// //                   )}
// //                 </button>

// //                 {openMenu[item.ID] && (
// //                   <div className="ml-6 mt-1 flex flex-col gap-1">
// //                     {childs.map((child: any, childIndex: number) => {
// //                       const ChildIcon =
// //                         (Icons[
// //                           child.Icon as keyof typeof Icons
// //                         ] as LucideIcon) || Icons.Circle;

// //                       return (
// //                         <Link
// //                           key={childIndex}
// //                           href={child.Url}
// //                           className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-sm"
// //                         >
// //                           <ChildIcon size={16} />
// //                           <span>{child.MenuName}</span>
// //                         </Link>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           }

// //           // TANPA CHILD
// //           return (
// //             <Link
// //               key={index}
// //               href={item.Url}
// //               className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800"
// //             >
// //               <Icon size={18} />
// //               <span>{item.MenuName}</span>
// //             </Link>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import * as Icons from "lucide-react";
// import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";

// export default function Sidebar() {
//   const [menus, setMenus] = useState<any[]>([]);
//   const [openMenu, setOpenMenu] = useState<any>({});

//   const getMenu = async () => {
//     try {
//       // const res = await fetch("http://localhost:8080/api/menu");
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:8080/api/menu/sidebar", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Gagal mengambil menu");
//       }

//       const result = await res.json();

//       setMenus(result.data || []);
//     } catch (err) {
//       console.error("GET MENU ERROR:", err);
//       setMenus([]);
//     }
//   };

//   useEffect(() => {
//     getMenu();
//   }, []);

//   const parentMenus = menus.filter(
//     (x) => x.ParentID === null || x.ParentID === 0
//   );

//   const childMenus = (parentId: number) => {
//     return menus.filter((x) => Number(x.ParentID) === Number(parentId));
//   };

//   const toggleMenu = (id: number) => {
//     setOpenMenu((prev: any) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
//       <h1 className="text-xl font-bold mb-6">POS SYSTEM</h1>

//       <div className="flex flex-col gap-1">
//         {parentMenus.map((item, index) => {
//           const Icon =
//             (Icons[item.Icon as keyof typeof Icons] as LucideIcon) ||
//             Icons.Circle;

//           const childs = childMenus(item.ID);

//           if (childs.length > 0) {
//             return (
//               <div key={index}>
//                 <button
//                   onClick={() => toggleMenu(item.ID)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-800"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon size={18} />
//                     <span>{item.MenuName}</span>
//                   </div>

//                   {openMenu[item.ID] ? (
//                     <ChevronDown size={16} />
//                   ) : (
//                     <ChevronRight size={16} />
//                   )}
//                 </button>

//                 {openMenu[item.ID] && (
//                   <div className="ml-6 mt-1 flex flex-col gap-1">
//                     {childs.map((child: any, childIndex: number) => {
//                       const ChildIcon =
//                         (Icons[
//                           child.Icon as keyof typeof Icons
//                         ] as LucideIcon) || Icons.Circle;

//                       return (
//                         <Link
//                           key={childIndex}
//                           href={child.Url}
//                           className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-sm"
//                         >
//                           <ChildIcon size={16} />
//                           <span>{child.MenuName}</span>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <Link
//               key={index}
//               href={item.Url}
//               className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800"
//             >
//               <Icon size={18} />
//               <span>{item.MenuName}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar() {
  // =========================================================
  // STATE
  // =========================================================

  const [menus, setMenus] = useState<any[]>([]);

  // Untuk sidebar expanded
  const [openMenu, setOpenMenu] = useState<Record<number, boolean>>({});

  // Untuk desktop collapsed + hover
  const [hoverMenu, setHoverMenu] = useState<number | null>(null);

  // Untuk mobile collapsed + click
  const [mobileMenu, setMobileMenu] = useState<number | null>(null);

  // Sidebar collapsed / expanded
  const [collapsed, setCollapsed] = useState(false);

  // Deteksi mobile
  const [isMobile, setIsMobile] = useState(false);

  // =========================================================
  // DETECT MOBILE
  // =========================================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // =========================================================
  // GET MENU
  // =========================================================

  const getMenu = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token tidak ditemukan");
        setMenus([]);
        return;
      }

      const res = await fetch("http://localhost:8080/api/menu/sidebar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil menu");
      }

      const result = await res.json();

      setMenus(result.data || []);
    } catch (err) {
      console.error("GET MENU ERROR:", err);
      setMenus([]);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  // =========================================================
  // CLOSE MOBILE MENU WHEN CLICK OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMobile) return;

      const target = event.target as HTMLElement;

      if (!target.closest("[data-sidebar-menu]")) {
        setMobileMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobile]);

  // =========================================================
  // PARENT MENU
  // =========================================================

  const parentMenus = menus.filter(
    (x) => x.ParentID === null || x.ParentID === 0
  );

  // =========================================================
  // CHILD MENU
  // =========================================================

  const childMenus = (parentId: number) => {
    return menus.filter((x) => Number(x.ParentID) === Number(parentId));
  };

  // =========================================================
  // TOGGLE EXPANDED MENU
  // =========================================================

  const toggleMenu = (id: number) => {
    setOpenMenu((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =========================================================
  // TOGGLE MOBILE MENU
  // =========================================================

  const toggleMobileMenu = (id: number) => {
    setMobileMenu((prev) => (prev === id ? null : id));
  };

  // =========================================================
  // COLLAPSE SIDEBAR
  // =========================================================

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);

    // Tutup semua popup ketika berubah mode
    setHoverMenu(null);
    setMobileMenu(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <aside
      className={`
        relative
        min-h-screen
        bg-slate-900
        text-white
        transition-all
        duration-300
        ease-in-out
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className={`
    flex
    items-center
    h-16
    border-b
    border-slate-700
    px-3
    ${collapsed ? "justify-center" : "justify-between"}
  `}
      >
        {/* LOGO / TITLE */}

        <h1
          className={`
      font-bold
      whitespace-nowrap
      transition-all
      duration-300
      ${collapsed ? "text-sm" : "text-xl"}
    `}
        >
          POS
        </h1>

        {/* TOGGLE BUTTON */}

        <button
          type="button"
          onClick={toggleSidebar}
          className="
      flex
      items-center
      justify-center
      w-9
      h-9
      rounded-lg
      hover:bg-slate-800
      transition
    "
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="p-3">
        <div className="flex flex-col gap-1">
          {parentMenus.map((item, index) => {
            const Icon =
              (Icons[item.Icon as keyof typeof Icons] as LucideIcon) ||
              Icons.Circle;

            const childs = childMenus(item.ID);

            // =================================================
            // MENU DENGAN CHILD
            // =================================================

            if (childs.length > 0) {
              return (
                <div
                  key={index}
                  data-sidebar-menu
                  className="relative"
                  // =============================================
                  // DESKTOP COLLAPSED → HOVER
                  // =============================================
                  onMouseEnter={() => {
                    if (collapsed && !isMobile) {
                      setHoverMenu(item.ID);
                    }
                  }}
                  onMouseLeave={() => {
                    if (collapsed && !isMobile) {
                      setHoverMenu(null);
                    }
                  }}
                >
                  {/* =========================================
                        PARENT BUTTON
                    ========================================= */}

                  <button
                    type="button"
                    onClick={() => {
                      // =======================================
                      // SIDEBAR EXPANDED
                      // =======================================

                      if (!collapsed) {
                        toggleMenu(item.ID);
                        return;
                      }

                      // =======================================
                      // MOBILE + COLLAPSED
                      // =======================================

                      if (isMobile) {
                        toggleMobileMenu(item.ID);
                      }

                      // =======================================
                      // DESKTOP + COLLAPSED
                      //
                      // Tidak melakukan apa-apa.
                      // Desktop menggunakan hover.
                      // =======================================
                    }}
                    className={`
                        w-full
                        flex
                        items-center
                        rounded-lg
                        transition
                        duration-200
                        hover:bg-slate-800
                        ${
                          collapsed
                            ? "justify-center px-2 py-3"
                            : "justify-between px-3 py-2"
                        }
                      `}
                    title={collapsed ? item.MenuName : undefined}
                  >
                    {/* ICON + TEXT */}

                    <div
                      className={`
                          flex
                          items-center
                          ${collapsed ? "justify-center" : "gap-3"}
                        `}
                    >
                      <Icon size={18} />

                      {!collapsed && (
                        <span className="whitespace-nowrap">
                          {item.MenuName}
                        </span>
                      )}
                    </div>

                    {/* ARROW */}

                    {!collapsed &&
                      (openMenu[item.ID] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </button>

                  {/* =================================================
                        DESKTOP COLLAPSED + HOVER SUBMENU
                    ================================================= */}

                  {collapsed && !isMobile && hoverMenu === item.ID && (
                    <div
                      className="
                            absolute
                            left-full
                            top-0
                            ml-2
                            min-w-[210px]
                            bg-slate-900
                            text-white
                            rounded-lg
                            shadow-2xl
                            border
                            border-slate-700
                            p-2
                            z-[999]
                          "
                    >
                      {/* TITLE */}

                      <div
                        className="
                              px-3
                              py-2
                              mb-1
                              text-sm
                              font-semibold
                              border-b
                              border-slate-700
                            "
                      >
                        {item.MenuName}
                      </div>

                      {/* CHILD */}

                      <div className="flex flex-col gap-1">
                        {childs.map((child: any, childIndex: number) => {
                          const ChildIcon =
                            (Icons[
                              child.Icon as keyof typeof Icons
                            ] as LucideIcon) || Icons.Circle;

                          return (
                            <Link
                              key={childIndex}
                              href={child.Url}
                              className="
                                      flex
                                      items-center
                                      gap-3
                                      px-3
                                      py-2
                                      rounded-md
                                      hover:bg-slate-800
                                      text-sm
                                      transition
                                      whitespace-nowrap
                                    "
                            >
                              <ChildIcon size={16} />

                              <span>{child.MenuName}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                        MOBILE COLLAPSED + CLICK SUBMENU
                    ================================================= */}

                  {collapsed && isMobile && mobileMenu === item.ID && (
                    <div
                      className="
                            absolute
                            left-full
                            top-0
                            ml-2
                            min-w-[210px]
                            bg-slate-900
                            text-white
                            rounded-lg
                            shadow-2xl
                            border
                            border-slate-700
                            p-2
                            z-[999]
                          "
                    >
                      {/* TITLE */}

                      <div
                        className="
                              px-3
                              py-2
                              mb-1
                              text-sm
                              font-semibold
                              border-b
                              border-slate-700
                            "
                      >
                        {item.MenuName}
                      </div>

                      {/* CHILD */}

                      <div className="flex flex-col gap-1">
                        {childs.map((child: any, childIndex: number) => {
                          const ChildIcon =
                            (Icons[
                              child.Icon as keyof typeof Icons
                            ] as LucideIcon) || Icons.Circle;

                          return (
                            <Link
                              key={childIndex}
                              href={child.Url}
                              onClick={() => {
                                setMobileMenu(null);
                              }}
                              className="
                                      flex
                                      items-center
                                      gap-3
                                      px-3
                                      py-2
                                      rounded-md
                                      hover:bg-slate-800
                                      text-sm
                                      transition
                                      whitespace-nowrap
                                    "
                            >
                              <ChildIcon size={16} />

                              <span>{child.MenuName}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                        EXPANDED SUBMENU
                    ================================================= */}

                  {!collapsed && openMenu[item.ID] && (
                    <div
                      className="
                            ml-6
                            mt-1
                            flex
                            flex-col
                            gap-1
                          "
                    >
                      {childs.map((child: any, childIndex: number) => {
                        const ChildIcon =
                          (Icons[
                            child.Icon as keyof typeof Icons
                          ] as LucideIcon) || Icons.Circle;

                        return (
                          <Link
                            key={childIndex}
                            href={child.Url}
                            className="
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-2
                                    rounded-md
                                    hover:bg-slate-800
                                    text-sm
                                    transition
                                  "
                          >
                            <ChildIcon size={16} />

                            <span>{child.MenuName}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // =================================================
            // MENU TANPA CHILD
            // =================================================

            return (
              <Link
                key={index}
                href={item.Url}
                className={`
                    flex
                    items-center
                    rounded-lg
                    hover:bg-slate-800
                    transition
                    duration-200
                    ${
                      collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2"
                    }
                  `}
                title={collapsed ? item.MenuName : undefined}
              >
                <Icon size={18} />

                {!collapsed && (
                  <span className="whitespace-nowrap">{item.MenuName}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
