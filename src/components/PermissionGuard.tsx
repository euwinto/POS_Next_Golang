"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PermissionGuardProps {
  menuCode: string;
  children: React.ReactNode;
}

export default function PermissionGuard({
  menuCode,
  children,
}: PermissionGuardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch("http://localhost:8080/api/menu/sidebar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setAllowed(false);
          return;
        }

        const result = await res.json();

        const menus = result.data || [];

        const menu = menus.find((item: any) => item.MenuCode === menuCode);

        if (!menu || menu.CanView !== true) {
          setAllowed(false);
          return;
        }

        setAllowed(true);
      } catch (error) {
        console.error("CHECK PERMISSION ERROR:", error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [menuCode, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking permission...</div>
      </div>
    );
  }

  // if (!allowed) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
  //         <div className="text-6xl mb-4">🚫</div>

  //         <h1 className="text-3xl font-bold text-red-600 mb-3">403</h1>

  //         <h2 className="text-xl font-semibold mb-2">Access Denied</h2>

  //         <p className="text-gray-500 mb-6">
  //           Anda tidak memiliki permission untuk mengakses halaman ini.
  //         </p>

  //         <button
  //           onClick={() => router.push("/dashboard")}
  //           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  //         >
  //           Kembali ke Dashboard
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  if (!allowed) {
    router.replace("/errors/403");
    return null;
  }

  return <>{children}</>;
}
