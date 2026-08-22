// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Children, useState } from "react";

// export default function Sidebar() {
//   const path = usePathname();
//   const [open, setOpen] = useState(true);
//   const [masterOpen, setMasterOpen] = useState(false);

//   const menu = [
//     { name: "Dashboard", href: "/dashboard", icon: "🏠" },

//     {
//       name: "Master",
//       icon: "📂",
//       children: [
//         {
//           name: "Produk",
//           href: "/dashboard/master/produk",
//           icon: "📦",
//         },
//         {
//           name: "Kategori",
//           href: "/dashboard/master/kategori",
//           icon: "🏷️",
//         },
//       ],
//     },
//     {
//       name: "Transaksi",
//       icon: "💰",
//       children: [
//         {
//           name: "POS / Kasir",
//           href: "/dashboard/transaksi",
//         },
//         {
//           name: "Daftar Transaksi",
//           href: "/dashboard/transaksi/lstransaksi",
//         },
//       ],
//     },
//     { name: "User", href: "/dashboard/user", icon: "👤" },
//   ];

//   return (
//     <div
//       className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
//         open ? "w-60" : "w-16"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         {open && <h1 className="font-bold">POS</h1>}

//         <button
//           onClick={() => setOpen(!open)}
//           className="text-sm bg-gray-700 px-2 py-1 rounded"
//         >
//           ☰
//         </button>
//       </div>

//       {/* Menu */}
//       <div className="flex flex-col gap-2 px-2">
//         {menu.map((item: any, index) => {
//           if (item.children) {
//             return (
//               <div key={index}>
//                 <div
//                   onClick={() => setMasterOpen(!masterOpen)}
//                   className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700"
//                 >
//                   <span>{item.icon}</span>
//                   {open && <span>{item.name}</span>}
//                 </div>

//                 {masterOpen &&
//                   open &&
//                   item.children.map((child: any) => (
//                     <Link key={child.href} href={child.href}>
//                       <div
//                         className={`ml-6 flex items-center gap-2 p-2 rounded ${
//                           path === child.href
//                             ? "bg-blue-600"
//                             : "hover:bg-gray-700 text-gray-300"
//                         }`}
//                       >
//                         <span>{child.icon}</span>
//                         <span>{child.name}</span>
//                       </div>
//                     </Link>
//                   ))}
//               </div>
//             );
//           }

//           const active = path === item.href;

//           return (
//             <Link key={item.href} href={item.href}>
//               <div
//                 className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
//                   active ? "bg-blue-600" : "hover:bg-gray-700 text-gray-300"
//                 }`}
//               >
//                 <span>{item.icon}</span>
//                 {open && <span>{item.name}</span>}
//               </div>
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
  const [menus, setMenus] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<any>({});

  const getMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      const result = await res.json();

      setMenus(result.data || []);
    } catch (err) {
      console.error(err);
      setMenus([]);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  // PARENT MENU
  const parentMenus = menus.filter(
    (x) => x.ParentID === null || x.ParentID === 0
  );

  // CHILD MENU
  const childMenus = (parentId: number) => {
    return menus.filter((x) => Number(x.ParentID) === Number(parentId));
  };

  const toggleMenu = (id: number) => {
    setOpenMenu((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">POS SYSTEM</h1>

      <div className="flex flex-col gap-1">
        {parentMenus.map((item, index) => {
          const Icon =
            (Icons[item.Icon as keyof typeof Icons] as LucideIcon) ||
            Icons.Circle;

          const childs = childMenus(item.ID);

          // ADA CHILD
          if (childs.length > 0) {
            return (
              <div key={index}>
                <button
                  onClick={() => toggleMenu(item.ID)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.MenuName}</span>
                  </div>

                  {openMenu[item.ID] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {openMenu[item.ID] && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {childs.map((child: any, childIndex: number) => {
                      const ChildIcon =
                        (Icons[
                          child.Icon as keyof typeof Icons
                        ] as LucideIcon) || Icons.Circle;

                      return (
                        <Link
                          key={childIndex}
                          href={child.Url}
                          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-sm"
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

          // TANPA CHILD
          return (
            <Link
              key={index}
              href={item.Url}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800"
            >
              <Icon size={18} />
              <span>{item.MenuName}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
